import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { Technician, Client } from '../../models';
import { TechnicianReviewsModalComponent } from './technician-reviews-modal.component';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [CommonModule, TechnicianReviewsModalComponent],
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  technicians: Technician[] = [];
  showReviewsModal: boolean = false;
  modalTechnicianId: string = '';

  constructor(
    private technicianService: TechnicianService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.technicianService.getTechnicians().subscribe(technicians => {
      this.technicians = technicians;
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  selectTechnician(technician: Technician): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {
        technicianId: technician.id
      };

      // Preserve all form parameters
      if (params['service']) {
        preservedParams.service = params['service'];
        preservedParams.serviceId = params['service'];
      }
      if (params['brand']) preservedParams.brand = params['brand'];
      if (params['product']) preservedParams.product = params['product'];
      if (params['model']) preservedParams.model = params['model'];
      if (params['location']) preservedParams.location = params['location'];
      if (params['symptoms']) preservedParams.symptoms = params['symptoms'];
      if (params['date']) preservedParams.date = params['date'];
      if (params['time']) preservedParams.time = params['time'];

      // Check if client is already logged in
      const loggedClientId = localStorage.getItem('loggedClient');

      if (loggedClientId) {
        // Get client data to populate the summary
        this.clientService.getClientById(loggedClientId).subscribe({
          next: (client: Client | undefined) => {
            if (client) {
              // Add client data to params for appointment summary
              preservedParams.name = client.name;
              preservedParams.email = client.email;
              preservedParams.phone = client.phone;
              preservedParams.address = client.address;

              // Navigate directly to appointment-summary
              this.router.navigate(['/appointment-summary'], {
                queryParams: preservedParams
              });
            } else {
              // If client not found, go to clients page
              this.router.navigate(['/clients'], {
                queryParams: preservedParams
              });
            }
          },
          error: (error) => {
            console.error('Error getting client data:', error);
            // Fallback to clients page
            this.router.navigate(['/clients'], {
              queryParams: preservedParams
            });
          }
        });
      } else {
        // Navigate to clients component (using English route)
        this.router.navigate(['/clients'], {
          queryParams: preservedParams
        });
      }
    });
  }

  goBackToServices(): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {};
      if (params['service']) preservedParams.service = params['service'];
      if (params['brand']) preservedParams.brand = params['brand'];
      if (params['product']) preservedParams.product = params['product'];
      if (params['model']) preservedParams.model = params['model'];
      if (params['location']) preservedParams.location = params['location'];
      if (params['symptoms']) preservedParams.symptoms = params['symptoms'];
      if (params['date']) preservedParams.date = params['date'];
      if (params['time']) preservedParams.time = params['time'];

      // Navigate to services component (using English route)
      this.router.navigate(['/services'], {
        queryParams: preservedParams
      });
    });
  }

  openReviewsModal(technicianId: string): void {
    this.modalTechnicianId = technicianId;
    this.showReviewsModal = true;
  }

  closeReviewsModal(): void {
    this.showReviewsModal = false;
    this.modalTechnicianId = '';
  }

  getRandomAvatar(id: string): string {
    // Use pravatar.cc to get a random but consistent image per technician
    const num = (parseInt(id, 10) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${num}`;
  }
}
