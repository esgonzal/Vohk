import { Component } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { PopUpService } from '../../services/pop-up.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  username = localStorage.getItem('user') ?? ''
  password = localStorage.getItem('password') ?? ''
  showPassword = false;

  constructor(public popupService: PopUpService){}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  maskPassword(password: string) {
    return '*'.repeat(password.length);
  }
  resetPassword(){
    this.popupService.resetPassword = true;
  }
  
}
