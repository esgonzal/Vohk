import { Component, OnInit } from '@angular/core';
import { User } from '../User';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  selectedUsuario?: User;

  constructor(public router: Router) {}

  ngOnInit(): void {}
  
  OnSelect(usuario: User): void {
    this.selectedUsuario = usuario;
    this.router.navigateByUrl("/users/:id");
  }

}
