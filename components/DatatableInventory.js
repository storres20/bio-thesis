import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

const DataTableComponent = ({ items = [], dataLoaded }) => {
    /* Backend API URL */
    //const apiUrl = 'http://localhost:3001/api/v1'
    const apiUrl = 'https://bio-thesis-mongoback.vercel.app/api/v1'

    /* useState - edit item */
    const [itemx, setItemx] = useState(items);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editBrand, setEditBrand] = useState('');
    const [editModel, setEditModel] = useState('');
    const [editSerie, setEditSerie] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCodepat, setEditCodepat] = useState('');

    useEffect(() => {
        if (itemx.length > 0 && !dataLoaded) {
            $('#example').DataTable();
        }
    }, [itemx, dataLoaded]);

    /* Router */
    const router = useRouter();

    /* NEW OTM function */
    const newOtm = (id) => {
        router.push(`/newotm/${id}`);
    };
    /**********************/

    /* VIEW ITEM function */
    const viewItem = (id) => {
        router.push(`/inventory/${id}`);
    };
    /**********************/

    /* EDIT ITEM function */
    const editItem = (item) => {
        openEditModal(item);
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

    const updateItem = (e) => {
        e.preventDefault()
        fetch(`${apiUrl}/inventories/${editItemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: editName, brand: editBrand, model: editModel, serie: editSerie, location: editLocation, codepat: editCodepat }),
        })
            .then(response => response.json())
            .then(data => {
                setItemx(itemx.map(item =>
                    item._id === editItemId ? data : item
                ));
                closeEditModal()
            })
            .catch(error => console.error('Error updating item:', error));
    };

    const deleteItem = (id) => {
        fetch(`${apiUrl}/inventories/${id}`, {
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


    return (
        // The table structure goes here
        // Example:
        <div>
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
                        {itemx.map(item => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.serie}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.codepat}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

export default DataTableComponent;