import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import config from '@/config'; // for apiUrl

import { useEffect, useState } from 'react';
import NewOtmModal from './NewOtmModal';

const DataTableComponent = ({ id }) => {
    const [item, setItem] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [newotmModalOpen, setNewotmModalOpen] = useState(false);

    const fetchHistoryData = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/historials/getByInventory/${id}`);
            const data = await response.json();
            data.sort((a, b) => new Date(b.fecha_open) - new Date(a.fecha_open));
            setHistoryData(data);
        } catch (error) {
            console.error('Error fetching history:', error);
            alert('Failed to fetch history data');
        }
    };

    useEffect(() => {
        if (id) {
            fetch(`${config.apiUrl}/inventories/${id}`)
                .then(response => response.json())
                .then(data => setItem(data))
                .catch(error => console.error('Error fetching item:', error));
            fetchHistoryData();
        }
    }, [id]);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable('#example')) {
            $('#example').DataTable().clear().destroy();
        }

        if (historyData && historyData.length > 0) {
            $('#example').DataTable({
                paging: true,
                searching: true,
                lengthChange: true,
                info: true,
                order: [[0, 'desc']],
                data: historyData,
                columns: [
                    { data: 'fecha_open' },
                    { data: 'problema' },
                    { data: 'estado' },
                    {
                        data: null,
                        render: function () {
                            return '<button class="view-btn text-blue-500">View</button>';
                        },
                    },
                ],
                destroy: true,
            });
        }
    }, [historyData]);

    const newOtm = () => {
        setNewotmModalOpen(true);
    };

    return (
        <div>
            <NewOtmModal
                isOpen={newotmModalOpen}
                onClose={() => setNewotmModalOpen(false)}
                item={item}
                fetchHistoryData={fetchHistoryData}
            />
            <button onClick={newOtm} className="bg-blue-500 text-white p-2 rounded">Add NEWOTM</button>
            {item && (
                <>
                    <h1>Name: {item.name}</h1>
                    <p>Brand: {item.brand}</p>
                    <p>Model: {item.model}</p>
                    <p>Serie: {item.serie}</p>
                    <p>Location: {item.location}</p>
                    <p>Codepat: {item.codepat}</p>
                </>
            )}
            <br />
            <h2>History</h2>
            <div className="overflow-x-auto">
                <table id="example" className="display">
                    <thead>
                    <tr>
                        <th>Fecha de Solicitud</th>
                        <th>Problema</th>
                        <th>Estado</th>
                        <th>Accion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historyData && historyData.map((entry, i) => (
                        <tr key={i}>
                            <td>{entry.fecha_open}</td>
                            <td>{entry.problema}</td>
                            <td>{entry.estado}</td>
                            <td><button className="view-btn text-blue-500">View</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTableComponent;
