import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReviewRepository } from '../../../domain/repositories/review.repository';
import { Review } from '../../../domain/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class AddReviewUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  execute(review: Omit<Review, 'id'>): Observable<Review> {
    return this.reviewRepository.addReview(review);
  }
}
