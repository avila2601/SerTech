import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cita } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  constructor(private storageService: StorageService) {}

  getCitas(): Observable<Cita[]> {
    return this.storageService.getCitas();
  }

  getCitasPorCliente(clienteId: string): Observable<Cita[]> {
    return this.storageService.getCitasPorCliente(clienteId);
  }

  crearCita(cita: Omit<Cita, 'id' | 'estado'>): Observable<Cita> {
    return this.storageService.crearCita(cita);
  }

  cancelarCita(citaId: string): void {
    this.storageService.cancelarCita(citaId);
  }
}
