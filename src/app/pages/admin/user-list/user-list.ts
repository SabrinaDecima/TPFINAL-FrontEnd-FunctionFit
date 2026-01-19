import { Component, computed, inject, signal, effect } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PLAN_CONFIG } from '../../../shared/interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [FormsModule, DatePipe, CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export default class UserList {
  private userService = inject(UserService);

  searchTerm = signal('');
  users = this.userService.users;




  planConfig = PLAN_CONFIG;

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allUsers = this.users();

    if (!allUsers || allUsers.length === 0) {
      return [];
    }
    return allUsers.filter(u =>
      (u.nombre?.toLowerCase() ?? '').includes(term) ||
      (u.email?.toLowerCase() ?? '').includes(term) ||
      (u.apellido?.toLowerCase() ?? '').includes(term)
    );


  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  constructor() {
    // Cargar usuarios al iniciar el componente
    this.userService.loadUsers();
  }
}
