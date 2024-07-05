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

    const [modalOpen, setModalOpen] = useState(false);

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

    const addItem = (e) => {
        e.preventDefault()
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
                closeModal()
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

    const closeModal = () => {
        setModalOpen(false);
    }

    const openModal = () => {
        setModalOpen(true);
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">Inventory</h1>
            <button onClick={openModal} className="bg-blue-500 text-white p-2 rounded">Add Item</button>
            {modalOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70">
                    <div className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2">
                        <button onClick={closeModal} className="float-right text-gray-500 hover:text-gray-700">✖️</button>
                        <form onSubmit={addItem}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Brand</label>
                                <input
                                    type="text"
                                    placeholder="Item Brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Model</label>
                                <input
                                    type="text"
                                    placeholder="Item Model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Serie</label>
                                <input
                                    type="text"
                                    placeholder="Item Serie"
                                    value={serie}
                                    onChange={(e) => setSerie(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Location</label>
                                <input
                                    type="text"
                                    placeholder="Item Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Codepat</label>
                                <input
                                    type="text"
                                    placeholder="Item Codepat"
                                    value={codepat}
                                    onChange={(e) => setCodepat(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Item</button>
                        </form>
                    </div>
                </div>
            )}

            <ul>
                {items.map(item => (
                    <li key={item._id} className="mb-2 flex justify-between items-center">
                        {item.name} - {item.brand} - {item.model} - {item.serie} - {item.location} - {item.codepat}
                        <button onClick={() => deleteItem(item._id)}
                                className="bg-red-500 text-white p-2 rounded">Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryPage;
