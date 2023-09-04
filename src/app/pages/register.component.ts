import { Component } from '@angular/core';
import { User, UserRegisterResponse } from '../Interfaces/User';
import { UserServiceService } from '../services/user-service.service';
import { PopUpService } from '../services/pop-up.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserServiceService]
})
export class RegisterComponent {

  constructor(private userService: UserServiceService, public popupService: PopUpService) { }

  ngOnInit() { }

  registerError: string = "";

  async signUp(data: User) {
    console.log("nombre:",data.username)
    console.log("contraseña:",data.password)
    if (data.username == '' || data.password == '' || data.confirmPassword == '') {
      this.registerError = 'Nombre de usuario y/o contraseña inválidos '
    }
    else {
      if (data.password !== data.confirmPassword) {
        this.registerError = 'Las contraseñas son diferentes'
      }
      else {
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(data.password)) {
          this.registerError = 'Tu contraseña debe tener entre 8-20 caracteres e incluir al menos dos tipos de números, letras y símbolos'
        }
        else {
          const user = data.username.split('@');
          console.log("sin el @:",user)
          const response = await lastValueFrom(this.userService.UserRegister(user[0], data.password)) as UserRegisterResponse;
          console.log(response)
          if (response.username) {
            this.popupService.registro = true;
            this.popupService.welcomingMessage = `Bienvenido, ${data.username}! Presione el siguiente botón para iniciar sesión en su cuenta.`;
          }
        }
      }
    }
  }

}
