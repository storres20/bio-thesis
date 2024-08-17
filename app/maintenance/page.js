// app/maintenance/page.js
'use client'

import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import {useEffect, useState} from "react";

export default function MaintenancePage() {

    /* Initialization */
    /* Cookies */
    const cookies = parseCookies();
    const profile = cookies.profile

    /* Router */
    const router = useRouter();

    /* useState */
    const [hydrated, setHydrated] = useState(false);


    /* useEffect */
    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleAllOtm = () => {
        router.push('/maintenance/allotm');
    }


    /* Conditional Render */
    if (!hydrated) {
        return null; // or a loading indicator
    }

    if (profile !== 'MAINTENANCE' && profile !== 'ADMIN') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Maintenance Content</h1>
            {/* Import and use other components here */}
            <button
                type="button"
                onClick={handleAllOtm}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                all otm
            </button>

        </div>
    );
}
