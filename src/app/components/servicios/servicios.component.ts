import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Servicio, CategoriaServicio } from '../../models';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  categorias = Object.values(CategoriaServicio);
  categoriaSeleccionada: CategoriaServicio | null = null;

  constructor(
    private servicioService: ServicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
      this.serviciosFiltrados = servicios;
    });
  }

  filtrarPorCategoria(categoria: CategoriaServicio): void {
    this.categoriaSeleccionada = categoria;
    this.serviciosFiltrados = this.servicios.filter(s => s.categoria === categoria);
  }

  getIcono(categoria: CategoriaServicio): string {
    const iconos: Record<CategoriaServicio, string> = {
      [CategoriaServicio.MANTENIMIENTO]: '🔧',
      [CategoriaServicio.REPARACION]: '🔧',
      [CategoriaServicio.INSTALACION]: '⚙️',
      [CategoriaServicio.DIAGNOSTICO]: '🔍',
      [CategoriaServicio.LIMPIEZA]: '🧹'
    };
    return iconos[categoria] || '🔧';
  }

  agendarServicio(servicio: Servicio): void {
    this.router.navigate(['/agendar'], {
      queryParams: { servicioId: servicio.id }
    });
  }
}
