export interface ExamRequest {
  examName: string;
  date: string;
  laboratory?: string;
  veterinarianName?: string;
  resultsSummary?: string;
  fileUrl?: string;
}

export interface ExamResponse {
  id: string;
  examName: string;
  date: string;
  laboratory: string;
  veterinarianName: string;
  resultsSummary: string;
  fileUrl: string;
  certified: boolean;
}
