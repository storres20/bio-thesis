// app/health/page.js
'use client'

import { setCookie, parseCookies, destroyCookie } from 'nookies';
import QrCodeReader from '@/components/QrCodeReader';

export default function HealthPage() {

    const cookies = parseCookies();
    const profile = cookies.profile

    if (profile !== 'HEALTH' && profile !== 'ADMIN') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="p-8">
            {/* Import and use other components here */}
            <h1>Health Content</h1>

            <h2>QR Code Reader</h2>
            <QrCodeReader/>
        </div>
    );
}
