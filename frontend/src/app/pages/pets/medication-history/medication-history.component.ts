import { Component, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MedicationResponse } from '../../../models/medication.model';
import { MedicationService } from '../../../services/medication.service';

@Component({
  selector: 'app-medication-history',
  imports: [CommonModule, DatePipe],
  templateUrl: './medication-history.component.html',
})
export class MedicationHistoryComponent {
  petId = input.required<string>();
  medications = input.required<MedicationResponse[]>();
  
  editRequested = output<MedicationResponse>();
  historyChanged = output<void>();

  constructor(private medicationService: MedicationService) {}

  openModal() {
    const modal = document.getElementById('medication_history_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('medication_history_modal') as HTMLDialogElement;
    modal?.close();
  }

  onEdit(med: MedicationResponse) {
    this.closeModal();
    this.editRequested.emit(med);
  }

  onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
      this.medicationService.delete(this.petId(), id).subscribe({
        next: () => {
          this.historyChanged.emit();
        },
        error: (err) => {
          console.error('Erro ao excluir medicamento:', err);
          alert('Erro ao excluir registro.');
        }
      });
    }
  }
}
