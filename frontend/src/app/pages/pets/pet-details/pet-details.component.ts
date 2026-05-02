import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { WeightService } from '../../../services/weight.service';
import { VaccineService } from '../../../services/vaccine.service';
import { AppointmentService } from '../../../services/appointment.service';
import { MedicationService } from '../../../services/medication.service';
import { PetResponse } from '../../../models/pet.model';
import { WeightRecordResponse } from '../../../models/weight.model';
import { MedicationResponse } from '../../../models/medication.model';
import { VaccineResponse } from '../../../models/vaccine.model';
import { AppointmentResponse } from '../../../models/appointment.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { VaccineFormComponent } from '../vaccine-form/vaccine-form.component';
import { WeightFormComponent } from '../weight-form/weight-form.component';
import { WeightChartComponent } from '../weight-chart/weight-chart.component';
import { MedicationFormComponent } from '../medication-form/medication-form.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { WeightHistoryComponent } from '../weight-history/weight-history.component';
import { VaccineHistoryComponent } from '../vaccine-history/vaccine-history.component';
import { MedicationHistoryComponent } from '../medication-history/medication-history.component';
import { AppointmentHistoryComponent } from '../appointment-history/appointment-history.component';

@Component({
  selector: 'app-pet-details',
  imports: [
    RouterModule, 
    DatePipe, 
    DecimalPipe, 
    WeightFormComponent, 
    WeightChartComponent, 
    WeightHistoryComponent,
    PetFormComponent, 
    VaccineFormComponent,
    VaccineHistoryComponent,
    MedicationFormComponent,
    MedicationHistoryComponent,
    AppointmentFormComponent,
    AppointmentHistoryComponent
  ],
  templateUrl: './pet-details.component.html',
  styles: ``,
})
export class PetDetailsComponent implements OnInit {

  @ViewChild(WeightFormComponent) weightFormModal!: WeightFormComponent;
  @ViewChild(WeightHistoryComponent) weightHistoryModal!: WeightHistoryComponent;
  @ViewChild(PetFormComponent) petFormModal!: PetFormComponent;
  @ViewChild(VaccineFormComponent) vaccineFormModal!: VaccineFormComponent;
  @ViewChild(VaccineHistoryComponent) vaccineHistoryModal!: VaccineHistoryComponent;
  @ViewChild(MedicationFormComponent) medicationFormModal!: MedicationFormComponent;
  @ViewChild(MedicationHistoryComponent) medicationHistoryModal!: MedicationHistoryComponent;
  @ViewChild(AppointmentFormComponent) appointmentFormModal!: AppointmentFormComponent;
  @ViewChild(AppointmentHistoryComponent) appointmentHistoryModal!: AppointmentHistoryComponent;

  pet = signal<PetResponse | null>(null);
  lastWeight = signal<WeightRecordResponse | null>(null);
  allWeights = signal<WeightRecordResponse[]>([]);
  nextVaccines = signal<VaccineResponse[]>([]);
  allVaccines = signal<VaccineResponse[]>([]);
  lastAppointment = signal<AppointmentResponse | null>(null);
  allAppointments = signal<AppointmentResponse[]>([]);
  activeMedications = signal<MedicationResponse[]>([]);
  allMedications = signal<MedicationResponse[]>([]);
  isLoading = signal(true);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private petService = inject(PetService);
  private weightService = inject(WeightService);
  private vaccineService = inject(VaccineService);
  private appointmentService = inject(AppointmentService);
  private medicationService = inject(MedicationService);


  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.LoadPetData(petId);
    }
  }

  openWeightModal() {
    this.weightFormModal.openModal();
  }

  openWeightHistoryModal() {
    this.weightHistoryModal.openModal();
  }

  openVaccineModal(record?: VaccineResponse) {
    this.vaccineFormModal.openModal(record);
  }

  openVaccineHistoryModal() {
    this.vaccineHistoryModal.openModal();
  }

  openEditPetModal() {
    if (this.pet()) {
      this.petFormModal.openModal(this.pet()!);
    }
  }

  openMedicationModal(record?: MedicationResponse) {
    this.medicationFormModal.openModal(record);
  }

  openMedicationHistoryModal() {
    this.medicationHistoryModal.openModal();
  }

  openAppointmentModal(record?: AppointmentResponse) {
    this.appointmentFormModal.openModal(record);
  }

  openAppointmentHistoryModal() {
    this.appointmentHistoryModal.openModal();
  }

  deletePet() {
    const id = this.pet()?.id;
    if (id && confirm('Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.')) {
      this.petService.delete(id).subscribe({
        next: () => {
          this.router.navigate(['/pets']);
        },
        error: (err) => {
          console.error('Erro ao excluir pet:', err);
          alert('Erro ao excluir pet.');
        }
      });
    }
  }

  loadPetData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.LoadPetData(id);
    }
  }

  private LoadPetData(petId: string): void {
    this.isLoading.set(true);

    this.petService.getById(petId).subscribe({
      next: (foundPet) => {
        this.pet.set(foundPet);
      },
      error: (err) => {
        console.error('Erro ao buscar pet:', err);
        this.isLoading.set(false);
      }
    });

    this.weightService.findAll(petId, 0, 10).subscribe({
      next: (page: any) => {
        const list = page.content || page;
        if (list && list.length > 0) {
          this.lastWeight.set(list[0]);
          this.allWeights.set(list);
        }
      }
    });
    
    this.vaccineService.findAll(petId).subscribe({
      next: (page: any) => {
        const list = page.content || page;
        this.allVaccines.set(list);
        this.nextVaccines.set(list.slice(0, 3));
      }
    });

    this.appointmentService.findAll(petId, 0, 100).subscribe({
      next: (page: any) => {
        const list = page.content || page;
        this.allAppointments.set(list);
        if (list.length > 0) this.lastAppointment.set(list[0]);
      }
    });

    this.medicationService.findAll(petId).subscribe({
      next: (list) => {
        this.allMedications.set(list);
        this.activeMedications.set(list.filter(m => m.active));
        this.isLoading.set(false);
      }
    });
  }
}
