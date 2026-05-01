export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  OTHER = 'OTHER'
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface PetRequest {
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  weight: number;
  birthDate: string;
  microchipNumber?: string;
  pictureUrl?: string;
}

export interface PetResponse {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  weight: number;
  birthDate: string;
  microchipNumber?: string;
  pictureUrl?: string;
  active: boolean;
  ownerId: string;
}
