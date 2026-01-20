import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { Historical } from '../../shared/interfaces/historical.interface';

@Component({
  selector: 'app-historical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical.html',
})
export default class HistoricalComponent implements OnInit {

  history: Historical[] = [];

  // métricas
  totalClasses = 0;
  activeCount = 0;
  cancelledCount = 0;
  attendancePercent = 0;
  streak = 0;

  constructor(private service: ServicesService) {}

  async ngOnInit() {
    try {
      const data = await this.service.getUserHistory();

      this.history = data.map(item => ({
        ...item,
        classDate: this.formatDate(item.classDate),
        actionDate: this.formatDate(item.actionDate)
      }));

      this.calculateMetrics();

    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  }

  private formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private calculateMetrics() {
    this.totalClasses = this.history.length;

    this.cancelledCount = this.history.filter(h => h.status === 'Cancelled').length;
    this.activeCount = this.history.filter(h => h.status === 'Active').length;

    // asistencia %
    this.attendancePercent =
      this.totalClasses > 0
        ? Math.round((this.activeCount / this.totalClasses) * 100)
        : 0;

    // streak simple: últimas clases no canceladas
    this.streak = 0;
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].status === 'Active') {
        this.streak++;
      } else {
        break;
      }
    }
  }
}
