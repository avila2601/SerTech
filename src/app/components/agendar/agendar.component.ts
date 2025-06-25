import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente, Cita } from '../../models';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit {
  agendarForm: FormGroup;
  isSubmitting = false;

  // Información del servicio seleccionado
  marcaSeleccionada: string = '';
  productoSeleccionado: string = '';
  modeloSeleccionado: string = '';
  sintomasSeleccionados: string = '';
  ubicacionSeleccionada: string = '';

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.agendarForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha: [''],
      hora: ['']
    });
  }

  ngOnInit(): void {
    // Obtener los datos del servicio seleccionado y personales desde query params
    this.route.queryParams.subscribe(params => {
      this.marcaSeleccionada = params['marca'] || '';
      this.productoSeleccionado = params['producto'] || '';
      this.modeloSeleccionado = params['modelo'] || '';
      this.sintomasSeleccionados = params['sintomas'] || '';
      this.ubicacionSeleccionada = params['ubicacion'] || '';

      // Rellenar el formulario si existen datos personales y de fecha/hora
      this.agendarForm.patchValue({
        nombre: params['nombre'] || '',
        email: params['email'] || '',
        telefono: params['telefono'] || '',
        direccion: params['direccion'] || '',
        fecha: params['fecha'] || '',
        hora: params['hora'] || ''
      });
    });
  }

  onSubmit(): void {
    if (this.agendarForm.valid) {
      this.isSubmitting = true;

      const formValue = this.agendarForm.value;

      // Navegar a resumen-cita pasando todos los datos
      this.router.navigate(['/resumen-cita'], {
        queryParams: {
          marca: this.marcaSeleccionada,
          producto: this.productoSeleccionado,
          modelo: this.modeloSeleccionado,
          sintomas: this.sintomasSeleccionados,
          ubicacion: this.ubicacionSeleccionada,
          fecha: formValue.fecha,
          hora: formValue.hora,
          nombre: formValue.nombre,
          email: formValue.email,
          telefono: formValue.telefono,
          direccion: formValue.direccion
        }
      });
    }
  }

  regresar(): void {
    console.log('Regresando a técnicos...');
    console.log('Marca seleccionada:', this.marcaSeleccionada);
    console.log('Producto seleccionado:', this.productoSeleccionado);

    this.router.navigate(['/tecnicos'], {
      queryParams: {
        servicio: this.route.snapshot.queryParams['servicio'] || '',
        marca: this.marcaSeleccionada,
        producto: this.productoSeleccionado,
        modelo: this.modeloSeleccionado,
        sintomas: this.sintomasSeleccionados,
        ubicacion: this.ubicacionSeleccionada,
        fecha: this.agendarForm.get('fecha')?.value || '',
        hora: this.agendarForm.get('hora')?.value || ''
      }
    });
  }
}
