import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styles: ``,
})
export class ForgotPassword {
   forgotForm: FormGroup;
  emailSent = false;
  constructor(private fb: FormBuilder, private  authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onRecover() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
           console.log('Solicitação enviada com sucesso ao backend');
          this.emailSent = true;
        },
        error: (err) => {
          console.error('Erro ao solicitar recuperação:', err);
          alert('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
        }
      });


      console.log('Enviando link para:', this.forgotForm.value.email);
      this.emailSent = true;
    }
  }
}
