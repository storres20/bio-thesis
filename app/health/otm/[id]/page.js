// app/health/otm/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config from '@/config';

const OtmDetails = ({ params }) => {
    const { id } = params;
    const router = useRouter();

    const [data, setData] = useState([]);
    const [oneData, setOneData] = useState(null);
    const [historialData, setHistorialData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/historialbyids/getByHistorial/${id}`);
                const result = await response.json();

                if (Array.isArray(result)) {
                    const sortedData = result.sort((a, b) => parseDate(b.fecha) - parseDate(a.fecha));
                    setData(sortedData);
                    setOneData(sortedData[0]);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            }
        };

        const fetchHistorialData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/historials/${id}`);
                const result = await response.json();
                setHistorialData(result);
            } catch (error) {
                console.error('Error fetching historial data:', error);
            }
        };

        fetchData();
        fetchHistorialData();
    }, [id]);

    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(', ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        return new Date(year, month - 1, day, hours, minutes);
    };

    const returnBack = () => {
        router.back();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-blue-800">🛠️ OTM Details</h1>

            <button
                onClick={returnBack}
                className="mb-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                ← Return Back
            </button>

            {historialData && (
                <>
                    <div className="text-center mb-10">
                        <button
                            onClick={() => window.open(`/health/otm/${id}/preview`, '_blank')}
                            disabled={historialData.estado !== 'close'}
                            className={`px-6 py-2 rounded text-white font-medium transition ${
                                historialData.estado === 'close'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            📄 View PDF Preview
                        </button>

                        {historialData.estado !== 'close' && (
                            <p className="text-sm text-gray-500 mt-2 italic">
                                Only available once the OTM status is <strong>Close</strong>.
                            </p>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-8">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">📋 OTM Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><strong>Fecha de Solicitud:</strong> {historialData.fecha_open}</p>
                            <p className="flex items-center gap-2 whitespace-nowrap">
                                <strong>Estado:</strong>
                                {historialData.estado === 'open' && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                                      Open
                                    </span>
                                )}
                                {historialData.estado === 'in progress' && (
                                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
                                      In Progress
                                    </span>
                                )}
                                {historialData.estado === 'close' && (
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                                      Close
                                    </span>
                                )}
                            </p>

                            <p><strong>Problema:</strong> {historialData.problema}</p>
                            <p><strong>Open by:</strong> {historialData.usersid_open?.email}</p>
                            <p><strong>Assigned Tech:</strong> {historialData.usersid_tech?.email || 'Is Pending'}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">🔧 Device Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <p><strong>Name:</strong> {historialData.inventories_id?.name}</p>
                                <p><strong>Brand:</strong> {historialData.inventories_id?.brand}</p>
                                <p><strong>Model:</strong> {historialData.inventories_id?.model}</p>
                                <p><strong>Serie:</strong> {historialData.inventories_id?.serie}</p>
                                <p><strong>Codepat:</strong> {historialData.inventories_id?.codepat}</p>
                                <p><strong>Location:</strong> {historialData.inventories_id?.location}</p>
                                <p><strong>Sub Location:</strong> {historialData.inventories_id?.sub_location}</p>
                            </div>
                        </div>

                        {historialData.images?.length > 0 && (
                            <div className="mt-6">
                                <p className="font-semibold mb-2">🖼️ Preview Images:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {historialData.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="object-cover w-full h-32 cursor-pointer border border-gray-300 rounded hover:scale-105 transition-transform"
                                            onClick={() => window.open(image, '_blank')}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                </>
            )}

            {oneData && (
                <div className="pt-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">📚 Historials of Attention</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {data.map(item => (
                            <div
                                key={item._id}
                                className="bg-gray-100 border border-gray-300 p-4 rounded-md shadow-sm"
                            >
                                <h3 className="text-base font-semibold mb-1 text-blue-700">OTM ID: {item._id}</h3>
                                <p className="text-sm text-gray-700"><strong>Note:</strong> {item.note}</p>
                                <p className="text-xs text-gray-500 mt-1">🕒 Date: {item.fecha}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OtmDetails;
