// context/AuthContext.js
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
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await fetch('http://localhost:3001/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.status === 1) {
            setCookie(null, 'auth-token', 'authenticated', { maxAge: 30 * 24 * 60 * 60, path: '/' });
            setIsAuthenticated(true);
            router.push('/'); // Redirect to inventory page after login
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const register = async (profile, email, password) => {
        const response = await fetch('http://localhost:3001/api/v1/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile, email, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to register');
        }

        const data = await response.json();
        setCookie(null, 'auth-token', 'authenticated', { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setIsAuthenticated(true);
        router.push('/'); // Redirect to inventory page after registration
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
