export interface MedicationRequest {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  observations?: string;
  active: boolean;
  appointmentId?: string;
}

export interface MedicationResponse {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  observations: string;
  active: boolean;
  appointmentId: string;
}
