import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useEffect } from 'react';

const DataTableComponent = ({ items = [], dataLoaded }) => {
    useEffect(() => {
        if (items.length > 0 && !dataLoaded) {
            $('#example').DataTable();
        }
    }, [items]);

    return (
        // The table structure goes here
        // Example:
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
    );
};

export default DataTableComponent;