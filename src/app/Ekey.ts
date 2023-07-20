export interface Ekey{
    //en la documentacion no aparece openid(la cual aparece en la llamada a API)
    //, y la llamada no devuelve uid.
    keyId: number;
    lockId: number;
    username: string;
    uid: number;
    keyName: string;
    keyStatus: string;
    startDate: string;
    endDate: string;
    keyRight: number;
    senderUsername: string;
    remarks: string;
    date: string;
}

export interface EkeyListResponse {
    list: Ekey[];
    pageNo: number;
    pageSize: number;
    pages: number;
    total: number;
  }