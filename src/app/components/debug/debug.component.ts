import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  jsonData: string = '';

  constructor(private storageService: StorageService, private http: HttpClient) {
    this.updateJsonData();
  }

  updateJsonData(): void {
    // Fetch data from server (clients and appointments)
    Promise.all([
      this.http.get<any>('https://sertech-backend.onrender.com/clients').toPromise(),
      this.http.get<any>('https://sertech-backend.onrender.com/appointments').toPromise()
    ]).then(([clients, appointments]) => {
      this.jsonData = JSON.stringify({ clients, appointments }, null, 2);
    }).catch(() => {
      this.jsonData = 'Error fetching data from server';
    });
  }

  exportData(): void {
    // Export data from server as JSON
    Promise.all([
      this.http.get<any>('https://sertech-backend.onrender.com/clients').toPromise(),
      this.http.get<any>('https://sertech-backend.onrender.com/appointments').toPromise()
    ]).then(([clients, appointments]) => {
      const data = JSON.stringify({ clients, appointments }, null, 2);
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
    if (confirm('Are you sure you want to delete ALL data on the server?')) {
      // Send request to clear all server data
      this.http.delete('https://sertech-backend.onrender.com/debug/clear-all').subscribe({
        next: () => {
          alert('Server data cleared successfully');
          this.updateJsonData();
        },
        error: () => {
          alert('Error clearing server data');
        }
      });
    }
  }
}
