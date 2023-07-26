export interface Passcode {
    endDate: string;
    sendDate: number;
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
  
  export interface PasscodeFormulario {
    passcodeName: string;
    passcodePwd: string;
    passcodeStartTime: string;
    passcodeEndTime: string;
  }