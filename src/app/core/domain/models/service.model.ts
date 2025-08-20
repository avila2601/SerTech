import { ServiceCategory } from '../../../models';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDuration: number;
  category: ServiceCategory;
}
