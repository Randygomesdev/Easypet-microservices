import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeightService } from '../../../services/weight.service';
import { WeightRecordRequest } from '../../../models/weight.model';

@Component({
  selector: 'app-weight-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './weight-form.component.html',
})
export class WeightFormComponent {
  petId = input.required<string>();
  weightSaved = output<void>();
  
  loading = signal(false);
  weightForm: FormGroup;

  constructor(private fb: FormBuilder, private weightService: WeightService) {
    this.weightForm = this.fb.group({
      weight: [null, [Validators.required, Validators.min(0.1)]],
      date: [new Date().toISOString().substring(0, 10), [Validators.required]]
    });
  }

  openModal() {
    this.weightForm.reset({
      weight: null,
      date: new Date().toISOString().substring(0, 10)
    });
    const modal = document.getElementById('weight_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('weight_modal') as HTMLDialogElement;
    modal?.close();
  }

  onSubmit() {
    if (this.weightForm.valid) {
      this.loading.set(true);
      const request: WeightRecordRequest = this.weightForm.value;

      this.weightService.create(this.petId(), request).subscribe({
        next: () => {
          this.loading.set(false);
          this.closeModal();
          this.weightSaved.emit();
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Erro ao salvar peso:', err);
          alert('Erro ao registrar peso.');
        }
      });
    }
  }
}
