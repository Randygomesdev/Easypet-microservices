import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import { AppointmentRequest, AppointmentResponse } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
})
export class AppointmentFormComponent {
  petId = input.required<string>();
  appointmentSaved = output<void>();
  
  loading = signal(false);
  isEditMode = signal(false);
  private currentRecord: AppointmentResponse | null = null;
  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const defaultDate = now.toISOString().slice(0, 16); // Formato para datetime-local

    this.appointmentForm = this.fb.group({
      date: [defaultDate, [Validators.required]],
      reason: ['', [Validators.required]],
      vetName: [''],
      clinicalNotes: [''],
      weightAtTime: [null],
      status: ['SCHEDULED']
    });
  }

  openModal(record?: AppointmentResponse) {
    if (record) {
      this.isEditMode.set(true);
      this.currentRecord = record;
      this.appointmentForm.patchValue({
        date: record.date,
        reason: record.reason,
        vetName: record.vetName,
        clinicalNotes: record.clinicalNotes,
        weightAtTime: record.weightAtTime,
        status: record.status
      });
    } else {
      this.isEditMode.set(false);
      this.currentRecord = null;
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const defaultDate = now.toISOString().slice(0, 16);

      this.appointmentForm.reset({
        date: defaultDate,
        reason: '',
        vetName: '',
        clinicalNotes: '',
        weightAtTime: null,
        status: 'SCHEDULED'
      });
    }
    const modal = document.getElementById('appointment_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('appointment_modal') as HTMLDialogElement;
    modal?.close();
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.loading.set(true);
      const request: AppointmentRequest = this.appointmentForm.value;

      const operation = this.isEditMode() && this.currentRecord
        ? this.appointmentService.update(this.petId(), this.currentRecord.id, request)
        : this.appointmentService.create(this.petId(), request);

      operation.subscribe({
        next: () => {
          this.loading.set(false);
          this.closeModal();
          this.appointmentSaved.emit();
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Erro ao agendar consulta:', err);
          alert('Erro ao agendar consulta.');
        }
      });
    }
  }
}
