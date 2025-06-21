import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cita, EstadoCita } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citas: Cita[] = [];
  private citasSubject = new BehaviorSubject<Cita[]>(this.citas);

  constructor() {}

  getCitas(): Observable<Cita[]> {
    return this.citasSubject.asObservable();
  }

  getCitaById(id: string): Cita | undefined {
    return this.citas.find(cita => cita.id === id);
  }

  getCitasPorCliente(clienteId: string): Observable<Cita[]> {
    return new Observable(observer => {
      this.citasSubject.subscribe(citas => {
        observer.next(citas.filter(c => c.clienteId === clienteId));
      });
    });
  }

  crearCita(cita: Omit<Cita, 'id' | 'estado'>): Cita {
    const nuevaCita: Cita = {
      ...cita,
      id: Date.now().toString(),
      estado: EstadoCita.PENDIENTE
    };
    this.citas.push(nuevaCita);
    this.citasSubject.next([...this.citas]);
    return nuevaCita;
  }

  actualizarEstadoCita(id: string, estado: EstadoCita): boolean {
    const index = this.citas.findIndex(c => c.id === id);
    if (index !== -1) {
      this.citas[index].estado = estado;
      this.citasSubject.next([...this.citas]);
      return true;
    }
    return false;
  }

  cancelarCita(id: string): boolean {
    return this.actualizarEstadoCita(id, EstadoCita.CANCELADA);
  }
}
