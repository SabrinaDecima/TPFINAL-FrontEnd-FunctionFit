export interface GymClassTurn {
    id: number;
    dia: number;
    hora: string;
    isReservedByUser: boolean;
    maxCapacity: number;        
    currentEnrollments: number; 
}

export interface GroupedGymClass {
    nombre: string;
    descripcion: string;
    duracionMinutos: number;
    imageUrl: string;
    turnos: GymClassTurn[];
}