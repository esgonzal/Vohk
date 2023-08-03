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
  endDate:string;
  keyId:number;
  keyName:string;
  keyRight: number;
  keyStatus:string;
  remarks:string;
  remoteEnable:number;
  startDate:string;
  userType:string;

  /* Estos datos vienen de LockDetails. Solo se muestran los únicos
  aesKeyStr:string;
  adminPwd: string;
  autoLockTime: number;
  displayPasscode: number;
  firmwareRevision: string;
  hardwareRevision: string;
  isFrozen: number;
  lockFlagPos: number;
  lockKey: string;
  lockSound:number;
  lockUpdateDate:number
  modelNum: string;
  openDirection: number;
  passageModeAutoUnlock: number;
  privacyLock: number;
  resetButton: number;
  sensitivity: number;
  soundVolume: number;
  tamperAlert: number;
  */
}

export interface LockListResponse {
  list: LockData[];
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
}