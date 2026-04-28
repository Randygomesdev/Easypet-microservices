import { CommonModule, } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { PetService } from '../../../services/pet.service';
import { PetGender, PetRequest, PetSpecies, PetResponse } from '../../../models/pet.model';

@Component({
  selector: 'app-pet-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.css',
})
export class PetFormComponent{

  petSaved = output<void>();
  loading = signal(false);
  editingPetId = signal<string | null>(null);

  speciesOptions = Object.values(PetSpecies);
  genderOptions = Object.values(PetGender);

  petForm: FormGroup;

  constructor(private fb: FormBuilder, private petService: PetService) {
    this.petForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      species: new FormControl(PetSpecies.DOG, [Validators.required]),
      breed: new FormControl('', [Validators.required]),
      gender: new FormControl(PetGender.MALE, [Validators.required]),
      weight: new FormControl(null, [Validators.required, Validators.min(0.1)]),
      birthDate: new FormControl('', [Validators.required]),
      microchipNumber: new FormControl(''),
      pictureUrl: new FormControl('')
    });
  }


  openModal(pet?: PetResponse) {
    if (pet) {
      this.editingPetId.set(pet.id);
      this.petForm.patchValue({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        weight: pet.weight,
        birthDate: pet.birthDate,
        microchipNumber: pet.microchipNumber,
        pictureUrl: pet.pictureUrl
      });
    } else {
      this.editingPetId.set(null);
      this.petForm.reset({
        species: PetSpecies.DOG,
        gender: PetGender.MALE
      });
    }

    const modal = document.getElementById('pet_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }    
  }

  closeModal() {
    const modal = document.getElementById('pet_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  onSubmit() {
    if (this.petForm.valid) {
      this.loading.set(true);
      const request: PetRequest = this.petForm.value;
      const petId = this.editingPetId();
      
      const requestObs = petId ? this.petService.update(petId, request) : this.petService.create(request);

      requestObs.subscribe({
        next: () => {
          this.loading.set(false);
          this.closeModal();
          this.petSaved.emit();
          alert(petId ? 'Pet atualizado com sucesso! 🎉' : 'Pet adicionado com sucesso! 🎉');
        },
        error: (err) => {
          this.loading.set(false);
          console.error(err);
          alert('Erro ao salvar o Pet.');
        }
      });
    } else {
      this.petForm.markAllAsTouched();
    }
  }


    
}
