import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const cookies = parseCookies();
        if (cookies['auth-token']) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (email, password) => {
        if (email === 'user@example.com' && password === 'password') {
            setCookie(null, 'auth-token', 'authenticated', { maxAge: 30 * 24 * 60 * 60, path: '/' });
            setIsAuthenticated(true);
            router.push('/');
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const register = (username, email, password) => {
        // Add real registration logic here
        setCookie(null, 'auth-token', 'authenticated', { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        destroyCookie(null, 'auth-token');
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
