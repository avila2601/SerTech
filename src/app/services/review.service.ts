import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';

export interface Review {
  id: string;
  technicianId: string;
  clientId?: string;
  clientName: string;
  comment: string;
  rating: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_URL = 'https://sertech-backend.onrender.com';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/reviews`);
  }

  getReviewsByTechnician(technicianId: string): Observable<Review[]> {
    return this.getReviews().pipe(
      map(reviews => reviews.filter(r => r.technicianId === technicianId))
    );
  }

  addReview(review: Omit<Review, 'id'>): Observable<Review> {
    return this.getReviews().pipe(
      map(reviews => {
        const newId = reviews.length > 0
          ? (Math.max(...reviews.map(r => parseInt(r.id))) + 1).toString()
          : '1';

        const newReview: Review = {
          ...review,
          id: newId
        };

        const updated = [...reviews, newReview];
        this.http.put(`${this.API_URL}/reviews`, updated).subscribe();
        return newReview;
      })
    );
  }

  reviewExists(technicianId: string, clientId: string, clientName: string): Observable<boolean> {
    return this.getReviews().pipe(
      map(reviews =>
        reviews.some(r =>
          r.technicianId === technicianId &&
          (r.clientId === clientId || r.clientName === clientName)
        )
      )
    );
  }
}
