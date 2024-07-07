// app/inventories/[id]/page.js
'use client'

import { useEffect, useState } from 'react';

const InventoryDetail = ({ params }) => {
    const { id } = params;
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/api/v1/inventories/${id}`)
                .then(response => response.json())
                .then(data => setItem(data))
                .catch(error => console.error('Error fetching item:', error));
        }
    }, [id]);

    if (!item) return <div>Loading...</div>;

    return (
        <div>
            <h1>Name: {item.name}</h1>
            <p>Brand: {item.brand}</p>
            <p>Model: {item.model}</p>
            <p>Serie: {item.serie}</p>
            <p>Location: {item.location}</p>
            <p>Codepat: {item.codepat}</p>
        </div>
    );
};

export default InventoryDetail;
