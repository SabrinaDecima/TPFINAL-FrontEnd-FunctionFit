import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../../services/plan.service';
import { CurrencyPipe } from '@angular/common';
import { Plan } from '../../../shared/interfaces';

@Component({
  selector: 'app-plan-management',
  standalone: true,
  imports: [FormsModule, CurrencyPipe], 
  templateUrl: './plan-management.html',
  styleUrl: './plan-management.scss',
})
export default class PlanManagement {
  private planService = inject(PlanService); 

  plans = signal<Plan[]>([]);
  selectedPlan = signal<Plan | null>(null);

  constructor() {
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (allPlans) => this.plans.set(allPlans),
      error: (err) => console.error('Error al cargar planes', err)
    });
  }

  editPlan(id: number) {
    this.planService.getPlanById(id).subscribe({
      next: (plan) => this.selectedPlan.set(plan),
      error: (err) => console.error('Error al cargar plan', err)
    });
  }

  savePlan() {
    const plan = this.selectedPlan();
    if (!plan) return;

    this.planService.updatePlan(plan.id, plan).subscribe({
      next: () => {
        console.log('Plan actualizado');
        this.loadPlans();
        this.selectedPlan.set(null);
      },
      error: (err) => console.error('Error al actualizar plan', err)
    });
  }
}