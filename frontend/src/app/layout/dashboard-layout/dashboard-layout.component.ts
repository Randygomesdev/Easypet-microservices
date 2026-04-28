import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive
  ],  
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent implements OnInit {
  theme = signal('light');
  userName = signal('Usuário');
  userInitial = signal('U');
  userPicture = signal<string | null>(null);
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initUser();
    this.initTheme();
  }

  private initUser(): void {
    const userStr = localStorage.getItem('user');
    let name = 'Usuário';
    let pictureUrl = null;

    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        name = userObj.name || userObj.email || 'Usuário';
        pictureUrl = userObj.pictureUrl || userObj.picture || null;
      } catch (e) {
        console.error('Falha ao buscar dados do usuário', e);
      }
    } else {
      // Fallback para quando é login social e o objeto 'user' não foi salvo, apenas o 'token'
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          name = payload.name || payload.email || payload.sub || 'Usuário';
          pictureUrl = payload.picture || payload.pictureUrl || null;
          
          // Opcionalmente salvar para evitar decodificar novamente
          localStorage.setItem('user', JSON.stringify({ name, pictureUrl, email: payload.email || payload.sub }));
        } catch (e) {
          console.error('Falha ao decodificar JWT', e);
        }
      }
    }

    this.userName.set(name);
    this.userInitial.set(name.charAt(0).toUpperCase());
    this.userPicture.set(pictureUrl);
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme.set(savedTheme);
    } else {
      this.theme.set('light');
    }
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  onLogout(){
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.logout();
    }
  }  
}
