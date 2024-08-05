import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

import config from '@/config'; //for apiUrl

import {useEffect, useState} from 'react';
import {parseCookies} from "nookies";

const DataTableComponent = ({ id = [] }) => {

    const [item, setItem] = useState(null);
    const [historyData, setHistoryData] = useState(null);

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
    /*******************/

    /* Get "user_id" from cookies*/
    const cookies = parseCookies();
    const users_id = cookies.users_id
    const hospitals_id = cookies.hospitals_id
    /*******************/


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
        timeZone: 'America/Lima'
    });

    const dateTimePeru = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Lima'
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
                setItem(data)
                closeNewotmModal()
                //router.push('/health/otm')
            })
            .catch(error => {
                console.error('Error adding OTM:', error)
            });
    }

    /* ********* */

    // Check if the details and historyData have been set. If not, still loading.
    if (!item || !historyData) return <div>Loading...</div>;

    return (
    // The table structure goes here
    // Example:
        <div>

            {/* NEW OTM modal */}
            {newotmModalOpen && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-y-auto">
                    <div
                        className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2 max-h-screen overflow-y-auto mt-4 md:mt-12">
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

            <button onClick={() => newOtm(item)} className="bg-blue-500 text-white p-2 rounded">Add NEWOTM</button>

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