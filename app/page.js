// app/page.js
'use client'

import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export default function Home() {
    const cookies = parseCookies();
    const users_id = cookies.users_id;
    const users_email = cookies.users_email;
    const hospitals_id = cookies.hospitals_id;
    const hospitals_name = cookies.hospitals_name;
    const profile = cookies.profile;
    const location = cookies.location;

    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const modules = [
        {
            name: 'OTM Module',
            description: 'Create and track official maintenance work orders.',
            path: '/health',
        },
        {
            name: 'FT Module',
            description: 'View and edit the technical sheet of each device.',
            path: '/ft',
        },
        {
            name: 'RH Module',
            description: 'Access full maintenance history of each device.',
            path: '/rh',
        },
        {
            name: 'Inventory & QR',
            description: 'Register devices and generate QR codes.',
            path: '/inventory',
        },
        {
            name: 'PDF Export',
            description: 'Export OTM, FT, or RH in structured PDF format.',
            path: '/pdf',
        },
    ];

    return (
        isHydrated && (
            <main className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Welcome 👋</h1>
                    <p className="text-sm">User: <strong>{users_email}</strong></p>
                    <p className="text-sm">Profile: <strong>{profile}</strong></p>
                    <p className="text-sm">Hospital: <strong>{hospitals_name}</strong></p>
                    <p className="text-sm">Area: <strong>{location}</strong></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map((module) => (
                        <div
                            key={module.name}
                            className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 cursor-pointer p-6 border border-gray-200"
                            onClick={() => router.push(module.path)}
                        >
                            <h2 className="text-xl font-semibold mb-2">{module.name}</h2>
                            <p className="text-gray-600 text-sm">{module.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        )
    );
}
