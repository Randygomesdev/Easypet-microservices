export enum VaccineStatus {
  UPDATED = 'UPDATED',
  DUE_SOON = 'DUE_SOON',
  OVERDUE = 'OVERDUE'
}

export interface VaccineRequest {
  name: string;
  applicationDate: string;
  nextDoseDate: string;
  status: VaccineStatus;
  vetName?: string;
  manufacturer?: string;
  lot?: string;
  observations?: string;
}

export interface VaccineResponse {
  id: string;
  name: string;
  applicationDate: string;
  nextDoseDate: string;
  status: VaccineStatus;
  vetName?: string;
  manufacturer?: string;
  lot?: string;
  observations?: string;
}