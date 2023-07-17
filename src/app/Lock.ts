export interface MoreLockData{
  groupId: number;
  logoUrl: string;
  orgId: number;
  protocolType: number;
  protocolVersion: number;
  scene: number;
}

export interface LockData {
  bindDate: number;
  buildingNumber: number;
  date: number;
  electricQuantity: number;
  electricQuantityUpdateDate: number;
  featureValue: string;
  floorNumber: number;
  hasGateway: number;
  keyboardPwdVersion: number;
  lockAlias: string;
  lockData: string;
  lockId: number;
  lockMac: string;
  lockName: string;
  lockVersion: MoreLockData[];
  showAdminKbpwdFlag: boolean;
  noKeyPwd: string;
  passageMode: number;
  specialValue: number;
  timezoneRawOffset: number;
  wirelessKeypadFeatureValue: string;
}

export interface LockListResponse {
  list: LockData[];
  pageNo: number;
  pageSize: number;
  pages: number;
  total: number;
}