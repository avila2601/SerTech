// English services - Phase 2 migration
export { ClientService } from './client.service';
export { TechnicianService } from './technician.service';
export { AppointmentService } from './appointment.service';
export { ServiceService } from './service.service';
export { ReviewService } from './review.service';
export { UserStateService } from './user-state.service';

// Original Spanish services (for backward compatibility) - now redirected to English services
export { ClientService as ClienteService } from './client.service';
export { TechnicianService as TecnicoService } from './technician.service';
export { AppointmentService as CitaService } from './appointment.service';
export { ServiceService as ServicioService } from './service.service';
export { ReviewService as ResenaService } from './review.service';

// Shared services
export { StorageService } from './storage.service';
