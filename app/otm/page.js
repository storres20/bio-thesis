'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* DataTable */
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
/************************/

import {parseCookies} from "nookies";

const OtmPage = () => {
    /* DataTable useState*/
    const [dataLoaded, setDataLoaded] = useState(false);

    /* Get "hospitals_id" from cookies*/
    const cookies = parseCookies();
    const hospitals_id = cookies.hospitals_id
    //console.log(hospitals_id)

    const router = useRouter();

    const [items, setItems] = useState([]);


    /**
     * Fetch items from the server and set them using setItems function.
     *
     * @function fetchItems
     * @returns {void}
     */

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch(`http://localhost:3001/api/v1/historials/getByHospital/${hospitals_id}`)
            .then(response => response.json())
            .then(data => {

                /* Filtered by "show" and the current "hospitals_id" */
                /*let filteredData = data.filter(item => item.show === "1");
                setItems(filteredData)*/
                setItems(data)
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    /* DataTable useEffect */
    useEffect(() => {
        if (items.length > 0 && !dataLoaded) {
            // Initialize DataTable
            $('#example').DataTable();
            setDataLoaded(true);
        }
    }, [items, dataLoaded]);

    const newotm = () => {
      router.push('/newotm')
    }



    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM</h1>
            <button onClick={newotm} className="bg-blue-500 text-white p-2 rounded">New OTM</button>

            {/* DataTable*/}
            <div className="overflow-x-auto">
                <table id="example" className="display">
                    <thead>
                    <tr>
                        <th>Fecha de solicitud</th>
                        <th>Usuario inicial</th>
                        <th>Estado</th>
                        <th>Codigo patrimonial</th>
                        <th>Nombre del equipo</th>
                        <th>Servicio/Departamento</th>
                        <th>Problema</th>
                        <th>Solucion</th>
                        <th>Fecha de cierre</th>
                        <th>Usuario final</th>
                        <th>Atencion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.fecha_open}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.usersid_open?.email}</td>
                            <td
                                className={`px-6 py-4 whitespace-nowrap ${item.estado === 'open' ? 'text-blue-500' : item.estado === 'close' ? 'text-red-500' : 'text-black'} `}
                            >
                                {item.estado}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.inventories_id.codepat}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.inventories_id.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.servicio}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.problema}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.solucion}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.fecha_close}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.usersid_close?.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {item.estado === "open" && (
                                    <button
                                        onClick={() => router.push(`/checkotm/${item._id}`)}
                                        className="bg-blue-500 text-white p-2 rounded">Check
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OtmPage;
