import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { FingerprintServiceService } from '../services/fingerprint-service.service';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Lock';
import { Fingerprint } from '../Fingerprint';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent {

  lockId: number;
  tokenData: AccessTokenData;
  lock: LockData;
  fingerprints: Fingerprint[] = []
  displayEditarNombre = false;
  displayEditarPeriodo = false
  fingerprintName:string;
  fingerprintStartTime: string;
  fingerprintEndTime: string;

  constructor(private route:ActivatedRoute,
    private router: Router,
    public userService: UserServiceService,
    public lockService: LockServiceService,
    public fingerprintService: FingerprintServiceService){}

  toggleEditarNombre(){this.displayEditarNombre = !this.displayEditarNombre;}
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}

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
      await this.fingerprintService.getFingerprintsofLock(this.tokenData.access_token, this.lockId);
      this.fingerprintService.data$.subscribe((data) => {
        if(data?.list) {
          this.fingerprints = data.list;
        }else {
          console.log("Data not yet available.");
          this.fingerprints = this.fingerprints
        }
      });
    } catch(error) {
      console.error("Error while fetching the passcode:", error);
    }
  }
}
