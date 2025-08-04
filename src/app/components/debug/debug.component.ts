import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-container">
      <h2>Debug - Datos Almacenados</h2>

      <div class="debug-actions">
        <button (click)="exportData()" class="btn btn-primary">Exportar Datos</button>
        <button (click)="clearData()" class="btn btn-danger">Limpiar Datos</button>
      </div>

      <div class="debug-data">
        <h3>Datos JSON:</h3>
        <pre>{{ jsonData }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .debug-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .debug-actions {
      margin-bottom: 20px;
    }

    .debug-actions button {
      margin-right: 10px;
    }

    .debug-data {
      background: rgba(31, 41, 55, 0.8);
      border-radius: 8px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .debug-data pre {
      color: #e0e0e0;
      font-size: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-danger {
      background: #e53e3e;
      color: white;
    }
  `]
})
export class DebugComponent {
  jsonData: string = '';

  constructor(private storageService: StorageService, private http: HttpClient) {
    this.updateJsonData();
  }

  updateJsonData(): void {
    // Obtener datos de Render (clientes y citas)
    Promise.all([
      this.http.get<any>('https://sertech-backend.onrender.com/clientes').toPromise(),
      this.http.get<any>('https://sertech-backend.onrender.com/citas').toPromise()
    ]).then(([clients, appointments]) => {
      this.jsonData = JSON.stringify({ clientes: clients, citas: appointments }, null, 2);
    }).catch(() => {
      this.jsonData = 'Error al obtener datos de Render';
    });
  }

  exportData(): void {
    // Descargar datos de Render como JSON
    Promise.all([
      this.http.get<any>('https://sertech-backend.onrender.com/clientes').toPromise(),
      this.http.get<any>('https://sertech-backend.onrender.com/citas').toPromise()
    ]).then(([clients, appointments]) => {
      const data = JSON.stringify({ clientes: clients, citas: appointments }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sertech_data_render.json';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  clearData(): void {
    if (confirm('¿Estás seguro de que quieres borrar TODOS los datos en Render?')) {
      // Enviar petición para borrar todos los datos en Render
      this.http.delete('https://sertech-backend.onrender.com/debug/clear-all').subscribe({
        next: () => {
          alert('Datos en Render eliminados correctamente');
          this.updateJsonData();
        },
        error: () => {
          alert('Error al borrar datos en Render');
        }
      });
    }
  }
}
