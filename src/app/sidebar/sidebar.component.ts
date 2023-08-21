import { Component } from '@angular/core';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(public groupService: GroupService){}
}
