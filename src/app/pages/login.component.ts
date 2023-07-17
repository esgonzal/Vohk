import { Component, Input} from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AccessTokenData } from '../AccessToken';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent {
  username: string;
  password: string;
  data: AccessTokenData;

  constructor(private router: Router, public userService: UserServiceService, private http: HttpClient) {}

  async login(nombre:string, clave:string){
    this.userService.setnombre_usuario(nombre);
    this.userService.setclave_usuario(clave);

    try {
      await this.userService.getAccessToken(nombre, clave);
      this.userService.data$.subscribe((data) => {
        if (data) {
          this.router.navigate(['/users/', nombre]); // Navigate to the user page with the username
        } else {
          console.log("Data not yet available.");
        }
      });
    } catch (error) {
      console.error("Error while fetching access token:", error);
    }

  }
}



