'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import config from '@/config'; //for apiUrl
/* Loader */
import Loader from '@/components/Loader'

const RegisterPage = () => {

    /* Initialization */
    const { register } = useAuth();
    const [hospitals_id, setHospitalsId] = useState('');
    const [profile, setProfile] = useState('HEALTH');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [hospitals, setHospitals] = useState([]);

    /* Loader */
    const [loading, setLoading] = useState(false);

    // Fetch hospitals
    useEffect(() => {
        fetch(`${config.apiUrl}/hospitals`)
            .then(response => response.json())
            .then(data => setHospitals(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Loader

        try {
            await register(profile, email, password, hospitals_id);
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            {loading && <Loader />}
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Hospital:</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={hospitals_id}
                            onChange={(e) => setHospitalsId(e.target.value)}
                            required
                        >
                            <option value="">--select an option--</option>

                            {hospitals.map(hospital =>
                                <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Profile:</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                            required
                        >
                            <option value="HEALTH">HEALTH</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                            <option value="STORAGE">STORAGE</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
