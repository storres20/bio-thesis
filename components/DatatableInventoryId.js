import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import config from '@/config'; //for apiUrl

import {useEffect, useState} from 'react';

const DataTableComponent = ({ id = [] }) => {

    const [item, setItem] = useState(null);
    const [historyData, setHistoryData] = useState(null);

    useEffect(() => {
        if (historyData && historyData.length > 0) {
            $('#example').DataTable();
        }
    }, [historyData]);

    useEffect(() => {
        if (id) {
            fetch(`${config.apiUrl}/inventories/${id}`)
                .then(response => response.json())
                .then(data => setItem(data))
                .catch(error => console.error('Error fetching item:', error));

            fetch(`${config.apiUrl}/historials/getByInventory/${id}`)
                .then(response => response.json())
                .then(data => setHistoryData(data))
                .catch(error => console.error('Error fetching history:', error));
        }
    }, [id]);

    // Check if the details and historyData have been set. If not, still loading.
    if (!item || !historyData) return <div>Loading...</div>;

    return (
    // The table structure goes here
    // Example:
        <div>
            <h1>Name: {item.name}</h1>
            <p>Brand: {item.brand}</p>
            <p>Model: {item.model}</p>
            <p>Serie: {item.serie}</p>
            <p>Location: {item.location}</p>
            <p>Codepat: {item.codepat}</p>
            <br/>
            <h2>History</h2>
            {historyData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table id="example" className="display">
                    <thead>
                    <tr>
                        <th>Fecha de Solicitud</th>
                        <th>Problema</th>
                        <th>Solucion</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        historyData.map((entry, i) => (
                            <tr key={i}>
                                <td>{entry.fecha_open}</td>
                                <td>{entry.problema}</td>
                                <td>{entry.solucion}</td>
                                <td>{entry.estado}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table id="example" className="display">
                        <thead>
                        <tr>
                            <th>Info</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>NO DATA TO SHOW</td>
                            </tr>
                        </tbody>

                    </table>
                </div>

            )}
        </div>
    );
}

export default DataTableComponent;