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

    /* Fetch data when component mounts */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/historialbyids/getByHistorial/${id}`);
                const result = await response.json();
                //console.log(result);

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
                    //console.log(sortedData[0]);
                } else {
                    setData([]); // Set to an empty array if result is not an array
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]); // Set to an empty array on error
            }
        };

        fetchData();
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
        router.push('/health/otm');
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM by Id</h1>

            <button onClick={returnBack} className="bg-red-500 text-white p-2 rounded mb-4">Return back</button>

            {/* Check if oneData and oneData.historials_id exist before accessing estado */}
            {oneData && oneData.historials_id && (
                <div>
                    <p>Fecha de Solicitud: {oneData.historials_id.fecha_open}</p>
                    <p className={`whitespace-nowrap ${oneData.historials_id.estado === 'open' ? 'text-blue-500' : oneData.historials_id.estado === 'close' ? 'text-red-500' : 'text-black'} `}>
                        Estado: {oneData.historials_id.estado}
                    </p>
                    <p>Problema: {oneData.historials_id.problema}</p>
                    <p>Open by: {oneData.historials_id.usersid_open.email}</p>
                    <p>Assinged Tech: {oneData.users_id.email}</p>
                    <br/>
                    <p>Equipo</p>
                    <p>Nombre: {oneData.historials_id.inventories_id.name}</p>
                    <p>Marca: {oneData.historials_id.inventories_id.brand}</p>
                    <p>Modelo: {oneData.historials_id.inventories_id.model}</p>
                    <p>Serie: {oneData.historials_id.inventories_id.serie}</p>
                    <p>Codepat: {oneData.historials_id.inventories_id.codepat}</p>
                    <p>Location: {oneData.historials_id.inventories_id.location}</p>
                    <p>Sub Location: {oneData.historials_id.inventories_id.sub_location}</p>
                    <br/>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {data.map(item => (
                    <div key={item._id} className="bg-gray-100 border-slate-300 border-solid border-2 shadow-md p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">otm id: {item._id}</h2>
                        <p>note: {item.note}</p>
                        <p className="text-gray-500 text-sm mt-2">Date: {item.fecha}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OtmDetails;
