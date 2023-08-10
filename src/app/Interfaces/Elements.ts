export interface Ekey {
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
    keyType:number;
    startDay:string;
    endDay:string;
    weekDays:string;
    //Recibidos de ekeyService.getEkeysofAccount
    //lockData: string;
    //usertype: string;
    //lockName: string;
    //lockAlias: string;
    //lockMac: string;
    //noKeyPwd: string;
}

export interface Passcode {
    endDate: string;
    sendDate: string;
    keyboardPwdId: number;
    nickName: string;
    keyboardPwdType: number;
    lockId: number;
    keyboardPwdVersion: number;
    isCustom: number;
    keyboardPwdName: string; // Optional property
    keyboardPwd: string;
    startDate: string;
    senderUsername?: string; // Optional property
    receiverUsername?: string; // Optional property
    status: number;
}

export interface Card {
    cardId: number;
    lockId: number;
    cardNumber: string;
    cardName: string;
    cardType: number;
    startDate: string;
    endDate: string;
    createDate: string;
    senderUsername: string;
}

export interface Fingerprint{
    fingerprintId: number;
    lockId: number;
    fingerprintNumber: string;
    fingerprintType:number;
    fingerprintName: number;
    startDate: number;
    endDate: number;
    cyclicConfig: recurringPeriodFingerprint[];
    createDate: string;
    senderUsername: string;
}

export interface recurringPeriodFingerprint {
    weekDay:number;
    startTime:string;
    endTime:string;
}

export interface Record {
    recordId:string;
    lockId:number;
    recordTypeFromLock:number;
    recordType:number;
    success:number;
    username:string;
    lockDate:string;
    serverDate:string;
}