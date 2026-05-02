import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicationService } from '../../../services/medication.service';
import { MedicationRequest, MedicationResponse } from '../../../models/medication.model';

@Component({
  selector: 'app-medication-form',
  imports: [ReactiveFormsModule],
  templateUrl: './medication-form.component.html',
  styles: ``,
})
export class MedicationFormComponent {
  petId = input.required<string>();
  medicationSaved = output<void>();
  
  loading = signal(false);
  isEditMode = signal(false);
  private currentRecord: MedicationResponse | null = null;
  medForm: FormGroup;

  constructor(private fb: FormBuilder, private medicationService: MedicationService) {
    this.medForm = this.fb.group({
      name: ['', [Validators.required]],
      dosage: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      startDate: [new Date().toISOString().substring(0, 10)],
      endDate: [null],
      observations: [''],
      active: [true]
    });
  }

  openModal(record?: MedicationResponse) {
    if (record) {
      this.isEditMode.set(true);
      this.currentRecord = record;
      this.medForm.patchValue({
        name: record.name,
        dosage: record.dosage,
        frequency: record.frequency,
        startDate: record.startDate,
        endDate: record.endDate,
        observations: record.observations,
        active: record.active
      });
    } else {
      this.isEditMode.set(false);
      this.currentRecord = null;
      this.medForm.reset({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().substring(0, 10),
        endDate: null,
        observations: '',
        active: true
      });
    }
    const modal = document.getElementById('medication_modal') as HTMLDialogElement;
    modal?.showModal();
  }
  closeModal() {
    const modal = document.getElementById('medication_modal') as HTMLDialogElement;
    modal?.close();
  }
  onSubmit() {
    if (this.medForm.valid) {
      this.loading.set(true);
      const request: MedicationRequest = this.medForm.value;

      const operation = this.isEditMode() && this.currentRecord
        ? this.medicationService.update(this.petId(), this.currentRecord.id, request)
        : this.medicationService.create(this.petId(), request);

      operation.subscribe({
        next: () => {
          this.loading.set(false);
          this.closeModal();
          this.medicationSaved.emit();
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Erro ao salvar medicamento:', err);
          alert('Erro ao registrar medicamento.');
        }
      });
    }
  }

}
