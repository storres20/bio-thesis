'use client'

import {useState} from "react";
import { useRouter } from 'next/navigation';
import {parseCookies} from "nookies";

const Newotm = () => {
    const router = useRouter();

    /* useState initialization */
    const [codepat, setCodepat] = useState() // codigo patrimonial del equipo
    const [items, setItems] = useState() // inventario del equipo
    const [resp, setResp] = useState() // catch ERROR response from backend

    const [servicio, setServicio] = useState() // servicio hospitalario
    const [problema, setProblema] = useState() // descripcion del problema


    const checkButton = (e) => {
        e.preventDefault()

        fetch(`http://localhost:3001/api/v1/inventories/codepat/${codepat}`)
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
                console.log(data)
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
    const hospitals_id = cookies.hospitals_id


    const addotm = (e) => {
        e.preventDefault()

        fetch('http://localhost:3001/api/v1/historials/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hospitals_id: hospitals_id,
                        inventories_id: items._id,
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
                        setOtm(data)
                        console.log(data)
                    })
                    .catch(error => {
                        console.error('Error adding OTM:', error)
                    });

        router.push('/otm')
    }

    return (
        <div>
            <h1>This is newOtm Page</h1>

            <form onSubmit={checkButton}>
                <label htmlFor="">Codigo Patrimonial</label>
                <input type="text" className="px-3 py-2 border rounded"
                       onChange={(e) => setCodepat(e.target.value)}
                       value={codepat}
                       required
                />
                <button className="bg-blue-500 text-white p-2 rounded">Check</button>
            </form>

            {items && (resp !== 400) &&
                <form onSubmit={addotm}>
                    <div>
                        <label htmlFor="">Name</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300" value={items.name}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Brand</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300" value={items.brand}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Model</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300" value={items.model}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Serie</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300" value={items.serie}
                               disabled/>
                    </div>
                    <div>
                        <label htmlFor="">Location</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300" value={items.location}
                               disabled/>
                    </div>


                    <div>
                        <label htmlFor="">Fecha de Solicitud</label>
                        <input type="text" className="px-3 py-2 border rounded bg-gray-300"
                               value={datePeru}
                               disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="">Servicio Hospitalario</label>
                        <input type="text" className="px-3 py-2 border rounded"
                               onChange={(e) => setServicio(e.target.value)}
                               value={servicio}
                               required
                        />
                    </div>
                    <div>
                        <label htmlFor="">Descripcion del Problema</label>
                        <input type="text" className="px-3 py-2 border rounded"
                               onChange={(e) => setProblema(e.target.value)}
                               value={problema}
                               required
                        />
                    </div>

                    <button className="bg-blue-500 text-white p-2 rounded">Add OTM</button>
                </form>
            }

        </div>
    );
};

export default Newotm;