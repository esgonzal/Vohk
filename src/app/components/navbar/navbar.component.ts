import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router, public userService: UserServiceService) { }

  returnNombre() {
    return localStorage.getItem('nickname') ?? '';
  }
  returnLogged() {
    return localStorage.getItem('logged') ?? '';
  }
  mostrarCerraduras() {
    let username = localStorage.getItem('user') ?? '';
    this.router.navigate(['users', username]);
  }
  toPerfil() {
    let username = localStorage.getItem('user') ?? '';
    this.router.navigate(['users', username, 'perfil']);
  }
  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('nickname');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.removeItem('keyRight');
    localStorage.removeItem('Bateria');
    localStorage.removeItem('Alias');
    localStorage.removeItem('userType');
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
    localStorage.removeItem('senderUsername');
    localStorage.removeItem('lockID');
    localStorage.removeItem('gateway');
    localStorage.removeItem('logged');
    localStorage.removeItem('features');
    localStorage.removeItem('Account');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('country');
    this.router.navigate(['home']);
  }
}

