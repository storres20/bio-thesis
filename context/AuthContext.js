import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const login = (email, password) => {
        if (email === 'user@example.com' && password === 'password') {
            setIsAuthenticated(true);
            router.push('/');
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const register = (username, email, password) => {
        // You should add real registration logic here
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        setIsAuthenticated(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
