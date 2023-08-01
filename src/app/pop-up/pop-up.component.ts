import { Component } from '@angular/core';
import { PopUpService } from '../services/pop-up.service';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { EkeyServiceService } from '../services/ekey-service.service';
import { CardServiceService } from '../services/card-service.service';
import { FingerprintServiceService } from '../services/fingerprint-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent {


  constructor(public dialogRef: MatDialog,
    private router:Router,
    public popupService: PopUpService,
    private ekeyService: EkeyServiceService,
    private passcodeService: PasscodeServiceService,
    private cardService: CardServiceService,
    private fingerprintService: FingerprintServiceService){}

  navigateToLogin(){
    this.popupService.confirmRegister= false;
    this.router.navigate(['/login']);
  }
    
  onConfirm(){
    if (this.popupService.confirmDelete){
      // Perform deletion based on the element type
      switch (this.popupService.elementType) {
        case 'passcode':
          this.passcodeService.deletePasscode(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
          break;
        case 'ekey':
          this.ekeyService.deleteEkey(this.popupService.token, this.popupService.elementID);
          break;
        case 'card':
          this.cardService.deleteCard(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
          break;
        case 'fingerprint':
          this.fingerprintService.deleteFingerprint(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
          break;
        default:
          console.error('Invalid element type for deletion:', this.popupService.elementID);
          break;
      }
    }
    this.popupService.confirmDelete = false;
    this.popupService.confirmRegister = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
  

}
