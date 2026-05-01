import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { CommonModule, DatePipe } from '@angular/common';
import { Route } from 'lucide-angular';

@Component({
  selector: 'app-pet-details',
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './pet-details.component.html',
  styles: ``,
})
export class PetDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private petService = inject(PetService);
  private weightService = inject(WeightService);
  private vaccineService = inject(VaccineService);
  private appointmentService = inject(AppointmentService);
  private medicationService = inject(MedicationService);

  pet = signal<PetResponse | null>(null);
  lastWeight = signal<WeightRecordResponse | null>(null);
  nextVaccines = signal<VaccineResponse[]>([]);
  lastAppointment = signal<AppointmentResponse | null>(null);
  activeMedications = signal<MedicationResponse[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.LoadPetData(petId);
    }
  }

  private LoadPetData(petId: string): void {
    this.isLoading.set(true);

     this.petService.findAll().subscribe({
      next: (page) => {
        const foundPet = page.content.find(p => p.id === petId);
        if (foundPet) this.pet.set(foundPet);
      }
    });

    this.weightService.findAll(petId, 0, 1).subscribe({
      next: (page) => {
        if (page.content.length > 0) {
          this.lastWeight.set(page.content[0]);
        }
      }
    });
    
    this.vaccineService.findAll(petId).subscribe({
      next: (list) => {
        this.nextVaccines.set(list.slice(0, 3));
      }
    });

    this.appointmentService.findAll(petId, 0, 1).subscribe({
      next: (page) => {
        if (page.content.length > 0) this.lastAppointment.set(page.content[0]);
      }
    });

    this.medicationService.findAll(petId).subscribe({
      next: (list) => {
        this.activeMedications.set(list.filter(m => m.active));
        this.isLoading.set(false);
      }
    });
  }
}
