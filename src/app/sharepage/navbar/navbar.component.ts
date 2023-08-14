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
        if((localStorage.getItem('user')) && (val.url.includes('users') || val.url.includes('lock') || val.url.includes('home'))){
          this.menuType = "LoggedIn"
          this.username = localStorage.getItem('user');
        }
        else{
          this.menuType = "LoggedOut"
        }
      }
    })
  }

  mostrarCerraduras(){
    this.username = localStorage.getItem('user');
    this.router.navigate(['users', this.username]);
  }

  toPerfil(){
    this.username = localStorage.getItem('user');
    this.router.navigate(['users',this.username,'perfil']);
  }

  cerrarSesion(){
    localStorage.removeItem('user');
    localStorage.removeItem('fullName');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.removeItem('keyRight');
    localStorage.removeItem('Bateria');
    localStorage.removeItem('Alias');
    localStorage.removeItem('userType');
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
    localStorage.removeItem('senderUsername');
    this.menuType = 'LoggedOut';
    this.router.navigate(['home']);
  }
}

