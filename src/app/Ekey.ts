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
    //Recibidos de ekeyService.getEkeysofAccount
    lockData: string;
    usertype: string;
    lockName: string;
    lockAlias: string;
    lockMac: string;
    noKeyPwd: string;
}

export interface EkeyFormulario {
    keyName:string;
    remoteEnable:string;
    ekeyStartTime:string;
    ekeyEndTime:string;
    recieverName:string
  }