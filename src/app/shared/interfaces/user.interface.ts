export interface User {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    planId: number | null;
    role: 'Socio' | 'Administrador' | 'SuperAdministrador';
}

export const PLAN_CONFIG: Record<number, { label: string, class: string }> = {
  0: { label: 'Admin', class:  'text-slate-500'}, 
  1: { label: 'Básico', class: 'text-blue-800' }, 
  2: { label: 'Premium', class: 'text-pink-800' }, 
  3: { label: 'Elite', class: 'text-purple-800' }  
};