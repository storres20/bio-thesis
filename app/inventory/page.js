'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serie, setSerie] = useState('');
    const [location, setLocation] = useState('');
    const [codepat, setCodepat] = useState('');

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch('http://localhost:3001/api/v1/inventories')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching items:', error));
    };

    const addItem = () => {
        fetch('http://localhost:3001/api/v1/inventories/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, brand, model, serie, location, codepat }),
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
            })
            .catch(error => console.error('Error adding item:', error));
    };

    const deleteItem = (id) => {
        fetch(`http://localhost:3001/api/v1/inventories/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setItems(items.filter(item => item._id !== id));
            })
            .catch(error => console.error('Error deleting item:', error));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">Inventory</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Item Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Item Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Item Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Item Serie"
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Item Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Item Codepat"
                    value={codepat}
                    onChange={(e) => setCodepat(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button onClick={addItem} className="bg-blue-500 text-white p-2 rounded">Add Item</button>
            </div>
            <ul>
                {items.map(item => (
                    <li key={item._id} className="mb-2 flex justify-between items-center">
                        {item.name} - {item.brand} - {item.model} - {item.serie} - {item.location} - {item.codepat}
                        <button onClick={() => deleteItem(item._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryPage;
