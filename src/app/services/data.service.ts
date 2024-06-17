import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ComponentConfig {
  id: string;
  data: string;
}

interface ComponentData {
  [key: string]: any[];
}

interface AdditionalData {
  columns: any;
  forms: any;
  charts: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private dataSubject = new BehaviorSubject<ComponentData>({});
  private columnsSubject = new BehaviorSubject<any>({});
  private formsSubject = new BehaviorSubject<any>({});
  private chartsSubject = new BehaviorSubject<any>({});

  loading$ = this.loadingSubject.asObservable();
  data$ = this.dataSubject.asObservable();
  columns$ = this.columnsSubject.asObservable();
  forms$ = this.formsSubject.asObservable();
  charts$ = this.chartsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Helper function to fetch JSON data
  private fetchJsonData(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, url))
    );
  }

  // Function to fetch all component data based on the configuration
  private fetchComponentData(components: ComponentConfig[], baseUrl: string): Observable<ComponentData> {
    const componentObservables = components.map(component =>
      this.fetchJsonData(`${baseUrl}${component.data}`).pipe(
        map(data => ({ id: component.id, data }))
      )
    );

    return forkJoin(componentObservables).pipe(
      map(componentsData =>
        componentsData.reduce((acc: ComponentData, component) => {
          acc[component.id] = component.data;
          return acc;
        }, {})
      )
    );
  }

  // Function to fetch additional data (columns and forms)
  private fetchAdditionalData(): Observable<AdditionalData> {
    return forkJoin({
      columns: this.fetchJsonData('assets/data/columns.json'),
      forms: this.fetchJsonData('assets/data/forms.json'),
      charts: this.fetchJsonData('assets/data/charts.json')
    });
  }

  // Main function to load all data and update the state
  fetchData(): void {
    console.log('Fetching data...');

    this.fetchJsonData('assets/data/config.json').subscribe({
      next: (config: { components: ComponentConfig[] }) => {
        const baseUrl = 'assets/data/';

        forkJoin({
          componentData: this.fetchComponentData(config.components, baseUrl),
          additionalData: this.fetchAdditionalData()
        }).subscribe({
          next: ({ componentData, additionalData }) => {
            console.log('Data fetched successfully:', componentData, additionalData);
            this.dataSubject.next(componentData);
            this.columnsSubject.next(additionalData.columns);
            this.formsSubject.next(additionalData.forms);
            this.chartsSubject.next(additionalData.charts);
            this.loadingSubject.next(false);
          },
          error: (error) => {
            console.error('Error fetching combined data:', error);
            this.loadingSubject.next(false);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching config data:', error);
        this.loadingSubject.next(false);
      }
    });
  }

  // Error handling function
  private handleError(error: HttpErrorResponse, file: string): Observable<never> {
    let errorMessage = `Error fetching ${file}: `;
    if (error.error instanceof ErrorEvent) {
      errorMessage += `Client-side error: ${error.error.message}`;
    } else {
      errorMessage += `Server-side error: ${error.status} ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getData(): Observable<ComponentData> {
    return this.dataSubject.asObservable();
  }

  getColumns(): Observable<any> {
    return this.columnsSubject.asObservable();
  }

  getForms(): Observable<any> {
    return this.formsSubject.asObservable();
  }

  getCharts(): Observable<any> {
    return this.chartsSubject.asObservable();
  }
}
