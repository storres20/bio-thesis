import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import {useState, useEffect, useRef} from "react";
const roles = {
    ADMIN: ["STORAGE", "HEALTH", "MAINTENANCE"],
    STORAGE: ["STORAGE"],
    HEALTH: ["HEALTH"],
    MAINTENANCE: ["MAINTENANCE"],
};
const Dropdown = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("focusin", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("focusin", handleClickOutside);
        };
    }, []);
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={()=> setIsOpen(!isOpen)} className="text-white hover:text-gray-300">Health</button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {children.map((child) => {
                            // Cloning child elements and adding additional onClick to them
                            return (
                                <div onClick={()=>setIsOpen(false)}>
                                    {child}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const cookies = parseCookies();
    const profile = cookies.profile ? cookies.profile : "ADMIN";
    if (!isAuthenticated) return null;
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-white hover:text-gray-300">Home</Link>
                    {roles[profile].includes("STORAGE") && (
                        <Link href="/storage" className="text-white hover:text-gray-300">Storage</Link>
                    )}
                    {roles[profile].includes("HEALTH") && (
                        <Dropdown>
                            <Link href="/health" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Home</Link>
                            <Link href="/health/inventory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Inventory</Link>
                            <Link href="/health/otm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">OTM</Link>
                        </Dropdown>
                    )}
                    {roles[profile].includes("MAINTENANCE") && (
                        <Link href="/maintenance" className="text-white hover:text-gray-300">Maintenance</Link>
                    )}
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