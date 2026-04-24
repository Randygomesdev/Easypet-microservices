import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  imports: [],
  template: '<p>Autenticando... aguarde.</p>'
})
export class LoginSuccess implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token do Google salvo com sucesso!' + token);
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login']);
        console.error('Token de autenticação não encontrado.');
      }
    });
  }
}
