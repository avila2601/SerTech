import { Component } from '@angular/core';
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

  constructor(private storageService: StorageService) {
    this.updateJsonData();
  }

  updateJsonData(): void {
    this.jsonData = this.storageService.exportData();
  }

  exportData(): void {
    const data = this.storageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sertech_data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearData(): void {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
      this.storageService.clearData();
      this.updateJsonData();
    }
  }
}
