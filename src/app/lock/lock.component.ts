import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Lock';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent implements OnInit{

  lockId: number;
  tokenData: AccessTokenData;
  lock:LockData;
  newAliasDisplay = false;
  newAlias: string;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    public userService: UserServiceService, 
    public lockService: LockServiceService){}

  ngOnInit(): void {
    // Get the lockId from route parameters
    this.route.paramMap.subscribe(params => {
      this.lockId = Number(params.get('id'));
      // Use lockId to get the specific lock data
      this.lockService.data$.subscribe((data) => {
        if (data.list) {
          this.lock = data.list.find((lock: { lockId: number; }) => lock.lockId === this.lockId);
          if (!this.lock) {
            // Handle case when the lock with the specified lockId is not found
            this.router.navigate(['/not-found']);
          }
        } else {
          console.log("Data not yet available(ngOnInit de lock component).");
        }
      });
    });

    // Subscribe to the user data
    this.userService.data$.subscribe((data) => {
      this.tokenData = data;
    });
  }

  ToggleAliasDisplay(){ this.newAliasDisplay = !this.newAliasDisplay }

  async cambiarAlias(newAlias: string){
    try{
      await this.lockService.changeLockName(
        this.tokenData.access_token,
        this.lockId,
        newAlias
      )
    } catch(error){
      console.error("Error while changing lock alias:", error);
    }
  }

  navigateToPasscode(){
    this.router.navigate(['lock',this.lockId,'passcode']);
  }

  navigateToCard(){
    this.router.navigate(['lock',this.lockId,'card']);
  }
}
