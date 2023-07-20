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

export interface PasscodeListResponse {
    list: Fingerprint[];
    pageNo: number;
    pageSize: number;
    pages: number;
    total: number;
  }