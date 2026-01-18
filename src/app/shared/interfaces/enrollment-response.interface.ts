export interface EnrollmentResponse {
  success: boolean;
  message: string;
  gymClassId?: number;
  isReserved?: boolean;
  currentEnrollments?: number; 
  maxCapacity?: number;        
}