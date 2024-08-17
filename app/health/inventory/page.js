'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import config from '@/config'; //for apiUrl

/* DataTable */
// Dynamic Import
const DataTableComponent = dynamic(
    () => import('@/components/health/DatatableInventory'),
    { ssr: false }
);
/************************/
import {parseCookies} from "nookies";

const InventoryPage = () => {
    /* add new item*/
    const [modalOpen, setModalOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serie, setSerie] = useState('');
    const [location, setLocation] = useState('');
    const [codepat, setCodepat] = useState('');

    /* Get "hospitals_id" from cookies*/
    const cookies = parseCookies();
    const hospitals_id = cookies.hospitals_id

    useEffect(() => {
        fetchItems();
    }, []);

    /**
     * Fetch items from the server and set them using setItems function.
     *
     * @function fetchItems
     * @returns {void}
     */
    const fetchItems = () => {
        fetch(`${config.apiUrl}/inventories/getByHospital/${hospitals_id}`)
            .then(response => response.json())
            .then(data => {

                /* Filtered by "show" and the current "hospitals_id" */
                let filteredData = data.filter(item => item.show === "1");
                setItems(filteredData)
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    /* ADD ITEM function */
    const addItem = (e) => {
        e.preventDefault()

        fetch(`${config.apiUrl}/inventories/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
                closeModal()
            })
            .catch(error => console.error('Error adding item:', error));
    };

    /* open and close modal for ADD ITEM*/
    const closeModal = () => {
        setModalOpen(false);
    }

    /*const openModal = () => {
        setModalOpen(true);
    }*/
    /* ******* */


    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">Inventory</h1>
            {/*<button onClick={openModal} className="bg-blue-500 text-white p-2 rounded">Add Item</button>*/}

            {/* ADD ITEM modal */}
            {modalOpen && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2">
                        <button onClick={closeModal} className="float-right text-gray-500 hover:text-gray-700">✖️
                        </button>
                        <form onSubmit={addItem}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Name</label>
                                <input
                                    type="text"
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
                                    value={codepat}
                                    onChange={(e) => setCodepat(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Item
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/******************/}

            {/* DataTable*/}
            <DataTableComponent items={items} setItems={setItems} />

        </div>
    );
};

export default InventoryPage;
