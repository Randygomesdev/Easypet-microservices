import { DatePipe } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { PetResponse } from '../../../models/pet.model';
import { PetService } from '../../../services/pet.service';
import { PetFormComponent } from '../pet-form/pet-form.component';

@Component({
  selector: 'app-pet-list',
  imports: [DatePipe, PetFormComponent],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css',
})
export class PetListComponent implements OnInit{

  @ViewChild(PetFormComponent) petFormModal!: PetFormComponent;

  pets = signal<PetResponse[]>([]);
  loading = signal<boolean>(true);

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(){
    this.loading.set(true);

    this.petService.findAll(0,10).subscribe({
      next: (page) => {
        this.pets.set(page.content);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar pets:', err);
        this.loading.set(false);
        alert('Ocorreu um erro ao carregar os pets.');
      }
    });
  }

  openAddPetModal(){
    this.petFormModal.openModal();
  }

  openEditPetModal(pet: PetResponse){
    this.petFormModal.openModal(pet);
  }

  deletePet(id: string) {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
      this.petService.delete(id).subscribe({
        next: () => {
          this.loadPets();
        },
        error: (err) => {
          console.error('Erro ao excluir pet:', err);
          alert('Ocorreu um erro ao excluir o pet.');
        }
      });
    }
  }
}
