'use client'

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import config from '@/config';
import { parseCookies } from 'nookies';

const DataTableComponent = dynamic(() => import('@/components/health/DatatableInventory'), { ssr: false });

const InventoryPage = () => {
    const [hydrated, setHydrated] = useState(false);
    const [items, setItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serie, setSerie] = useState('');
    const [location, setLocation] = useState('');
    const [codepat, setCodepat] = useState('');

    const cookies = parseCookies();
    const hospitals_id = cookies.hospitals_id;
    const hospitals_name = hydrated ? cookies.hospitals_name : '';
    const location_name = hydrated ? cookies.location : '';

    useEffect(() => {
        setHydrated(true);
        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch(`${config.apiUrl}/inventories/getByHospital/${hospitals_id}`)
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => item.show === '1');
                setItems(filteredData);
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    const addItem = (e) => {
        e.preventDefault();
        fetch(`${config.apiUrl}/inventories/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, brand, model, serie, location, codepat, hospitals_id }),
        })
            .then(response => response.json())
            .then(data => {
                setItems([...items, data]);
                setName('');
                setBrand('');
                setModel('');
                setSerie('');
                setLocation('');
                setCodepat('');
                setModalOpen(false);
            })
            .catch(error => console.error('Error adding item:', error));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Inventory</h1>

            {hydrated && (
                <p className="text-sm text-gray-700 mb-6">
                    <strong>Hospital:</strong> {hospitals_name} | <strong>Area:</strong> {location_name}
                </p>
            )}

            <div className="mt-6">
                <DataTableComponent items={items} setItems={setItems} />
            </div>
        </div>
    );
};

export default InventoryPage;
