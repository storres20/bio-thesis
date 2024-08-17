'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config from '@/config'; // for apiUrl

const OtmDetails = ({ params }) => {
    const { id } = params;

    /* Router */
    const router = useRouter();

    /* State to hold fetched data */
    const [data, setData] = useState([]);
    const [oneData, setOneData] = useState(null);
    const [historialData, setHistorialData] = useState(null); // New state for additional fetch

    /* Fetch data when component mounts */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/historialbyids/getByHistorial/${id}`);
                const result = await response.json();

                // Ensure that result is an array before setting it
                if (Array.isArray(result)) {
                    // Parse the date string and sort data from newest to oldest
                    const sortedData = result.sort((a, b) => {
                        const dateA = parseDate(a.fecha);
                        const dateB = parseDate(b.fecha);
                        return dateB - dateA;
                    });
                    setData(sortedData);
                    setOneData(sortedData[0]);
                } else {
                    setData([]); // Set to an empty array if result is not an array
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]); // Set to an empty array on error
            }
        };

        const fetchHistorialData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/historials/${id}`);
                const result = await response.json();
                setHistorialData(result);
                //console.log(result)
            } catch (error) {
                console.error('Error fetching historial data:', error);
            }
        };

        fetchData();
        fetchHistorialData(); // Fetch additional data

    }, [id]);

    /* Parse date string in 'DD/MM/YYYY, HH:MM' format */
    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(', ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        return new Date(year, month - 1, day, hours, minutes);
    };

    /* Handle return back */
    const returnBack = () => {
        //router.push('/health/otm');
        router.back();
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM by Id</h1>

            <button onClick={returnBack} className="bg-red-500 text-white p-2 rounded mb-4">Return back</button>

            {/* Check if historialData exist before accessing estado */}
            {historialData && (
                <div>
                    <p>Fecha de Solicitud: {historialData.fecha_open}</p>
                    <p className={`whitespace-nowrap ${historialData.estado === 'open' ? 'text-blue-500' : historialData.estado === 'close' ? 'text-red-500' : 'text-black'} `}>
                        Estado: {historialData.estado}
                    </p>
                    <p><b>Problema: {historialData.problema}</b></p>
                    <p>Open by: {historialData.usersid_open.email}</p>

                    <p><b>Assigned Tech: {oneData && oneData.historials_id && oneData.users_id ? oneData.users_id.email : 'Is Pending'}</b></p>

                    <br/>
                    <p>Equipo</p>
                    <p>Nombre: {historialData.inventories_id.name}</p>
                    <p>Marca: {historialData.inventories_id.brand}</p>
                    <p>Modelo: {historialData.inventories_id.model}</p>
                    <p>Serie: {historialData.inventories_id.serie}</p>
                    <p>Codepat: {historialData.inventories_id.codepat}</p>
                    <p>Location: {historialData.inventories_id.location}</p>
                    <p>Sub Location: {historialData.inventories_id.sub_location}</p>
                    <br/>

                    {/* Preview images section */}
                    {historialData.images && historialData.images.length > 0 && (
                        <div>
                            <p>Preview Images:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {historialData.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="object-cover w-full h-32 cursor-pointer border-2 border-gray-300 rounded"
                                            onClick={() => window.open(image, '_blank')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {oneData && (
                <div className="grid grid-cols-1 gap-4 pt-5">
                    <p>Historials of attention:</p>
                    {data.map(item => (
                        <div key={item._id}
                             className="bg-gray-100 border-slate-300 border-solid border-2 shadow-md p-4 rounded-lg">
                            <h2 className="text-xl font-bold mb-2">otm id: {item._id}</h2>
                            <p>note: {item.note}</p>
                            <p className="text-gray-500 text-sm mt-2">Date: {item.fecha}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default OtmDetails;
