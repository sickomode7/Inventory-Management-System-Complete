import { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
