export interface MoreLockData{
  groupId: number;
  protocolVersion: number;
  protocolType: number;
  orgId: number;
  scene: number;
  logoUrl: string;  
  showAdminKbpwdFlag: boolean
}

export interface LockData {
  //Estos datos se reciben de getLockListAccount. bindDate y electricQuantityUpdateDate Son los únicos no compartidos con getEkeysofAccount
  //bindDate: number;
  date: number;
  electricQuantity: number;
  //electricQuantityUpdateDate: number;
  featureValue: string;
  hasGateway: number;
  keyboardPwdVersion: number;
  lockAlias: string;
  lockData: string;
  lockId: number;
  lockMac: string;
  lockName: string;
  lockVersion: MoreLockData[];
  noKeyPwd: string;
  passageMode: number;
  specialValue: string;
  timezoneRawOffset: string;
  wirelessKeypadFeatureValue: string;
  //Estos datos se reciben de getEkeysofAccount
  deletePwd: string;
  endDate:number;
  keyId:number;
  keyName:string;
  keyRight: number;
  keyStatus:string;
  remarks:string;
  remoteEnable:number;
  startDate:number;
  userType:string;
}

export interface LockDetails {
  //Estos datos vienen de LockDetails. Solo se muestran los únicos
  adminPwd: string;
  aesKeyStr:string;
  autoLockTime: number;
  date: number;
  deletePwd: string;
  displayPasscode: number;
  electricQuantity: number;
  featureValue: string;
  firmwareRevision: string;
  hasGateway: number;
  hardwareRevision: string;
  isFrozen: number;
  keyboardPwdVersion: number;
  lockAlias: string;
  lockFlagPos: number;
  lockId: number;
  lockKey: string;
  lockMac: string;
  lockName: string;
  lockSound:number;
  lockUpdateDate:number;
  lockVersion: MoreLockData[];
  modelNum: string;
  noKeyPwd: string;
  openDirection: number;
  passageMode: number;
  passageModeAutoUnlock: number;
  privacyLock: number;
  resetButton: number;
  sensitivity: number;
  soundVolume: number;
  specialValue: string;
  tamperAlert: number;
  timezoneRawOffset: string;
  wirelessKeypadFeatureValue: string;
}

export interface LockListResponse {
  list: LockData[];
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
}