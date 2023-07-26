export interface Card{
    cardId: number;
    lockId: number;
    cardNumber: string;
    cardName:string;
    cardType: number;
    startDate: string;
    endDate: string;
    createDate: string;
    senderUsername: string;
}

export interface CardFormulario {
    cardName:string;
    cardStartTime:string;
    cardEndTime:string;
  }