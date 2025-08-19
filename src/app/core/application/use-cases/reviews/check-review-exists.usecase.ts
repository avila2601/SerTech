import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReviewRepository } from '../../../domain/repositories/review.repository';

@Injectable({
  providedIn: 'root'
})
export class CheckReviewExistsUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  execute(appointmentId: string): Observable<boolean> {
    return this.reviewRepository.reviewExists(appointmentId);
  }
}
