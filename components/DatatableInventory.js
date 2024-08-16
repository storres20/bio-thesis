import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import config from '@/config'; //for apiUrl

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

import {parseCookies} from "nookies";

const DataTableComponent = ({ items = [], setItems }) => {
    /* useState - edit item */
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editBrand, setEditBrand] = useState('');
    const [editModel, setEditModel] = useState('');
    const [editSerie, setEditSerie] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCodepat, setEditCodepat] = useState('');

    /* useState - newotm item */
    const [newotmModalOpen, setNewotmModalOpen] = useState(false)
    const [newotmItemId, setNewotmItemId] = useState(null);
    const [newotmName, setNewotmName] = useState('');
    const [newotmBrand, setNewotmBrand] = useState('');
    const [newotmModel, setNewotmModel] = useState('');
    const [newotmSerie, setNewotmSerie] = useState('');
    const [newotmLocation, setNewotmLocation] = useState('');
    const [newotmCodepat, setNewotmCodepat] = useState('');

    const [servicio, setServicio] = useState() // servicio hospitalario
    const [problema, setProblema] = useState() // descripcion del problema

    /* Get "user_id" from cookies*/
    const cookies = parseCookies();
    const users_id = cookies.users_id
    const hospitals_id = cookies.hospitals_id
    const location = cookies.location

    /* Datatable - useEffect */
    useEffect(() => {
        if (items.length > 0) {
            $('#example').DataTable();
        }
    }, [items]);

    /* Router */
    const router = useRouter();

    /* VIEW ITEM function */
    const viewItem = (id) => {
        router.push(`/health/inventory/${id}`);
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
        fetch(`${config.apiUrl}/inventories/${editItemId}`, {
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
    /* ********* */

    /* NEWOTM ITEM function */
    const newOtm = (item) => {
        //console.log(item)
        openNewotmModal(item);
    };

    /* open and close modal for NEWOTM ITEM */
    const openNewotmModal = (item) => {
        setNewotmItemId(item._id);
        setNewotmName(item.name);
        setNewotmBrand(item.brand);
        setNewotmModel(item.model);
        setNewotmSerie(item.serie);
        setNewotmLocation(item.location);
        setNewotmCodepat(item.codepat);
        setNewotmModalOpen(true);
    }

    const closeNewotmModal = () => {
        setServicio('')
        setProblema('')
        setNewotmModalOpen(false);
    }

    const datePeru = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Lima',
        hour12: false, // Don't Use AM/PM
    });

    const dateTimePeru = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Lima',
        hour12: false, // Don't Use AM/PM
    });

    const addotm = (e) => {
        e.preventDefault()

        fetch(`${config.apiUrl}/historials/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hospitals_id: hospitals_id,
                inventories_id: newotmItemId,
                servicio: servicio,
                problema: problema,
                fecha_open: dateTimePeru,
                estado: 'open',
                usersid_open: users_id,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    setResp(response)
                    alert('Error al agregar OTM. Intente denuevo')
                    throw Error('Error adding OTM')
                }
                return response.json()
            })
            .then(data => {
                //console.log(data)
                closeNewotmModal()
                router.push('/health/otm')
            })
            .catch(error => {
                console.error('Error adding OTM:', error)
            });
    }

    /* ********* */

    const deleteItem = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            // Action to delete item
            fetch(`${config.apiUrl}/inventories/${id}`, {
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
        }
    };


    return (
        // The table structure goes here
        // Example:
        <div>
            {/* EDIT ITEM modal */}
            {editModalOpen && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2 max-h-screen overflow-y-auto mt-4 md:mt-12">
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

            {/* NEW OTM modal */}
            {newotmModalOpen && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-y-auto">
                    <div className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2 max-h-screen overflow-y-auto mt-4 md:mt-12">
                        <button onClick={closeNewotmModal} className="float-right text-gray-500 hover:text-gray-700">✖️
                        </button>
                        <form onSubmit={addotm}>
                            <p>NEW OTM modal</p>
                            <div className="mb-4">
                                <label>Codigo Patrimonial</label>
                                <input
                                    type="text"
                                    value={newotmCodepat}
                                    onChange={(e) => setNewotmCodepat(e.target.value)}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={newotmName}
                                    onChange={(e) => setNewotmName(e.target.value)}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label>Item Brand</label>
                                <input
                                    type="text"
                                    value={newotmBrand}
                                    onChange={(e) => setNewotmBrand(e.target.value)}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label>Item Model</label>
                                <input
                                    type="text"
                                    value={newotmModel}
                                    onChange={(e) => setNewotmModel(e.target.value)}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label>Item Serie</label>
                                <input
                                    type="text"
                                    value={newotmSerie}
                                    onChange={(e) => setNewotmSerie(e.target.value)}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label>Item Location</label>
                                <input
                                    type="text"
                                    value={newotmLocation}
                                    onChange={(e) => setNewotmLocation(e.target.value)}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label>Fecha de Solicitud</label>
                                <input
                                    type="text"
                                    value={datePeru}
                                    className="px-3 py-2 border rounded bg-gray-300"
                                    disabled
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Servicio Hospitalario</label>
                                <input type="text" className="px-3 py-2 border rounded"
                                       onChange={(e) => setServicio(e.target.value)}
                                       value={servicio}
                                       required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="">Descripcion del Problema</label>
                                <input type="text" className="px-3 py-2 border rounded"
                                       onChange={(e) => setProblema(e.target.value)}
                                       value={problema}
                                       required
                                />
                            </div>

                            <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Newotm
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
                        <th>Sub Location</th>
                        <th>Codepat</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items
                        .filter(item => item.location === location)  // Filter by location
                        .map(item => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.serie}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.sub_location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.codepat}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {/*<button onClick={() => newOtm(item)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">NewOtm
                                </button>*/}
                                    <button onClick={() => viewItem(item._id)}
                                            className="text-indigo-600 hover:text-indigo-900 m-1">View
                                    </button>
                                    {/*<button onClick={() => editItem(item)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">Edit
                                </button>
                                <button onClick={() => deleteItem(item._id)}
                                        className="text-red-600 hover:text-red-900 m-1">Delete
                                </button>*/}
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