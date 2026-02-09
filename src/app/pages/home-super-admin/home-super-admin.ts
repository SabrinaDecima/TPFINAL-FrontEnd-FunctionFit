import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminUserService } from '../../services/adminUser.service';

@Component({
  selector: 'app-home-super-admin',
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './home-super-admin.html',
  styles: [`
    .dashboard { padding: 1.5rem; background: #0f172a; min-height: 100vh; color: #e2e8f0; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; }
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 1.5rem; 
      margin-bottom: 2rem; 
    }
    .stat-card { 
      background: rgba(30, 41, 59, 0.7); 
      border: 1px solid rgba(148, 163, 184, 0.1); 
      border-radius: 12px; 
      padding: 1.5rem; 
      text-align: center;
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-value { font-size: 2.25rem; font-weight: 700; margin: 0.5rem 0; }
    .stat-label { color: #94a3b8; font-size: 0.9rem; }
    .table-container { 
      background: rgba(15, 23, 42, 0.8); 
      border-radius: 12px; 
      overflow: hidden; 
      border: 1px solid rgba(148, 163, 184, 0.1);
    }
    .role-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .role-socio { background: #10b98120; color: #10b981; }
    .role-admin { background: #3b82f620; color: #3b82f6; }
    .role-super { background: #f59e0b20; color: #f59e0b; }
  `]
})
export default class HomeSuperAdmin {
  private adminService = inject(AdminUserService);

  stats = signal({
    totalUsers: 0,
    totalAdmins: 0,
    totalSocios: 0,
    totalClasses: 0
  });

  recentUsers = signal<any[]>([]);
  displayedColumns = ['email', 'role', 'plan'];

  constructor() {
    this.loadActivity();
  }

  async loadActivity() {
    try {
      const data = await this.adminService.getActivitySummary();

      this.stats.set(data.stats);
      this.recentUsers.set(data.recentUsers);
    } catch (err) {
      console.error('Error cargando actividad:', err);
    }
  }

  getRoleClass(role: string): string {
    return role === 'SuperAdministrador' ? 'role-super' :
      role === 'Administrador' ? 'role-admin' : 'role-socio';
  }
}