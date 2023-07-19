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

export interface PasscodeListResponse {
    list: Card[];
    pageNo: number;
    pageSize: number;
    pages: number;
    total: number;
  }