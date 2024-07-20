// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import config from '@/config'; //for apiUrl

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


    /**
     * Logs in a user with the given email and password.
     *
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @throws {Error} If the email or password is invalid.
     * @returns {Promise<void>} A promise that resolves when the login process is complete.
     */
    const login = async (email, password) => {
        /* users_id */
        const response_users = await fetch(`${config.apiUrl}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const users_id = await response_users.json();
        const login_user = users_id.filter(user => user.email === email && user.password === password)[0];

        if(login_user) {
            // The user was found
            //console.log(login_user);
            setCookie(null, 'users_id', login_user._id, { maxAge: 30 * 24 * 60 * 60, path: '/' });
            setCookie(null, 'hospitals_name', login_user.hospitals_id.name, { maxAge: 30 * 24 * 60 * 60, path: '/' });
            setCookie(null, 'hospitals_id', login_user.hospitals_id._id, { maxAge: 30 * 24 * 60 * 60, path: '/' });
            setCookie(null, 'profile', login_user.profile, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        } else {
            // The user was not found
            console.log("No user matching the provided email and password was found")
        }
        /**********************/

        const response = await fetch(`${config.apiUrl}/users`, {
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
        const response = await fetch(`${config.apiUrl}/users/create`, {
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
        destroyCookie(null, 'users_id');
        destroyCookie(null, 'hospitals_id');
        destroyCookie(null, 'hospitals_name');
        destroyCookie(null, 'profile');
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
