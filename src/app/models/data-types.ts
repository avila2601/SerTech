// Temporary data types for reading Spanish JSON files during transition
// These will be removed in Phase 5 when we migrate data files to English

export interface CitaData {
  id: string;
  clienteId: string;
  tecnicoId: string;
  servicioId: string;
  equipoId?: string;
  fecha: Date;
  hora: string;
  estado: string;
  notas?: string;
  direccion?: string;
}

export interface ClienteData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface ServicioData {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number;
  categoria: string;
}

export interface EquipoData {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  tipo: string;
  descripcion?: string;
}

export interface ResenaData {
  id: string;
  tecnicoId: string;
  clienteId: string;
  cliente: string;
  comentario: string;
  calificacion: number;
  fecha: string;
}

export interface TecnicoData {
  id: string;
  nombre: string;
  especialidad: string;
  calificacion: number;
  disponible: boolean;
  foto?: string;
  contraseña: string;
}
