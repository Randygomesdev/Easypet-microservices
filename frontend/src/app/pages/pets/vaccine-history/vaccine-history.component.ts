import { Component, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VaccineResponse } from '../../../models/vaccine.model';
import { VaccineService } from '../../../services/vaccine.service';

@Component({
  selector: 'app-vaccine-history',
  imports: [CommonModule, DatePipe],
  templateUrl: './vaccine-history.component.html',
})
export class VaccineHistoryComponent {
  petId = input.required<string>();
  vaccines = input.required<VaccineResponse[]>();
  
  editRequested = output<VaccineResponse>();
  historyChanged = output<void>();

  constructor(private vaccineService: VaccineService) {}

  openModal() {
    const modal = document.getElementById('vaccine_history_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('vaccine_history_modal') as HTMLDialogElement;
    modal?.close();
  }

  onEdit(vaccine: VaccineResponse) {
    this.closeModal();
    this.editRequested.emit(vaccine);
  }

  onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir esta vacina?')) {
      this.vaccineService.delete(this.petId(), id).subscribe({
        next: () => {
          this.historyChanged.emit();
        },
        error: (err) => {
          console.error('Erro ao excluir vacina:', err);
          alert('Erro ao excluir registro.');
        }
      });
    }
  }
}
