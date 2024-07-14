'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* DataTable */
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
/************************/

const OtmPage = () => {
    const router = useRouter();

    /* DataTable useState*/
    const [dataLoaded, setDataLoaded] = useState(false);

    /* DataTable useEffect */
    useEffect(() => {
        if (!dataLoaded) {
            // Initialize DataTable
            $('#example').DataTable();
            setDataLoaded(true);
        }
    }, [dataLoaded]);

    const newotm = () => {
      router.push('/newotm')
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM</h1>
            <button onClick={newotm} className="bg-blue-500 text-white p-2 rounded">Add OTM</button>

            {/* DataTable*/}
            <div className="overflow-x-auto">
                <table id="example" className="display">
                    <thead>
                    <tr>
                        <th>Fecha de solicitud</th>
                        <th>Codigo patrimonial</th>
                        <th>Nombre del equipo</th>
                        <th>Datos del usuario</th>
                        <th>Problema</th>
                        <th>Estado</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                        <td>Equipo muestra mensaje de error E-664</td>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                    </tr>
                    <tr>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                        <td>Equipo no enciende. Suena chillido</td>
                        <td>asdasdasd</td>
                        <td>asdasdasd</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OtmPage;
