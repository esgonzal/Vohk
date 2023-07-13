import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapas } from '../mock-locks';
import { Usuarios } from '../mock-users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  listaChapas = Chapas
  listaUsuarios = Usuarios
  id: string;
  nombre: any;
  pass: any

  constructor(private route: ActivatedRoute, public router: Router) {}
    

  ngOnInit(): void {
    this.id= this.route.snapshot.paramMap.get('id')! ; 
    this.nombre = Usuarios.find((obj) => {return obj.userid === this.id})?.nombre
    this.pass = Usuarios.find((obj) => {return obj.userid === this.id})?.password
    }

  getChapas(){
    const result = Chapas.filter((obj) => {return obj.admin === this.id});
    return result;
  }

  AgregarChapa(){
    console.log("se quiere agregar una chapa");
    this.router.navigate(['/users/',this.id,'addlock']);
  }

  EditarChapa(){
    console.log("se quiere editar una chapa");
  }

  BorrarChapa(){
    console.log("se quiere borrar una chapa");
  }


  

  
}

//{ userid:"1", nombre: "abc", password:"123"},
//{ userid:"2", nombre: "esteban", password:"222"},
//{ userid:"3", nombre: "fa", password:"111"},
//{ userid:"4", nombre: "pruebadsdasda", password:"333"}