'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* DataTable */
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
import {parseCookies} from "nookies";
/************************/

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

    /* edit item */
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editBrand, setEditBrand] = useState('');
    const [editModel, setEditModel] = useState('');
    const [editSerie, setEditSerie] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCodepat, setEditCodepat] = useState('');

    /* DataTable useState*/
    const [dataLoaded, setDataLoaded] = useState(false);

    const router = useRouter();

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
        fetch(`http://localhost:3001/api/v1/inventories/getByHospital/${hospitals_id}`)
            .then(response => response.json())
            .then(data => {

                /* Filtered by "show" and the current "hospitals_id" */
                let filteredData = data.filter(item => item.show === "1");
                setItems(filteredData)
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    /* VIEW ITEM function */
    const viewItem = (id) => {
        router.push(`/inventory/${id}`);
    };
    /**********************/

    /* NEW OTM function */
    const newOtm = (id) => {
        router.push(`/newotm/${id}`);
    };
    /**********************/


    /* ADD ITEM function */
    const addItem = (e) => {
        e.preventDefault()

        fetch('http://localhost:3001/api/v1/inventories/create', {
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

    const openModal = () => {
        setModalOpen(true);
    }
    /* ******* */

    /*const deleteItem = (id) => {
        fetch(`http://localhost:3001/api/v1/inventories/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setItems(items.filter(item => item._id !== id));
            })
            .catch(error => console.error('Error deleting item:', error));
    };*/

    const deleteItem = (id) => {
        fetch(`http://localhost:3001/api/v1/inventories/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ show: "0" }),
        })
            .then(() => {
                setItems(items.filter(item => item._id !== id));
            })
            .catch(error => console.error('Error updating item:', error));
    };

    /* EDIT ITEM function */
    const editItem = (item) => {
        openEditModal(item);
    };

    const updateItem = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3001/api/v1/inventories/${editItemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: editName, brand: editBrand, model: editModel, serie: editSerie, location: editLocation, codepat: editCodepat }),
        })
            .then(response => response.json())
            .then(data => {
                setItems(items.map(item =>
                    item._id === editItemId ? data : item
                ));
                closeEditModal()
            })
            .catch(error => console.error('Error updating item:', error));
    };

    /* open and close modal for EDIT ITEM */
    const openEditModal = (item) => {
        setEditItemId(item._id);
        setEditName(item.name);
        setEditBrand(item.brand);
        setEditModel(item.model);
        setEditSerie(item.serie);
        setEditLocation(item.location);
        setEditCodepat(item.codepat);
        setEditModalOpen(true);
    }

    const closeEditModal = () => {
        setEditModalOpen(false);
    }
    /* ********* */

    /* DataTable useEffect */
    useEffect(() => {
        if (items.length > 0 && !dataLoaded) {
            // Initialize DataTable
            $('#example').DataTable();
            setDataLoaded(true);
        }
    }, [items, dataLoaded]);

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">Inventory</h1>
            <button onClick={openModal} className="bg-blue-500 text-white p-2 rounded">Add Item</button>

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

            {/* EDIT ITEM modal */}
            {editModalOpen && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2">
                        <button onClick={closeEditModal} className="float-right text-gray-500 hover:text-gray-700">✖️
                        </button>
                        <form onSubmit={updateItem}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Brand</label>
                                <input
                                    type="text"
                                    value={editBrand}
                                    onChange={(e) => setEditBrand(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Model</label>
                                <input
                                    type="text"
                                    value={editModel}
                                    onChange={(e) => setEditModel(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Serie</label>
                                <input
                                    type="text"
                                    value={editSerie}
                                    onChange={(e) => setEditSerie(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Location</label>
                                <input
                                    type="text"
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Item Codepat</label>
                                <input
                                    type="text"
                                    value={editCodepat}
                                    onChange={(e) => setEditCodepat(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>

                            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Update
                                Item
                            </button>

                        </form>
                    </div>
                </div>
            )}
            {/******************/}

            {/* DataTable*/}
            <div className="overflow-x-auto">
                <table id="example" className="display">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Serie</th>
                        <th>Location</th>
                        <th>Codepat</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.serie}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.codepat}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {/*<button onClick={() => viewItem(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">View
                                </button>*/}
                                <button onClick={() => newOtm(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">NewOtm
                                </button>
                                <button onClick={() => viewItem(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">View
                                </button>
                                <button onClick={() => editItem(item)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">Edit
                                </button>
                                <button onClick={() => deleteItem(item._id)}
                                        className="text-red-600 hover:text-red-900 m-1">Delete
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

export default InventoryPage;
