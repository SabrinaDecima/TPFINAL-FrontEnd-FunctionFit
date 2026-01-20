export interface Payment {
  Id: number;
  UserId: number;
  Monto: number;
  Fecha: string;      
  Pagado: boolean;
  InitPoint?: string; 
}
