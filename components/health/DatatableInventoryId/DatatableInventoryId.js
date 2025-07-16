// @/components/health/DatatableInventoryId/DatatableInventoryId
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import config from '@/config';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NewOtmModal from './NewOtmModal';

const DataTableComponent = ({ id }) => {
    const [item, setItem] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [newotmModalOpen, setNewotmModalOpen] = useState(false);
    const [allClosed, setAllClosed] = useState(false); // NEW STATE

    const router = useRouter();

    const fetchHistoryData = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/historials/getByInventory/${id}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                data.sort((a, b) => new Date(b.fecha_open) - new Date(a.fecha_open));
                setHistoryData(data);
                setAllClosed(data.every(entry => entry.estado.toLowerCase() === 'close')); // UPDATE STATE
            } else {
                console.error('Expected an array but got:', data);
                setHistoryData([]);
                setAllClosed(true); // Assume empty means all closed
            }
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

        return () => {
            if ($.fn.DataTable.isDataTable('#example')) {
                $('#example').DataTable().clear().destroy();
                $('#example tbody').off('click', 'button.view-btn');
            }
        };
    }, [id]);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable('#example')) {
            $('#example').DataTable().clear().destroy();
            $('#example tbody').off('click', 'button.view-btn');
        }

        if (historyData && historyData.length > 0) {
            const table = $('#example').DataTable({
                paging: true,
                searching: true,
                lengthChange: true,
                info: true,
                order: [[0, 'desc']],
                data: historyData,
                columns: [
                    { data: 'fecha_open' },
                    { data: 'problema' },
                    {
                        data: 'estado',
                        render: function (data) {
                            const estado = data.toLowerCase();
                            if (estado === 'open') {
                                return `<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Open</span>`;
                            } else if (estado === 'in progress') {
                                return `<span class="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">In Progress</span>`;
                            } else if (estado === 'close') {
                                return `<span class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Close</span>`;
                            } else {
                                return `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">${data}</span>`;
                            }
                        },
                    },
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            return `<button class="view-btn text-blue-500" data-id="${meta.row}">View</button>`;
                        },
                    },
                ],
                destroy: true,
            });

            $('#example tbody').on('click', 'button.view-btn', function () {
                const rowIdx = $(this).data('id');
                handleView(historyData[rowIdx]);
            });
        } else {
            $('#example').DataTable({
                paging: true,
                searching: true,
                lengthChange: true,
                info: true,
                order: [[0, 'desc']],
                data: [],
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
        if (allClosed) {
            setNewotmModalOpen(true);
        }
    };

    const handleView = (item) => {
        router.push(`/health/otm/${item._id}`);
    };

    return (
        <div>
            <NewOtmModal
                isOpen={newotmModalOpen}
                onClose={() => setNewotmModalOpen(false)}
                item={item}
                fetchHistoryData={fetchHistoryData}
            />

            {/* Add NEWOTM Button + Card */}
            <div className="mb-6">
                <button
                    onClick={newOtm}
                    disabled={!allClosed}
                    className={`px-4 py-2 rounded text-white transition ${
                        allClosed
                            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    ➕ Add NEWOTM
                </button>

                <div
                    className={`mt-3 p-3 rounded shadow text-sm ${
                        allClosed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                    {allClosed
                        ? '✅ All previous OTMs are closed. You can add a new one.'
                        : '⚠️ There are still OTMs in progress. Please close them before creating a new one.'}
                </div>
            </div>

            {/* Device Info */}
            {item && (
                <div className="bg-white rounded shadow p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                    <p><strong>Brand:</strong> {item.brand}</p>
                    <p><strong>Model:</strong> {item.model}</p>
                    <p><strong>Serie:</strong> {item.serie}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Sub Location:</strong> {item.sub_location}</p>
                    <p><strong>Codepat:</strong> {item.codepat}</p>
                </div>
            )}

            {/* History Table */}
            <h2 className="text-lg font-semibold mb-2">📜 Maintenance History</h2>
            <div className="overflow-x-auto">
                <table id="example" className="display w-full text-sm">
                    <thead>
                    <tr>
                        <th>Fecha de Solicitud</th>
                        <th>Problema</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historyData && historyData.map((entry, i) => (
                        <tr key={i}>
                            <td>{entry.fecha_open}</td>
                            <td>{entry.problema}</td>
                            <td>{entry.estado}</td>
                            <td>
                                <button
                                    onClick={() => handleView(entry)}
                                    className="view-btn text-blue-500 underline"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTableComponent;
