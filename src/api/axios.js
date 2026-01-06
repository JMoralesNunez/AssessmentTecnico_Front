import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:5028/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add access token to requests
api.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Save error to localStorage for persistence across refreshes
        const errorLog = {
            url: originalRequest.url,
            status: error.response?.status,
            data: error.response?.data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('last_api_error', JSON.stringify(errorLog));

        // Don't retry for 401 on login/register/logout/refresh itself
        const isAuthRequest = originalRequest.url.toLowerCase().includes('/auth/');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get('refreshToken');
                if (!refreshToken) {
                    console.error('No hay refresh token disponible');
                    throw new Error('No refresh token');
                }

                console.log('Intentando refrescar token con:', refreshToken);
                const response = await axios.post('http://localhost:5028/api/Auth/refresh', {
                    refreshToken: refreshToken
                });

                console.log('Respuesta del refresh:', response.data);
                const { accessToken, token, refreshToken: newRefreshToken } = response.data;
                const finalToken = accessToken || token;

                if (!finalToken) throw new Error('Refresh response missing access token');

                Cookies.set('accessToken', finalToken, { path: '/' });
                if (newRefreshToken) {
                    Cookies.set('refreshToken', newRefreshToken, { path: '/' });
                }

                originalRequest.headers.Authorization = `Bearer ${finalToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error crítico al refrescar token:', refreshError);
                // Persistent log of the refresh failure
                localStorage.setItem('refresh_failure', JSON.stringify({
                    error: refreshError.message,
                    responseData: refreshError.response?.data
                }));

                // Clear cookies and logout only if it's a real failure
                Cookies.remove('accessToken', { path: '/' });
                Cookies.remove('refreshToken', { path: '/' });
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
