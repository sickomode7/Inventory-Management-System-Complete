import api from './axios';

export const login = async (username, password) => {
    const response = await api.post('/auth/signin', { username, password });
    if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const register = async (username, email, password, roles = ['user']) => {
    const response = await api.post('/auth/signup', { username, email, password, roles });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
