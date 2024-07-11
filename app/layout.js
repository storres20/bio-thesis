'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

// Redux
import { Provider } from 'react-redux';
import store from '@/redux/configureStore';
// ****

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Provider store={store}>
            <AuthProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
            </AuthProvider>
        </Provider>
        </body>
        </html>
    );
}

function LayoutWrapper({ children }) {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            {children}
        </>
    );
}
