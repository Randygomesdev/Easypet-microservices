import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [AuthService],
  templateUrl: './login.html',
  styles: [],
})
export class Login implements OnInit {
  isLogin = true;
  showPassword = false;
  showConfirmPassword = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }

  ngOnInit() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  onSubmit() {
  if (this.isLogin) {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        console.log('Email salvo para lembrar:', email);
      } else {
        localStorage.removeItem('rememberedEmail');
        
      }

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso!', response);
          alert(`Bem-vindo de volta, ${response.name}!`);
          // Redirecionar para o dashboard
        },
        error: (err) => {
          console.error('Erro no login:', err);
          alert('Falha ao entrar. Verifique seu email e senha.');
        }
      });
    }
  } 
  else {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Conta criada com sucesso!', response);
          alert(`Conta criada! Bem-vindo ao Easypet, ${response.name}!`);
          // Redirecionar para o dashboard
        },
        error: (err) => {
          console.error('Erro no registro:', err);
          alert('Erro ao criar conta. Verifique os dados ou tente outro email.');
        }
      });
    }
  }
}

}
