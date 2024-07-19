// app/inventories/[id]/page.js
'use client'
import { useEffect, useState } from 'react';

const InventoryDetail = ({ params }) => {
    const { id } = params;
    const [item, setItem] = useState(null);
    const [historyData, setHistoryData] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/api/v1/inventories/${id}`)
                .then(response => response.json())
                .then(data => setItem(data))
                .catch(error => console.error('Error fetching item:', error));

            fetch(`http://localhost:3001/api/v1/historials/getByInventory/${id}`)
                .then(response => response.json())
                .then(data => setHistoryData(data))
                .catch(error => console.error('Error fetching history:', error));
        }
    }, [id]);

    // Check if the details and historyData have been set. If not, still loading.
    if (!item || !historyData) return <div>Loading...</div>;

    return (
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
                <table>
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
            ) : (
                <table>
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

            )}
        </div>
    );
};
export default InventoryDetail;