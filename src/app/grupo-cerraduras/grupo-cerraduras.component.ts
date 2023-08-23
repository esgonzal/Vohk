import { Component } from '@angular/core';
import { GroupService } from '../services/group.service';
import { PopUpService } from '../services/pop-up.service';
import { Group } from '../Interfaces/Group';

@Component({
  selector: 'app-grupo-cerraduras',
  templateUrl: './grupo-cerraduras.component.html',
  styleUrls: ['./grupo-cerraduras.component.css']
})
export class GrupoCerradurasComponent  {

  token = localStorage.getItem('token') ?? ''
  username = localStorage.getItem('user') ?? ''
  displayedColumnsGroup: string[] = ['Nombre','Cantidad','Operacion'];

  constructor(public groupService: GroupService, public popupService: PopUpService){}

  crearGrupo() {
    this.popupService.token = this.token
    this.popupService.newGroup = true;
  }

  cambiarNombre(grupoID:number) {
    this.popupService.token = this.token;
    this.popupService.elementType = 'grupo';
    this.popupService.elementID = grupoID;
    this.popupService.cambiarNombre =true
  }

  eliminar(grupoID:number) {
    this.popupService.token = this.token;
    this.popupService.elementType = 'grupo';
    this.popupService.elementID = grupoID;
    this.popupService.delete =true
  }

  cerraduras(group:Group){
    this.popupService.group = group;
    this.popupService.token = this.token;
    this.popupService.locksWithoutGroup = this.groupService.locksWithoutGroup;
    this.popupService.addRemoveLockGROUP = true;
  }

}
