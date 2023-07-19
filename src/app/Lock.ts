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
  date: number;
  lockAlias: string;
  lockSound: number;
  modelNum: string;
  lockMac: string;
  privacyLock: number;
  deletePwd: string;
  featureValue: string;
  adminPwd: string;
  soundVolume: number;
  hasGateway: number;
  autoLockTime: number;
  wirelessKeypadFeatureValue: string;
  floorNumber: number;
  buildingNumber: number;
  lockKey: string;
  isFrozen: number;
  lockName: string;
  resetButton: number;
  firmwareRevision: string;
  tamperAlert: number;
  //specialValue: number;
  displayPasscode: number;
  noKeyPwd: string;
  passageMode: number;
  passageModeAutoUnlock: number;
  //timezoneRawOffset: number;
  lockId: number;
  electricQuantity: number;
  lockFlagPos: number;
  //lockUpdateDate:number
  keyboardPwdVersion: number;
  aesKeyStr: string;
  hardwareRevision: string;
  openDirection: number;
  lockVersion: MoreLockData[];
  sensitivity: number;

  //All of the above are response from GetLockDetails

  bindDate: number;
  lockData: string;
  electricQuantityUpdateDate: number;
}

export interface LockListResponse {
  list: LockData[];
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
}