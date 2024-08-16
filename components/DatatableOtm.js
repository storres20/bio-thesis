import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from "nookies";

const DataTableComponent = ({ items = [] }) => {
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
            $.fn.dataTable.ext.search.push(function(settings, data) {
                const estado = data[1]; // "Estado" is in the second column
                if (estadoFilter === '' || estado === estadoFilter) {
                    return true;
                }
                return false;
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
    const location = cookies.location;

    // Sort items by 'fecha_open' in descending order
    const sortedItems = [...items].sort((a, b) => new Date(b.fecha_open) - new Date(a.fecha_open));

    const handleView = (item) => {
        // Handle view logic here
        console.log(item._id)
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
                    <th>Atencion</th>
                </tr>
                </thead>
                <tbody>
                {sortedItems
                    .filter(item => item.inventories_id.location === location) // Filter by location
                    .map(item => (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {/*{item.estado === "open" && (
                                    <button
                                        onClick={() => router.push(`/health/checkotm/${item._id}`)}
                                        className="bg-blue-500 text-white p-2 rounded">Check
                                    </button>
                                )}*/}
                                <button onClick={() => handleView(item)}  className="view-btn text-blue-500">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableComponent;
