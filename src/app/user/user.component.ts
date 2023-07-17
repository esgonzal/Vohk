import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapas } from '../mock-locks';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: []
})
export class UserComponent implements OnInit {

  listaChapas = Chapas
  username: string;
  password: string;
  newPassword: string;
  idDisplay = false
  data: any[]

  constructor(private route: ActivatedRoute, private router: Router, public userService: UserServiceService) {
    this.username = this.userService.getnombre_usuario();
    this.password = this.userService.getclave_usuario();
    this.data =  this.userService.getdata_usuario();
  }
    

  ngOnInit(){
  //this.username= this.route.snapshot.paramMap.get('id')!;
    }

  Eliminar(){
    this.userService.DeleteUser(this.username)
    this.router.navigate(['']);
  }

  ToggleDisplay(){ this.idDisplay = !this.idDisplay }

  cambiarPass(username: string, newPassword: string){
    this.userService.ResetPassword(username, newPassword);
    this.password = newPassword;
    this.router.navigate(['/login']);
  }

  recibirDatos(array: any[], nombre: string, clave: string){
    this.username = nombre;
    this.password = clave;
    this.data = array;
    console.log(this.username)
    console.log(this.password)
    console.log(this.data)
  }













  getChapas(){
    const result = Chapas.filter((obj) => {return obj.admin === this.username});
    return result;
  }

  AgregarChapa(){
    console.log("se quiere agregar una chapa");
    this.router.navigate(['/users/',this.username,'addlock']);
  }

  EditarChapa(){
    console.log("se quiere editar una chapa");
  }

  BorrarChapa(){
    console.log("se quiere borrar una chapa");
  }
 
}