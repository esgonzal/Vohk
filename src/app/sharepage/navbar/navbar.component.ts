import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuType: string = "LoggedOut";
  username: string | null = "";

  constructor(private router:Router,
    private userService: UserServiceService) { }

  ngOnInit(): void {
    this.router.events.subscribe((val:any) => {
      if(val.url){
        if((localStorage.getItem('user')) && (val.url.includes('users') || val.url.includes('lock'))){
          this.menuType = "LoggedIn"
          this.username = localStorage.getItem('user');
        }
        else{
          this.menuType = "LoggedOut"
        }
      }
    })
  }

}
