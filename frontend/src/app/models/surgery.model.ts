import { AppointmentStatus } from './appointment.model';

export interface SurgeryRequest {
  description: string;
  date: string;
  vetName?: string;
  providerId?: string;
  anesthesiaType?: string;
  postOperativeInstructions?: string;
  status: AppointmentStatus;
}

export interface SurgeryResponse {
  id: string;
  description: string;
  date: string;
  vetName: string;
  providerId: string;
  anesthesiaType: string;
  postOperativeInstructions: string;
  status: AppointmentStatus;
  certified: boolean;
}
