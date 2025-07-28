import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cita } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citasSubject = new BehaviorSubject<Cita[]>([]);

  constructor(private storageService: StorageService) {
    this.refreshCitas();
  }

  private refreshCitas(): void {
    this.storageService.getCitas().subscribe(citas => {
      this.citasSubject.next(citas);
    });
  }

  getCitas(): Observable<Cita[]> {
    return this.citasSubject.asObservable();
  }

  getCitasPorCliente(clienteId: string): Observable<Cita[]> {
    return this.storageService.getCitasPorCliente(clienteId);
  }

  crearCita(cita: Omit<Cita, 'id' | 'estado'>): Observable<Cita> {
    return new Observable(observer => {
      this.storageService.crearCita(cita).subscribe({
        next: (nuevaCita) => {
          observer.next(nuevaCita);
          this.refreshCitas();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  cancelarCita(citaId: string): void {
    this.storageService.cancelarCita(citaId);
    this.refreshCitas();
  }

  actualizarClienteEnCita(citaId: string, clienteId: string): void {
    this.storageService.actualizarCita(citaId, { clienteId }).subscribe(() => {
      this.refreshCitas();
    });
  }
}
