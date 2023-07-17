import { Component, OnInit } from '@angular/core';
import { Chapas } from '../mock-locks';
import {  ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-lock-to-user',
  templateUrl: './add-lock-to-user.component.html',
  styleUrls: ['./add-lock-to-user.component.css']
})
export class AddLockToUserComponent implements OnInit {

  listaChapas = Chapas;
  admin:string;

  constructor(private route: ActivatedRoute, private router : Router) { }

  ngOnInit() {}

  getChapasDisponibles(){
    const result = Chapas.filter((obj) => {return obj.admin === ""});
    return result;
  }

  addLockToUser(name: string,pass: string,sound: number,id: string, modelo: string){
  const admin = this.router.url.split("/")[2];
  const chapa = {idL: id, nombre:name, pass:pass, lockSound:Number(sound), modelNum: modelo, admin: admin};
  let indexToUpdate = this.listaChapas.findIndex(item => item.idL ===chapa.idL);
  this.listaChapas[indexToUpdate] = chapa;
  this.router.navigate(['/users/', admin]);
  }

}
