export interface User {
    id: string ;
    name: string;
    email: string;
    role: 'Socio' | 'Administrador' | 'SuperAdministrador';
}