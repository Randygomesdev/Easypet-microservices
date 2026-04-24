import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styles: ``,
})
export class ForgotPassword {
   forgotForm: FormGroup;
  emailSent = false;
  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onRecover() {
    if (this.forgotForm.valid) {
      // Simulação de envio por enquanto
      console.log('Enviando link para:', this.forgotForm.value.email);
      this.emailSent = true;
    }
  }
}
