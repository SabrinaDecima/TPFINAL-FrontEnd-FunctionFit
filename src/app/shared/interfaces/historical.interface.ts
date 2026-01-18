export interface Historical {
  userId: number;
  gymClassId: number;
  className: string;
  classDate: string;
  actionDate: string;
  status: 'Active' | 'Cancelled' | 'Completed'; 
}
