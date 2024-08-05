// app/health/page.js
'use client'

import dynamic from 'next/dynamic';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import QrCodeReader from '@/components/QrCodeReader';

// Dynamic Import
const DataTableComponent = dynamic(
    () => import('@/components/DatatableInventoryId'),
    { ssr: false }
);

export default function HealthPage() {
    const cookies = parseCookies();
    const profile = cookies.profile;

    const [result, setResult] = useState('');

    if (profile !== 'HEALTH' && profile !== 'ADMIN') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="p-8">
            <h1>Health Content</h1>
            <h2>QR Code Reader</h2>
            <QrCodeReader result={result} setResult={setResult} />
            <div>
                <h2 className="text-xl font-semibold">Scanned Result:</h2>
                <p className="mt-2 text-lg">{result}</p>
            </div>
            {/* DataTable*/}
            {result && (
                <DataTableComponent id={result}/>
            )}
        </div>
    );
}
