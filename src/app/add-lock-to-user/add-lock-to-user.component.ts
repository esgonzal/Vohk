import { Component, OnInit } from '@angular/core';
import { Chapas } from '../mock-locks';

@Component({
  selector: 'app-add-lock-to-user',
  templateUrl: './add-lock-to-user.component.html',
  styleUrls: ['./add-lock-to-user.component.css']
})
export class AddLockToUserComponent implements OnInit {

  listaChapas = Chapas;
  nombre:string;
  password:string;

  constructor() { }

  ngOnInit(): void {
  }

  getChapasDisponibles(){
    const result = Chapas.filter((obj) => {return obj.admin === ""});
    return result;
  }

  addLockToUser(id: string, modelo: string){
    const chapa = {idL: id, nombre:this.nombre, pass:this.password, modelNum: modelo, admin: }
    console.log("se agregó");
  }

}
