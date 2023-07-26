import { Component, OnInit } from '@angular/core';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Lock';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { CardServiceService } from '../services/card-service.service';
import { Card, CardFormulario } from '../Card';

@Component({
  selector: 'app-iccard',
  templateUrl: './iccard.component.html',
  styleUrls: ['./iccard.component.css']
})
export class ICCardComponent implements OnInit{

  lockId: number;
  tokenData: AccessTokenData;
  lock: LockData;
  cards: Card[] = []
  cardName:string;
  cardStartTime: string;
  cardEndTime: string;
  ///////////////////////
  displayEditarNombre = false;
  toggleEditarNombre(){this.displayEditarNombre = !this.displayEditarNombre;}
  displayInfo:boolean=false
  toggleInfo(){this.displayInfo = !this.displayInfo}
  displayEditarPeriodo = false
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}

  selectedCard: Card;
  onSelectedCard(card: Card): void{
    this.selectedCard = card;
  }

  ambasFunciones(card: Card){
    this.toggleInfo();
    this.onSelectedCard(card);
  }


  constructor(private route:ActivatedRoute,
    private router: Router,
    public userService: UserServiceService,
    public lockService: LockServiceService,
    public cardService: CardServiceService
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
            // BUSCAR EN KEYS 
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
      await this.cardService.getCardsofLock(this.tokenData.access_token, this.lockId);
      this.cardService.data$.subscribe((data) => {
        if(data?.list) {
          this.cards = data.list;
        }else {
          console.log("Data not yet available.");
          this.cards = this.cards
        }
      });
    } catch(error) {
      console.error("Error while fetching the passcode:", error);
    }
  }

  async borrarCard(cardID:number){
    this.cardService.deleteCard(this.tokenData.access_token, this.lockId, cardID);
    this.router.navigate(["lock", this.lockId]);
  }

  async cambiarNombre(cardID:number, datos:CardFormulario){
    this.cardService.changeName(this.tokenData.access_token, this.lockId, cardID, datos.cardName);
    this.router.navigate(["lock", this.lockId]);
  }

  async cambiarPeriodo(cardID:number, datos:CardFormulario){
    this.cardService.changePeriod(this.tokenData.access_token, this.lockId, cardID,datos.cardStartTime, datos.cardEndTime);
    this.router.navigate(["lock", this.lockId]);  
  }
}
