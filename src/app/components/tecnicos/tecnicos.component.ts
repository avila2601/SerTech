import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TecnicoService } from '../../services/tecnico.service';
import { Tecnico } from '../../models';

@Component({
  selector: 'app-tecnicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.scss']
})
export class TecnicosComponent implements OnInit {
  tecnicos: Tecnico[] = [];

  constructor(
    private tecnicoService: TecnicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTecnicos();
  }

  cargarTecnicos(): void {
    this.tecnicoService.getTecnicos().subscribe(tecnicos => {
      this.tecnicos = tecnicos;
    });
  }

  getStars(calificacion: number): number[] {
    return Array(Math.floor(calificacion)).fill(0);
  }

  getEmptyStars(calificacion: number): number[] {
    return Array(5 - Math.floor(calificacion)).fill(0);
  }

  seleccionarTecnico(tecnico: Tecnico): void {
    this.router.navigate(['/agendar'], {
      queryParams: { tecnicoId: tecnico.id }
    });
  }
}
