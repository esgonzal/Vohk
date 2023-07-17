import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserServiceService]
})
export class RegisterComponent {
  username: string;
  password: string;

  constructor(private router:Router, private userService: UserServiceService) {}

  ngOnInit() {}

  Agregar(username: string,password: string){
    let respuesta = this.userService.UserRegister(username, password);
    //Solo debe ir a la vista login si se registró correctamente, implementar eso despues
    this.router.navigate(['/login']);
  }

  
}
