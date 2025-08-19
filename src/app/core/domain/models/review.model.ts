export interface Review {
  id: string;
  appointmentId: string;
  technicianId: string;
  clientId: string;
  clientName: string;
  comment: string;
  rating: number;
  date: string;
}
