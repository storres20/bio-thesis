// app/storage/page.js
'use client'

import { setCookie, parseCookies, destroyCookie } from 'nookies';

export default function StoragePage() {

    const cookies = parseCookies();
    const profile = cookies.profile

    if (profile !== 'STORAGE' && profile !== 'ADMIN') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div>
            <h1>Storage Content</h1>
            {/* Import and use other components here */}
        </div>
    );
}
