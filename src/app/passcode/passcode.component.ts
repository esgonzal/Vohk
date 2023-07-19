import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { LockData } from '../Lock';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessTokenData } from '../AccessToken';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { Passcode } from '../Passcode';

@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.css']
})
export class PasscodeComponent implements OnInit {

  lockId: number;
  tokenData: AccessTokenData;
  lock: LockData;
  passcodes: Passcode[] = []
  passcodeName: string;
  passcodePwd: string;
  passcodeStartTime: string;
  passcodeEndTime: string;
  display: boolean = false;
  displayEditar:boolean =false;
  displayForm1: boolean =false;
  displayForm2: boolean =false;
  displayForm3: boolean =false;
  displayForm4: boolean =false;
  displayForm5: boolean =false;
  displayForm6: boolean =false;
  displayForm7: boolean =false;
  displayForm8: boolean =false;
  displayForm9: boolean =false;
  displayForm10: boolean =false;
  displayForm11: boolean =false;
  displayForm12: boolean =false;
  displayForm13: boolean =false;
  displayForm14: boolean =false;
  toggleDisplay(){this.display = !this.display;}
  toggleEditar(){this.displayEditar = !this.displayEditar;}
  toggleForm1(){this.displayForm1 = !this.displayForm1;}
  toggleForm2(){this.displayForm2 = !this.displayForm2;}
  toggleForm3(){this.displayForm3 = !this.displayForm3;}
  toggleForm4(){this.displayForm4 = !this.displayForm4;}
  toggleForm5(){this.displayForm5 = !this.displayForm5;}
  toggleForm6(){this.displayForm6 = !this.displayForm6;}
  toggleForm7(){this.displayForm7 = !this.displayForm7;}
  toggleForm8(){this.displayForm8 = !this.displayForm8;}
  toggleForm9(){this.displayForm9 = !this.displayForm9;}
  toggleForm10(){this.displayForm10 = !this.displayForm10;}
  toggleForm11(){this.displayForm11 = !this.displayForm11;}
  toggleForm12(){this.displayForm12 = !this.displayForm12;}
  toggleForm13(){this.displayForm13 = !this.displayForm13;}
  toggleForm14(){this.displayForm14 = !this.displayForm14;}


  constructor(private route: ActivatedRoute,
    private router: Router,
    public userService: UserServiceService,
    public lockService: LockServiceService,
    public passcodeService: PasscodeServiceService
    ){}

  async ngOnInit(): Promise<void> {
    //Get the lockId and lock
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
    //Get the Access Token
    // Subscribe to the user data
    this.userService.data$.subscribe((data) => {
      this.tokenData = data;
    });
    try{
      await this.passcodeService.getPasscodesofLock(this.tokenData.access_token, this.lockId);
      this.passcodeService.data$.subscribe((data) => {
        if (data?.list) {
          this.passcodes = data.list;
        } else {
          console.log("Data not yet available.");
          this.passcodes = this.passcodes;
        }
      });
    } catch(error) {
      console.error("Error while fetching the passcode:", error);
    }
  }

  

}
