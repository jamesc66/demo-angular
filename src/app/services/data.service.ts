import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private dataSubject = new BehaviorSubject<any>({});
  private columnsSubject = new BehaviorSubject<any>({});
  private formsSubject = new BehaviorSubject<any>({});

  loading$ = this.loadingSubject.asObservable();
  data$ = this.dataSubject.asObservable();
  columns$ = this.columnsSubject.asObservable();
  forms$ = this.formsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchData(): void {
    console.log('Fetching data...');

    const usersRes = this.http.get<any[]>('assets/data/users.json').pipe(
      catchError(error => this.handleError(error, 'users.json'))
    );
    const brandsRes = this.http.get<any[]>('assets/data/brands.json').pipe(
      catchError(error => this.handleError(error, 'brands.json'))
    );
    const productsRes = this.http.get<any[]>('assets/data/products.json').pipe(
      catchError(error => this.handleError(error, 'products.json'))
    );
    const reviewsRes = this.http.get<any[]>('assets/data/reviews.json').pipe(
      catchError(error => this.handleError(error, 'reviews.json'))
    );
    const columnsRes = this.http.get<any>('assets/data/columns.json').pipe(
      catchError(error => this.handleError(error, 'columns.json'))
    );
    const formsRes = this.http.get<any>('assets/data/forms.json').pipe(
      catchError(error => this.handleError(error, 'forms.json'))
    );

    forkJoin([usersRes, brandsRes, productsRes, reviewsRes, columnsRes, formsRes]).pipe(
      map(([users, brands, products, reviews, columnsData, formsData]) => {
        console.log('Data fetched successfully:', { users, brands, products, reviews, columnsData, formsData });
        return {
          data: { users, brands, products, reviews },
          columns: columnsData,
          forms: formsData
        };
      })
    ).subscribe({
      next: ({ data, columns, forms }) => {
        console.log('Updating subjects with fetched data...', data, columns, forms);
        this.dataSubject.next(data);
        this.columnsSubject.next(columns);
        this.formsSubject.next(forms);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error fetching combined data:', error);
        this.loadingSubject.next(false);
      }
    });
  }

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

  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }

  getColumns(): Observable<any> {
    return this.columnsSubject.asObservable();
  }

  getForms(): Observable<any> {
    return this.formsSubject.asObservable();
  }
}
