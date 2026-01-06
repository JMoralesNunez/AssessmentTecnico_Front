import { defineStore } from 'pinia';
import api from '@/api/axios';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!Cookies.get('accessToken'),
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/Auth/login', credentials);
                console.log('Login Response Full:', response.data);
                const { accessToken, token, refreshToken, user } = response.data;
                const finalToken = accessToken || token;

                if (finalToken) {
                    Cookies.set('accessToken', finalToken, { expires: 1, path: '/' });
                    Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
                    this.user = user;
                } else {
                    console.error('No se encontró el token en la respuesta:', response.data);
                    throw new Error('Token not found in response');
                }

                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error en el login';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/Auth/register', userData);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error en el registro';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await api.post('/Auth/logout');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                Cookies.remove('accessToken', { path: '/' });
                Cookies.remove('refreshToken', { path: '/' });
                this.user = null;
                window.location.href = '/login';
            }
        }
    },
});
