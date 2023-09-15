import { Component } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { PopUpService } from '../../services/pop-up.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  constructor(public popupService: PopUpService){}

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  username = localStorage.getItem('nickname') ?? ''
  account = localStorage.getItem('user') ?? ''
  password = localStorage.getItem('password') ?? ''
  email = localStorage.getItem('email') ?? ''
  country = localStorage.getItem('country') ?? ''
  phone = localStorage.getItem('phone') ?? ''
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  maskPassword(password: string) {
    return '*'.repeat(password.length);
  }
  resetPassword(){
    if(this.getAccountType() === 'Vohk') {
      this.popupService.resetPassword = true;
    } else {
      this.popupService.wrongAccountType = true;
    }
  }
  getAccountType(){
    return localStorage.getItem('Account');
  }
  cambiarNombre(){
    this.popupService.changeNickname = true;
  }
}
