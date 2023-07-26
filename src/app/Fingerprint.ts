export interface Fingerprint{
    fingerprintId: number;
    lockId: number;
    fingerprintNumber: string;
    fingerprintType:number;
    fingerprintName: number;
    startDate: string;
    endDate: string;
    //cyclicConfig: ¿JSONArray?
    createDate: string;
    senderUsername: string;
}

export interface FingerprintFormulario {
    fingerprintName:string;
    fingerprintStartTime:string;
    fingerprintEndTime:string;
  }