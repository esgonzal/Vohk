export interface Group {
    groupId: number,
    groupName: string
    lockCount: number;
}

export interface GroupResponse {
    list:Group[];
}