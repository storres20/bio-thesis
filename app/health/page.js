// app/health/page.js
'use client'

import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QrCodeReader from '@/components/QrCodeReader';
import config from "@/config";

export default function HealthPage() {
    const cookies = parseCookies();
    const profile = cookies.profile;
    const hospitals_name = cookies.hospitals_name;
    const location = cookies.location;

    const router = useRouter();
    const [result, setResult] = useState('');
    const [serialInput, setSerialInput] = useState('');
    const [message, setMessage] = useState('');
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    // If result contains a device ID (not serial), redirect directly
    useEffect(() => {
        if (result) {
            router.push(`/health/${result}`);
        }
    }, [result, router]);

    const handleSerialRedirect = async () => {
        if (!serialInput.trim()) {
            setMessage('Please enter a valid device SERIE.');
            return;
        }

        try {
            const res = await fetch(`${config.apiUrl}/inventories/serie/${serialInput}`);
            const data = await res.json();

            if (res.ok && data._id) {
                router.push(`/health/${data._id}`);
            } else {
                alert('⚠️ Device not found for the given serie.');
            }
        } catch (error) {
            console.error(error);
            alert('❌ Error while searching by serie.');
        }
    };

    if (!hydrated) return null;

    if (profile !== 'HEALTH' && profile !== 'ADMIN') {
        return <p className="text-red-600 p-6">You do not have access to this page.</p>;
    }

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Health Module</h1>

            <p className="text-sm text-gray-700 mb-6">
                <strong>Hospital:</strong> {hospitals_name} | <strong>Area:</strong> {location}
            </p>

            <div className="space-y-6">
                {/* QR Code Scanner */}
                <div>
                    <label className="block text-base font-semibold mb-2">
                        Option 01: Scan QR or Attach Image
                    </label>
                    <QrCodeReader setResult={setResult} />
                </div>

                {/* Manual Input for device SERIE */}
                <div>
                    <label className="block text-base font-semibold mb-2">
                        Option 02: Enter Device SERIE manually
                    </label>

                    <input
                        type="text"
                        value={serialInput}
                        onChange={(e) => {
                            setSerialInput(e.target.value);
                            setMessage(''); // clear message on typing
                        }}
                        className="w-full p-2 border rounded placeholder-gray-400"
                        placeholder="e.g., SN123456789"
                    />

                    <button
                        onClick={handleSerialRedirect}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go to Device
                    </button>

                    {/* Conditional message */}
                    {message && (
                        <div className="mt-2 text-sm text-red-600">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
