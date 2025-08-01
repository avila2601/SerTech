import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private userStatusSubject = new BehaviorSubject<void>(undefined);
  userStatus$ = this.userStatusSubject.asObservable();

  /**
   * Call to notify interested parties that user status has changed
   */
  updateUserStatus(): void {
    this.userStatusSubject.next();
  }
}
