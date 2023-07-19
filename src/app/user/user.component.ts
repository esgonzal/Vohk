import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { AccessTokenData } from '../AccessToken';
import { LockServiceService } from '../services/lock-service.service';
import { LockData, LockListResponse } from '../Lock';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: []
})
export class UserComponent implements OnInit {

  username: string;
  password: string;
  newPassword: string;
  newPasswordDisplay = false;
  tokenData: AccessTokenData;
  locksList: LockListResponse;
  lock:LockData;

  constructor(private router: Router, public userService: UserServiceService, public lockService: LockServiceService) {}
    
  ngOnInit(){
    this.username = this.userService.getnombre_usuario();
    this.password = this.userService.getclave_usuario();
    this.userService.data$.subscribe((data) => {
      this.tokenData = data;
    });
    this.EncontrarLocksdelUsuario(this.tokenData.access_token);
  }

  async EncontrarLocksdelUsuario(token: string){
    try{
      await this.lockService.getLockListAccount(token);
      this.lockService.data$.subscribe((data) => {
        if (data.list) {
          this.locksList = data;
        } else {
          console.log("Data not yet available.");
        }
      });
    } catch(error) {
      console.error("Error while fetching access token:", error);
    }
  }
    

  Eliminar(){
    this.userService.DeleteUser(this.username)
    this.router.navigate(['']);
  }

  ToggleDisplay(){ this.newPasswordDisplay = !this.newPasswordDisplay }

  cambiarPass(username: string, newPassword: string){
    this.userService.ResetPassword(username, newPassword);
    this.password = newPassword;
    this.router.navigate(['/login']);
  }

  onLockButtonClick(lock:LockData){
    this.lock = lock;
    let lockId = this.lock.lockId
    this.router.navigate(['/lock/',lockId]);
  }


}