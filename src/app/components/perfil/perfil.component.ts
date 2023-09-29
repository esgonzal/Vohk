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
  username = sessionStorage.getItem('nickname') ?? ''
  account = sessionStorage.getItem('user') ?? ''
  password = sessionStorage.getItem('password') ?? ''
  email = sessionStorage.getItem('email') ?? ''
  country = sessionStorage.getItem('country') ?? ''
  phone = sessionStorage.getItem('phone') ?? ''
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
    return sessionStorage.getItem('Account');
  }
  cambiarNombre(){
    this.popupService.changeNickname = true;
  }
}
