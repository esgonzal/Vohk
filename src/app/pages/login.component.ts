import { Component, Input} from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent {
  username: string;
  password: string;
  data: Observable<any[]>

  constructor(private router: Router, public userService: UserServiceService, private http: HttpClient) {}

  login(nombre:string, clave:string){
    this.userService.setnombre_usuario(nombre);
    this.userService.setclave_usuario(clave);
    this.userService.getAccessToken(nombre, clave)
    this.router.navigate(['/users/',nombre]);//despues cambiar esta ruta para que sea el "uid" unico recibido del getAccessToken() y reemplazarlo por el nombre

  }

}



