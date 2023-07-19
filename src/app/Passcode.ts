export interface Passcode {
    endDate: number;
    sendDate: number;
    keyboardPwdId: number;
    nickName: string;
    keyboardPwdType: number;
    lockId: number;
    keyboardPwdVersion: number;
    isCustom: number;
    keyboardPwdName?: string; // Optional property
    keyboardPwd: string;
    startDate: number;
    senderUsername?: string; // Optional property
    receiverUsername?: string; // Optional property
    status: number;
  }
  
  export interface PasscodeListResponse {
    list: Passcode[];
    pageNo: number;
    pageSize: number;
    pages: number;
    total: number;
  }