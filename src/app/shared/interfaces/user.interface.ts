export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Socio' | 'Administrador' | 'SuperAdministrador';
}