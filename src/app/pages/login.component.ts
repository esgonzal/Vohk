import { Component} from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { User } from '../User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent {

  loginError:string = "";

  constructor(private router: Router, public userService: UserServiceService, private http: HttpClient) {}

  async login(data:User){
    if(data.username == '' || data.password == ''){
      this.loginError = 'Nombre de usuario y/o contraseña inválidos '
    }
    this.userService.setnombre_usuario(data.username);
    this.userService.setclave_usuario(data.password);
    try {
      await this.userService.getAccessToken(data.username, data.password);
      this.userService.data$.subscribe((res) => {
        if (res.access_token) {
          this.router.navigate(['/users/', data.username]); // Navigate to the user page with the username
        } else {
          this.loginError = "Nombre de usuario y/o contraseña inválidos";
        }
      });
    } catch (error) {
      console.error("Error while fetching access token:", error);
    }
    localStorage.setItem('user', data.username)
  }
}



