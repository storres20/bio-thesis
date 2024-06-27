'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
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
