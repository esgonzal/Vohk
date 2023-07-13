import { Component, OnInit } from '@angular/core';
import { UsersService } from "../users/users.service";
import { Router } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  clientId: String;
  clientSecret: String;
  username: string;
  password: string;
  //date: long;
  //confirmPassword: string;
  //passwordError: boolean;

  constructor(public userService: UsersService, public router: Router, public listaUsuarios: UserListComponent) {
    this.clientId="c4114592f7954ca3b751c44d81ef2c7d",
    this.clientSecret="33b556bdb803763f2e647fc7a357dedf"
    this.username="",
    this.password=""  
    //this.confirmPassword="",
    //this.passwordError=true
  }

  genUniqueId(): string {
    const dateStr = Date
      .now()
      .toString(36); // convert num to base 36 and stringify
  
    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8); // start at index 2 to skip decimal point
  
    return `${dateStr}-${randomStr}`;
  }

  register() {
    const user = {userid: this.genUniqueId(), nombre: this.username, password: this.password};
    //const user = {clientId: this.clientId, clientSecret:this.clientSecret, username: this.username, password: this.password};
    //this.userService.register(user).subscribe((data) => {console.log(data);});
    //
    this.listaUsuarios.listaUsuarios.push(user);
    console.log(this.listaUsuarios.listaUsuarios.length);
    this.router.navigateByUrl("/login");
  }
}
