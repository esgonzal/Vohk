import { Component } from '@angular/core';
import { User, UserRegisterResponse } from '../../Interfaces/User';
import { UserServiceService } from '../../services/user-service.service';
import { PopUpService } from '../../services/pop-up.service';
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
    let encode = this.userService.customBase64Encode(data.username);
    console.log("nombre:", data.username)
    console.log("nombre_encode:", encode)
    console.log("contraseña:", data.password)
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
          const phoneValidation = this.userService.isValidPhone(data.username);
          if (this.userService.isValidEmail(data.username)) {//Es un email
            console.log("es un email")
            this.registerError = ''
            const response = await lastValueFrom(this.userService.UserRegister(encode, data.password)) as UserRegisterResponse;
            console.log(response)
            if (response.username) {
              this.popupService.registro = true;
              this.popupService.welcomingMessage = `Bienvenido, ${data.username}! Presione el siguiente botón para iniciar sesión en su cuenta.`;
            } else if (response.errcode === 30003) {
              this.registerError = 'Ya existe una cuenta asociada con el correo electrónico'
            } else if (response.errcode === 30002) {//Nunca debería ocurrir esto porque el nombre se codifica
              this.registerError = 'Solo se permiten digitos y caracteres del alfabeto ingles'
            } else if (response.errcode === 90000) {
              this.registerError = 'el email ingresado es muy largo'
            }
          }
          else if (phoneValidation.isValid) {//Es un telefono
            this.registerError = ''
            console.log("es un telefono")
            console.log("País:", phoneValidation.country);
            const response = await lastValueFrom(this.userService.UserRegister(encode, data.password)) as UserRegisterResponse;
            console.log(response)
            if (response.username) {
              this.popupService.registro = true;
              this.popupService.welcomingMessage = `Bienvenido, ${data.username}! Presione el siguiente botón para iniciar sesión en su cuenta.`;
            } else if (response.errcode === 30003) {
              this.registerError = 'Ya existe una cuenta asociada con el numero de teléfono/'
            } else if (response.errcode === 30002) {//Nunca debería ocurrir esto porque el nombre se codifica
              this.registerError = 'Solo se permiten digitos y caracteres del alfabeto ingles'
            } else if (response.errcode === 90000) {//Nunca debería ocurrir esto porque la validacion de google de telefono lo evita
              this.registerError = 'el numero ingresado es muy largo'
            }
          } else {//No es email ni telefono
            this.registerError = 'Debe ingresar un correo electrónico o un número con prefijo telefónico (+XX)';
          }
        }
      }
    }
  }
}
