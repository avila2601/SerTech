import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Client } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSubject = new BehaviorSubject<Client[]>([]);

  constructor(private storageService: StorageService) {
    this.refreshClients();
  }

  private refreshClients(): void {
    this.storageService.getClients().subscribe((clients: Client[]) => {
      this.clientsSubject.next(clients);
    });
  }

  getClients(): Observable<Client[]> {
    return this.clientsSubject.asObservable();
  }

  addClient(client: Omit<Client, 'id'>): Observable<Client> {
    return new Observable(observer => {
      this.storageService.addClient(client).subscribe({
        next: (newClient) => {
          observer.next(newClient);
          this.refreshClients();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client | null> {
    return new Observable(observer => {
      this.storageService.updateClient(id, data).subscribe({
        next: (updated) => {
          observer.next(updated);
          this.refreshClients();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
