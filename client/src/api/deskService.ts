import axiosClient from './axiosClient';
import { Desk, CreateReservationRequest } from '../types';

export const deskService = {
    // get all tables
    getDesks: async () => {
        const response = await axiosClient.get<Desk[]>('/Desk');
        return response.data;
    },

    // new reservation
    bookDesk: async (request: CreateReservationRequest) => {
        const response = await axiosClient.post('/Desk/book', request);
        return response.data;
    },
    cancelReservation: async (reservationId: number) => {
        const response = await axiosClient.post('/Desk/cancel', reservationId);
        return response.data;
    }
};
