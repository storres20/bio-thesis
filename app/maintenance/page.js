// app/maintenance/page.js
'use client'

import { setCookie, parseCookies, destroyCookie } from 'nookies';

export default function MaintenancePage() {

    const cookies = parseCookies();
    const profile = cookies.profile

    if (profile !== 'MAINTENANCE' && profile !== 'ADMIN') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div>
            <h1>Maintenance Content</h1>
            {/* Import and use other components here */}
        </div>
    );
}
