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
    return sessionStorage.getItem('nickname') ?? '';
  }
  returnLogged() {
    return sessionStorage.getItem('logged') ?? '';
  }
  mostrarCerraduras() {
    let username = sessionStorage.getItem('user') ?? '';
    this.router.navigate(['users', username]);
  }
  toPerfil() {
    let username = sessionStorage.getItem('user') ?? '';
    this.router.navigate(['users', username, 'perfil']);
  }
  cerrarSesion() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('nickname');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('keyRight');
    sessionStorage.removeItem('Bateria');
    sessionStorage.removeItem('Alias');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('startDate');
    sessionStorage.removeItem('endDate');
    sessionStorage.removeItem('senderUsername');
    sessionStorage.removeItem('lockID');
    sessionStorage.removeItem('gateway');
    sessionStorage.removeItem('logged');
    sessionStorage.removeItem('features');
    sessionStorage.removeItem('Account');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('country');
    this.router.navigate(['home']);
  }
}

