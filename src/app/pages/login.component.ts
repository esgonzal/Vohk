import { Component} from '@angular/core';
import { UsersService } from "../users/users.service";
import { Router } from '@angular/router';
import { Usuarios } from '../mock-users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string;
  password: string;

  constructor(public userService: UsersService, public router: Router) {
    this.username="";
    this.password="";
   }

  login(nombre:string, clave:string){
    const found = Usuarios.find((obj) => {return obj.nombre === nombre;});
    if(found?.password === clave){
      console.log("Se encontro a ",found.nombre,"con clave: ", found.password)
      const id = found.userid
      this.router.navigate(['/users/',id]);
    }
      
    }

  }


