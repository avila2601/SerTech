import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReviewRepository } from '../../../domain/repositories/review.repository';
import { Review } from '../../../domain/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class GetReviewsByTechnicianIdUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  execute(technicianId: string): Observable<Review[]> {
    return this.reviewRepository.getByTechnicianId(technicianId);
  }
}
