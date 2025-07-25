import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TecnicoService } from '../../services/tecnico.service';
import { Tecnico } from '../../models';
import { TecnicosResenasModalComponent } from './tecnicos-resenas-modal.component';

@Component({
  selector: 'app-tecnicos',
  standalone: true,
  imports: [CommonModule, TecnicosResenasModalComponent],
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.scss']
})
export class TecnicosComponent implements OnInit {
  tecnicos: Tecnico[] = [];
  mostrarModalResenas: boolean = false;
  tecnicoIdModal: string = '';

  constructor(
    private tecnicoService: TecnicoService,
    private router: Router,
    private route: ActivatedRoute
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
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {
        tecnicoId: tecnico.id
      };

      // Preservar todos los parámetros del formulario
      if (params['servicio']) {
        preservedParams.servicio = params['servicio'];
        preservedParams.servicioId = params['servicio'];
      }
      if (params['marca']) preservedParams.marca = params['marca'];
      if (params['producto']) preservedParams.producto = params['producto'];
      if (params['modelo']) preservedParams.modelo = params['modelo'];
      if (params['ubicacion']) preservedParams.ubicacion = params['ubicacion'];
      if (params['sintomas']) preservedParams.sintomas = params['sintomas'];
      if (params['fecha']) preservedParams.fecha = params['fecha'];
      if (params['hora']) preservedParams.hora = params['hora'];

      this.router.navigate(['/clientes'], {
        queryParams: preservedParams
      });
    });
  }

  volverAServicios(): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {};
      if (params['servicio']) preservedParams.servicio = params['servicio'];
      if (params['marca']) preservedParams.marca = params['marca'];
      if (params['producto']) preservedParams.producto = params['producto'];
      if (params['modelo']) preservedParams.modelo = params['modelo'];
      if (params['ubicacion']) preservedParams.ubicacion = params['ubicacion'];
      if (params['sintomas']) preservedParams.sintomas = params['sintomas'];
      if (params['fecha']) preservedParams.fecha = params['fecha'];
      if (params['hora']) preservedParams.hora = params['hora'];

      this.router.navigate(['/servicios'], {
        queryParams: preservedParams
      });
    });
  }

  abrirModalResenas(tecnicoId: string): void {
    this.tecnicoIdModal = tecnicoId;
    this.mostrarModalResenas = true;
  }

  cerrarModalResenas(): void {
    this.mostrarModalResenas = false;
    this.tecnicoIdModal = '';
  }

  getRandomAvatar(id: string): string {
    // Usamos pravatar.cc para obtener una imagen aleatoria pero consistente por técnico
    const num = (parseInt(id, 10) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${num}`;
  }
}
