import { Component } from '@angular/core';
import { User } from '../Interfaces/User';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { UserServiceService } from '../services/user-service.service';
import { PopUpService } from '../services/pop-up.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserServiceService]
})
export class RegisterComponent {

  constructor(private userService: UserServiceService, public popupService: PopUpService) {}

  ngOnInit() {}

  registerError:string = "";

  signUp(data:User){
    if(data.username == '' || data.password == '' || data.confirmPassword == ''){
      this.registerError = 'Nombre de usuario y/o contraseña inválidos '
    } 
    else {
      if(data.password !== data.confirmPassword){
        this.registerError = 'Las contraseñas son diferentes'
      } 
      else {
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if( !passwordPattern.test(data.password)){
          this.registerError = 'Tu contraseña debe tener entre 8-20 caracteres e incluir al menos dos tipos de números, letras y símbolos'
        } 
        else {
          this.userService.UserRegister(data.username, data.password);
          this.popupService.confirmRegister = true;
          this.popupService.welcomingMessage = `Bienvenido, ${data.username}! Presione el siguiente botón para iniciar sesión en su cuenta.`;
        }
      }
    }
  }

}
