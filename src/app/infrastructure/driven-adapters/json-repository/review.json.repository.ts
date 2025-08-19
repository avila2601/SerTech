import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IReviewRepository } from '../../../core/domain/repositories/review.repository';
import { Review } from '../../../core/domain/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewJsonRepository extends IReviewRepository {
  private apiUrl = 'https://sertech-backend.onrender.com/reviews';

  constructor(private http: HttpClient) {
    super();
  }

  getByTechnicianId(technicianId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${technicianId}`);
  }

  reviewExists(appointmentId: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/exists/${appointmentId}`).pipe(
      map(response => response.exists)
    );
  }

  addReview(review: Omit<Review, 'id'>): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
}
