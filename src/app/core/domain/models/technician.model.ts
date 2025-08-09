export interface Technician {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  photo?: string;
  password?: string; // Should be optional or not present in the model sent to the client
}
