import { Component, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentResponse } from '../../../models/appointment.model';
import { AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'app-appointment-history',
  imports: [CommonModule, DatePipe],
  templateUrl: './appointment-history.component.html',
})
export class AppointmentHistoryComponent {
  petId = input.required<string>();
  appointments = input.required<AppointmentResponse[]>();
  
  editRequested = output<AppointmentResponse>();
  historyChanged = output<void>();

  constructor(private appointmentService: AppointmentService) {}

  openModal() {
    const modal = document.getElementById('appointment_history_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('appointment_history_modal') as HTMLDialogElement;
    modal?.close();
  }

  onEdit(app: AppointmentResponse) {
    this.closeModal();
    this.editRequested.emit(app);
  }

  onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      this.appointmentService.delete(this.petId(), id).subscribe({
        next: () => {
          this.historyChanged.emit();
        },
        error: (err) => {
          console.error('Erro ao excluir consulta:', err);
          alert('Erro ao excluir registro.');
        }
      });
    }
  }
}
