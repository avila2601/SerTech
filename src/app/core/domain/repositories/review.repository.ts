import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

export abstract class IReviewRepository {
  abstract getByTechnicianId(technicianId: string): Observable<Review[]>;
  abstract reviewExists(appointmentId: string): Observable<boolean>;
  abstract addReview(review: Omit<Review, 'id'>): Observable<Review>;
}
