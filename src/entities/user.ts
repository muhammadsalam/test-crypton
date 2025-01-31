import { create } from 'zustand'

export interface UserState {
    token: string;
    email: string;
    id: string;
}

export const useUserStore = create<UserState>(() => ({
    token: localStorage.getItem('token') || '',
    email: '',
    id: '',
}))
