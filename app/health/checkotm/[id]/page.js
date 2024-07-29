'use client'

import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import {parseCookies} from "nookies";

import config from '@/config'; //for apiUrl

const Checkotm = ({ params }) => {

    const { id } = params;

    const router = useRouter();

    /* useState initialization */
    const [items, setItems] = useState() // inventario del equipo
    const [resp, setResp] = useState() // catch ERROR response from backend

    const [solucion, setSolucion] = useState(""); // Initialize solucion with empty string

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch(`${config.apiUrl}/historials/${id}`)
            .then(response => {
                if (!response.ok) {
                    setItems('')
                    setResp(response)
                    alert('Codigo patrimonial no existe. Intente denuevo')
                    throw Error('Error fetching items')
                }
                return response.json()
            })
            .then(data => {
                setItems(data)
                //console.log(data)
            })
            .catch(error => {
                console.error('Error fetching items:', error)
            });
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

    /* Get "user_id" from cookies*/
    const cookies = parseCookies();
    const users_id = cookies.users_id
    //const hospitals_id = cookies.hospitals_id


    const closeotm = (e) => {
        e.preventDefault()

        fetch(`${config.apiUrl}/historials/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ solucion: solucion, fecha_close: dateTimePeru, usersid_close: users_id, estado: 'close' }),
        })
            .then(response => response.json())
            .then(data => {
                /*setItems(items.map(item =>
                    item._id === editItemId ? data : item
                ));*/
                setItems(data)
                /*console.log(items)
                console.log(data)*/
            })
            .catch(error => console.error('Error updating item:', error));

        router.push('/health/otm')
    }

    return (
        <div>
            <h1>This is checkOtm Page</h1>

            {items && (resp !== 400) &&
                <form onSubmit={closeotm}>
                    <div>
                        <label htmlFor="">Codigo Patrimonial</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.inventories_id.codepat}
                               disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="">Name</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.inventories_id.name}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Brand</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.inventories_id.brand}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Model</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.inventories_id.model}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Serie</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.inventories_id.serie}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Location</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.inventories_id.location}
                               disabled/>
                    </div>


                    <div>
                        <label htmlFor="">Fecha de Cierre</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={datePeru}
                               disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="">Servicio Hospitalario</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.servicio}
                               disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="">Descripcion del Problema</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={items.problema}
                               disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="">Descripcion de Solucion</label>
                        <input type="text" className="px-3 py-2 border rounded"
                               onChange={(e) => setSolucion(e.target.value)}
                               value={solucion}
                               required
                        />
                    </div>

                    <button className="bg-blue-500 text-white p-2 rounded">Close OTM</button>
                </form>
            }

        </div>
    );
};

export default Checkotm;