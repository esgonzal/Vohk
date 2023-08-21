import { Component } from '@angular/core';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-grupo-cerraduras',
  templateUrl: './grupo-cerraduras.component.html',
  styleUrls: ['./grupo-cerraduras.component.css']
})
export class GrupoCerradurasComponent  {

  username = localStorage.getItem('user') ?? ''
  displayedColumnsGroup: string[] = ['Nombre','Cantidad','Operacion'];

  constructor(public groupService: GroupService){}

}
