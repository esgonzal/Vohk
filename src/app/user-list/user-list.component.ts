import { Component, OnInit } from '@angular/core';
import { User } from '../User';
import { Usuarios } from '../mock-users';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  listaUsuarios = Usuarios;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  selectedUsuario?: User;


  OnSelect(usuario: User): void {
  this.selectedUsuario = usuario;
  console.log(usuario);
  this.router.navigateByUrl("/users/:id");
  }

}
