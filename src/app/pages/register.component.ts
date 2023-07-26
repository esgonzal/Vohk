import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { User } from '../User';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserServiceService]
})
export class RegisterComponent {

  constructor(private router:Router, private userService: UserServiceService) {}

  ngOnInit() {}

  signUp(data:User){
    this.userService.UserRegister(data.username, data.password);
      this.router.navigate(['/login']);
  }
}
