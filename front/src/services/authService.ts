import api from './api';

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', {
            email: data.email,
            password: data.password,
            first_name: data.firstName,
            last_name: data.lastName,
        });
        return response.data;
    },
    
    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};
