import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Generic HTTP data source for API communication
 * Centralizes HTTP operations for the storage layer
 */
@Injectable({
  providedIn: 'root'
})
export class HttpDataSource {
  private readonly baseUrl = 'https://sertech-backend.onrender.com';

  constructor(private http: HttpClient) {}

  /**
   * HTTP GET request
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  /**
   * HTTP PUT request
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  /**
   * HTTP POST request
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  /**
   * HTTP DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
