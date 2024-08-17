// app/health/page.js
'use client'

import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QrCodeReader from '@/components/QrCodeReader';

export default function HealthPage() {
    const cookies = parseCookies();
    const profile = cookies.profile;
    const router = useRouter(); // Add the useRouter hook

    const [result, setResult] = useState('');
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (result) {
            // Redirect to the new page
            router.push(`/health/${result}`);
        }
    }, [result, router]); // Trigger when result changes

    if (!hydrated) {
        return null; // or a loading indicator
    }

    if (profile !== 'HEALTH' && profile !== 'ADMIN') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="p-8">
            <h1>Health Content</h1>
            <h2>QR Code Reader</h2>
            <QrCodeReader setResult={setResult} />
        </div>
    );
}
