import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAdmin = localStorage.getItem('isAdmin');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsAdmin(storedAdmin === 'true');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
            const { user, token } = response.data;
            
            setUser(user);
            setIsAdmin(user.role === 'admin');
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, { email, password });
            const { user, token } = response.data;
            
            setUser(user);
            setIsAdmin(true);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Admin login failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAdmin(false);
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const setToken = async (token) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Optionally fetch user data here
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
            const user = response.data;
            setUser(user);
            setIsAdmin(user.role === 'admin');
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');
        } catch (error) {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, logout, loading, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
