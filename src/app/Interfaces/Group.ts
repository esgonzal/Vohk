import { LockData } from "./Lock";

export interface Group {
    groupId: number,
    groupName: string
    lockCount: number;
    locks: LockData[]
}
export interface addGroupResponse {
    groupId: number;
    description: string;
    errcode: number;
    errmsg: string;
}
export interface GroupResponse {
    list: Group[];
}