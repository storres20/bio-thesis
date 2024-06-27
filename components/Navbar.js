'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-white hover:text-gray-300">Home</Link>
                    <Link href="/inventory" className="text-white hover:text-gray-300">Inventory</Link>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
