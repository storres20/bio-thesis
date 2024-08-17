'use client'

import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from "nookies";
import config from '@/config'; //for apiUrl

const DataTableComponent = ({ items = [], fetchItems = null }) => {

    /* Initialization */
    const [estadoFilter, setEstadoFilter] = useState(''); // State to hold selected filter

    // Extract unique "estado" values from items
    const uniqueEstados = [...new Set(items.map(item => item.estado))];

    useEffect(() => {
        // Destroy existing DataTable instance if it exists
        if ($.fn.DataTable.isDataTable('#example')) {
            $('#example').DataTable().destroy();
        }

        // Initialize DataTable only if items are present
        if (items.length > 0) {
            const table = $('#example').DataTable({
                order: [[0, 'desc']], // Sort by the first column (Fecha de solicitud) in descending order
                paging: false, // Optional: Disable pagination if you want to show all data at once
                searching: true, // Enable searching for filtering
                info: false, // Optional: Disable table information display
                destroy: true, // Ensure that DataTable can be reinitialized
            });

            // Custom filter by "estado"
            $.fn.dataTable.ext.search.push(function (settings, data) {
                const estado = data[1]; // "Estado" is in the second column
                return estadoFilter === '' || estado === estadoFilter;
            });

            // Redraw the table after applying the filter
            table.draw();
        }

        // Clean up: remove custom filter when component unmounts
        return () => {
            $.fn.dataTable.ext.search.pop();
        };
    }, [items, estadoFilter]);

    /* Router */
    const router = useRouter();

    /* Cookies */
    const cookies = parseCookies();
    const usersid_tech = cookies.users_id;

    // Sort items by 'fecha_open' in descending order
    const sortedItems = [...items].sort((a, b) => new Date(b.fecha_open) - new Date(a.fecha_open));

    const handleView = (item) => {
        router.push(`/health/otm/${item._id}`);
    };

    const handleAssign = (item) => {
        console.log(item._id);

        fetch(`${config.apiUrl}/historials/${item._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usersid_tech: usersid_tech,
                estado: 'in progress',
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update the historial.');
                }
                return response.json();
            })
            .then(updatedItem => {
                console.log('Historial updated:', updatedItem);

                // Fetch the updated items after successful update, if fetchItems is provided
                if (fetchItems) {
                    fetchItems();
                }
            })
            .catch(error => {
                console.error('Error updating historial:', error);
            });
    };

    return (
        <div className="overflow-x-auto">
            <div className="mb-4">
                <label htmlFor="estadoFilter" className="mr-2">Filter by Estado:</label>
                <select
                    id="estadoFilter"
                    value={estadoFilter}
                    onChange={(e) => setEstadoFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All</option>
                    {uniqueEstados.map(estado => (
                        <option key={estado} value={estado}>
                            {estado}
                        </option>
                    ))}
                </select>
            </div>
            <table id="example" className="display">
                <thead>
                <tr>
                    <th>Fecha de solicitud</th>
                    <th>Estado</th>
                    <th>Codigo patrimonial</th>
                    <th>Nombre</th>
                    <th>Location</th>
                    <th>Sub Location</th>
                    <th>Problema</th>
                    <th>Assigned to</th>
                    <th>Atencion</th>
                </tr>
                </thead>
                <tbody>
                {sortedItems.map(item => (
                    <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.fecha_open}</td>
                        <td
                            className={`px-6 py-4 whitespace-nowrap ${item.estado === 'open' ? 'text-blue-500' : item.estado === 'close' ? 'text-red-500' : 'text-black'} `}
                        >
                            {item.estado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.inventories_id.codepat}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.inventories_id.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.inventories_id.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.inventories_id.sub_location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.problema}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {item.usersid_tech ? item.usersid_tech.email : 'No assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onClick={() => handleView(item)} className="view-btn text-blue-500">View</button>
                            {!item.usersid_tech && (
                                <button onClick={() => handleAssign(item)} className="view-btn text-white bg-blue-600 p-2 rounded-md">Assign</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableComponent;
