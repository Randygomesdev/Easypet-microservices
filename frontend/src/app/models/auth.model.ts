export interface AuthenticationResponse {

    token: string;
    id: string;
    name: string;
    email: string;
    role: string;
    pictureUrl?: string;

}

export interface RegisterRequest {

    name: string
    email: string;
    password?: string;

}

export interface AuthenticationRequest{
    
    email: string;
    password?: string;

}