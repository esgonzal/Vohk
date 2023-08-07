export interface GatewayLock {
    gatewayId: number;
    gatewayMac: string;
    gatewayName: string;
    rssi: number;
    rssiUpdateDate: string;
}

export interface GatewayAccount {
    gatewayId: number;
    gatewayMac: string;
    gatewayVersion: string;
    networkName: string;
    lockNum: number;
    isOnline: number;
}