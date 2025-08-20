import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceCategory } from '../../../../models';

export interface ServiceTypeMapping {
  type: string;
  category: ServiceCategory;
  defaultIcon: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapServiceTypeToCategoryUseCase {

  private readonly typeMapping: ServiceTypeMapping[] = [
    { type: 'repair', category: ServiceCategory.REPAIR, defaultIcon: '🔧' },
    { type: 'maintenance', category: ServiceCategory.MAINTENANCE, defaultIcon: '⚙️' },
    { type: 'installation', category: ServiceCategory.INSTALLATION, defaultIcon: '🔌' },
    { type: 'cleaning', category: ServiceCategory.CLEANING, defaultIcon: '🧽' }
  ];

  execute(serviceType: string): Observable<ServiceTypeMapping | null> {
    const mapping = this.typeMapping.find(map => map.type === serviceType);
    return of(mapping || null);
  }

  getAllMappings(): Observable<ServiceTypeMapping[]> {
    return of(this.typeMapping);
  }

  getCategoryForType(serviceType: string): ServiceCategory | null {
    const mapping = this.typeMapping.find(map => map.type === serviceType);
    return mapping ? mapping.category : null;
  }

  getIconForType(serviceType: string): string {
    const mapping = this.typeMapping.find(map => map.type === serviceType);
    return mapping ? mapping.defaultIcon : '🔧';
  }
}
