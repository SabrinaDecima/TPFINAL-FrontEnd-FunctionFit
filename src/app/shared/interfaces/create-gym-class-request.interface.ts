export interface CreateGymClassRequest {
    nombre: string;
    descripcion: string;
    duracionMinutos: number;
    imageUrl: string;
    dia: number;
    hora: string;
    maxCapacity: number;
}