export enum AppointmentStatus {

    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW'
}

export interface AppointmentRequest {
    date: string;
    reason: string;
    clinicalNotes?: string;
    vetName?: string;
    providerId?: string;
    weightAtTime?: number;
    status?: AppointmentStatus;
}

export interface AppointmentResponse {
  id: string;
  date: string;
  reason: string;
  clinicalNotes: string;
  vetName: string;
  providerId: string;
  weightAtTime: number;
  status: AppointmentStatus;
  certified: boolean;
  createdAt: string;
}
