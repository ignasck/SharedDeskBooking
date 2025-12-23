
export enum DeskStatus {
    Open = 0,
    Reserved = 1,
    Maintenance = 2
}
export interface Desk {
    id: number;
    number: number;
    status: DeskStatus;
    reservedBy?: string;
    reservedById?: string;
    reservationStart?: string;
    reservationEnd?: string;
    maintenanceInfo?: string;
    currentReservationId?: number;
}

export interface Reservation {
    id: number;
    deskId: number;
    userId: string;
    userFullName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    desk?: Desk;
}

export interface CreateReservationRequest {
    deskId: number;
    userId: string;
    userFullName: string;
    startDate: string;
    endDate: string;
}

export interface User {
    id: string;
    fullName: string;
}
