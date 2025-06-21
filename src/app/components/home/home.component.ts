import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navegarAServicio(tipoServicio: string): void {
    this.router.navigate(['/servicios'], {
      queryParams: { tipo: tipoServicio }
    });
  }
}
