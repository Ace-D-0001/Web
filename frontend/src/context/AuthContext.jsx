import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAdmin = localStorage.getItem('isAdmin');
        if (storedUser) {
            setUser(storedUser);
            setIsAdmin(storedAdmin === 'true');
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        if (username === 'usger' && password === 'password') {
            setUser(username);
            setIsAdmin(false);
            localStorage.setItem('user', username);
            localStorage.setItem('isAdmin', 'false');
            return true;
        }
        return false;
    };

    const adminLogin = (username, password) => {
        if (username === 'admin' && password === 'admin123') {
            setUser(username);
            setIsAdmin(true);
            localStorage.setItem('user', username);
            localStorage.setItem('isAdmin', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
