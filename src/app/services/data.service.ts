import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any>({});
  private columnsSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {}

  fetchData(): void {
    console.log('Fetching data...');

    const usersRes = this.http.get<any[]>('data/users.json').pipe(
      catchError(error => this.handleError(error, 'users.json'))
    )
        
    const brandsRes = this.http.get<any[]>('data/brands.json').pipe(
      catchError(error => this.handleError(error, 'brands.json'))
    );
    const productsRes = this.http.get<any[]>('data/products.json').pipe(
      catchError(error => this.handleError(error, 'products.json'))
    );
    const reviewsRes = this.http.get<any[]>('data/reviews.json').pipe(
      catchError(error => this.handleError(error, 'reviews.json'))
    );
    const columnsRes = this.http.get<any>('data/columns.json').pipe(
      catchError(error => this.handleError(error, 'columns.json'))
    );

    forkJoin([usersRes, brandsRes, productsRes, reviewsRes, columnsRes]).pipe(
      map(([users, brands, products, reviews, columnsData]) => {
        console.log('Data fetched successfully:', { users, brands, products, reviews, columnsData });
        return {
          data: { users, brands, products, reviews },
          columns: columnsData
        };
      })
    ).subscribe({
      next: ({ data, columns }) => {
        console.log('Updating subjects with fetched data...', data, columns);
        this.dataSubject.next(data);
        this.columnsSubject.next(columns);
      },
      error: (error) => {
        console.error('Error fetching combined data:', error);
      }
    });
  }

  private handleError(error: HttpErrorResponse, file: string): Observable<never> {
    let errorMessage = `Error fetching ${file}: `;
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage += `Client-side error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage += `Server-side error: ${error.status} ${error.message}`;
    }
    console.error(errorMessage);
    // Optionally, add user-friendly error handling here (e.g., show a message to the user)
    return throwError(() => new Error(errorMessage));
  }

  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }

  getColumns(): Observable<any> {
    return this.columnsSubject.asObservable();
  }
}
