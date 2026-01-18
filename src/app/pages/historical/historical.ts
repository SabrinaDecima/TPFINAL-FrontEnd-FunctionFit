import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- necesario
import { ServicesService } from '../../services/services.service';
import { Historical } from '../../shared/interfaces/historical.interface';

@Component({
  selector: 'app-historical',
  standalone: true, // <-- importante
  imports: [CommonModule], // <-- importá CommonModule
  templateUrl: './historical.html',
})
export class HistoricalComponent implements OnInit {
  history: Historical[] = [];

  constructor(private service: ServicesService) {}

  async ngOnInit() {
    try {
      const data = await this.service.getUserHistory();

      this.history = data.map(item => ({
        ...item,
        classDate: new Date(item.classDate).toLocaleDateString(),
        actionDate: new Date(item.actionDate).toLocaleDateString()
      }));
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  }
}
