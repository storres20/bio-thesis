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
    const router = useRouter();

    const fetchHistoryData = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/historials/getByInventory/${id}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                data.sort((a, b) => new Date(b.fecha_open) - new Date(a.fecha_open));
                setHistoryData(data);
            } else {
                setHistoryData([]);
                console.error('Expected array, got:', data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            alert('Failed to fetch history data');
        }
    };

    useEffect(() => {
        if (id) {
            fetch(`${config.apiUrl}/inventories/${id}`)
                .then(res => res.json())
                .then(data => setItem(data))
                .catch(err => console.error('Error fetching item:', err));
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
                    { data: 'estado' },
                    {
                        data: null,
                        render: (_, __, row, meta) => {
                            return `<button class="view-btn text-blue-500" data-id="${meta.row}">View</button>`;
                        }
                    }
                ],
                destroy: true
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
                        render: () => '<button class="view-btn text-blue-500">View</button>',
                    }
                ],
                destroy: true,
            });
        }
    }, [historyData]);

    const newOtm = () => {
        const allClosed = historyData.every(entry => entry.estado.toLowerCase() === 'close');
        if (allClosed) {
            setNewotmModalOpen(true);
        } else {
            alert('Not all OTMs are closed.');
        }
    };

    const handleView = (entry) => {
        router.push(`/health/otm/${entry._id}`);
    };

    return (
        <div className="space-y-6">
            <NewOtmModal
                isOpen={newotmModalOpen}
                onClose={() => setNewotmModalOpen(false)}
                item={item}
                fetchHistoryData={fetchHistoryData}
            />

            <button
                onClick={newOtm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                ➕ Add NEWOTM
            </button>

            {item && (
                <div className="bg-gray-100 p-4 rounded-md shadow">
                    <h2 className="text-lg font-semibold mb-2">Device Information</h2>
                    <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Brand:</strong> {item.brand}</p>
                        <p><strong>Model:</strong> {item.model}</p>
                        <p><strong>Serie:</strong> {item.serie}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Sub Location:</strong> {item.sub_location}</p>
                        <p><strong>Codepat:</strong> {item.codepat}</p>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold mb-2">History</h2>
                <div className="overflow-x-auto rounded border">
                    <table id="example" className="display w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2">Fecha de Solicitud</th>
                            <th className="px-4 py-2">Problema</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Acción</th>
                        </tr>
                        </thead>
                        <tbody />
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTableComponent;
