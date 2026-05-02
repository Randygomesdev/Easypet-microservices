import { Component, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { WeightRecordResponse } from '../../../models/weight.model';
import { WeightService } from '../../../services/weight.service';

@Component({
  selector: 'app-weight-history',
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './weight-history.component.html',
})
export class WeightHistoryComponent {
  petId = input.required<string>();
  weights = input.required<WeightRecordResponse[]>();
  
  historyChanged = output<void>();

  constructor(private weightService: WeightService) {}

  openModal() {
    const modal = document.getElementById('weight_history_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('weight_history_modal') as HTMLDialogElement;
    modal?.close();
  }

  onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este registro de peso?')) {
      this.weightService.delete(this.petId(), id).subscribe({
        next: () => {
          this.historyChanged.emit();
          // Se a lista ficar vazia ou o modal precisar fechar, tratamos aqui
        },
        error: (err) => {
          console.error('Erro ao excluir peso:', err);
          alert('Erro ao excluir registro.');
        }
      });
    }
  }
}
