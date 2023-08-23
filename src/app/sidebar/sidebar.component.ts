import { Component } from '@angular/core';
import { GroupService } from '../services/group.service';
import { Router } from '@angular/router';
import { Group } from '../Interfaces/Group';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
  constructor(public groupService: GroupService, private router: Router){}

  selectGroup(group: Group) {
    if (group.groupName === 'Todos') {
      this.groupService.updateSelectedGroup(this.groupService.DEFAULT_GROUP);
    } else {
      this.groupService.updateSelectedGroup(group);
    }
    this.router.navigate(['users', localStorage.getItem('user')]);
  }


  toGrupoCerraduras(){
    this.router.navigate(['/users/', localStorage.getItem('user'), 'grupos']);
  }

}
