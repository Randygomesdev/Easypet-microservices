import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VaccineService } from '../../../services/vaccine.service';
import { VaccineRequest, VaccineResponse } from '../../../models/vaccine.model';

@Component({
  selector: 'app-vaccine-form',
  imports: [ReactiveFormsModule],
  templateUrl: './vaccine-form.component.html',
})
export class VaccineFormComponent {
  petId = input.required<string>();
  vaccineSaved = output<void>();
  
  loading = signal(false);
  isEditMode = signal(false);
  private currentRecord: VaccineResponse | null = null;
  vaccineForm: FormGroup;

  constructor(private fb: FormBuilder, private vaccineService: VaccineService) {
    const today = new Date().toISOString().substring(0, 10);
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    const nextYear = nextYearDate.toISOString().substring(0, 10);

    this.vaccineForm = this.fb.group({
      name: ['', [Validators.required]],
      applicationDate: [today, [Validators.required]],
      nextDoseDate: [nextYear, [Validators.required]],
      vetName: [''],
      lot: [''],
      manufacturer: ['']
    });
  }

  openModal(record?: VaccineResponse) {
    if (record) {
      this.isEditMode.set(true);
      this.currentRecord = record;
      this.vaccineForm.patchValue({
        name: record.name,
        applicationDate: record.applicationDate,
        nextDoseDate: record.nextDoseDate,
        vetName: record.vetName,
        lot: record.lot,
        manufacturer: record.manufacturer
      });
    } else {
      this.isEditMode.set(false);
      this.currentRecord = null;
      const today = new Date().toISOString().substring(0, 10);
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      const nextYear = nextYearDate.toISOString().substring(0, 10);

      this.vaccineForm.reset({
        name: '',
        applicationDate: today,
        nextDoseDate: nextYear,
        vetName: '',
        lot: '',
        manufacturer: ''
      });
    }
    const modal = document.getElementById('vaccine_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('vaccine_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  onSubmit() {
    if (this.vaccineForm.valid) {
      this.loading.set(true);
      const request: VaccineRequest = {
        ...this.vaccineForm.value,
        status: this.isEditMode() && this.currentRecord ? this.currentRecord.status : 'UPDATED'
      };

      const operation = this.isEditMode() && this.currentRecord
        ? this.vaccineService.update(this.petId(), this.currentRecord.id, request)
        : this.vaccineService.create(this.petId(), request);

      operation.subscribe({
        next: () => {
          this.loading.set(false);
          this.closeModal();
          this.vaccineSaved.emit();
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Erro ao salvar vacina:', err);
          alert('Erro ao registrar vacina.');
        }
      });
    }
  }
}
