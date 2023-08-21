import { Component } from '@angular/core';
import { GroupService } from '../services/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  selectedGroup: string = 'Todos';

  constructor(public groupService: GroupService, private router: Router){}

  selectGroup(groupName: string) {
    this.selectedGroup = groupName;
    this.groupService.seleccionado = groupName;
    this.router.navigate(['/users/', localStorage.getItem('user')]);
  }

}
