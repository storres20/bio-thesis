'use client'

import {useState} from "react";

const Newotm = () => {

    const [codepat, setCodepat] = useState()
    const [items, setItems] = useState()
    const [resp, setResp] = useState() // catch ERROR response from backend
    const [datetime, setDatetime] = useState()

    const [servicio, setServicio] = useState()
    const [problema, setProblema] = useState()

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

    const dateTimePeru = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Lima'
    });

    console.log(dateTimePeru);

    const addotm = (e) => {
      e.preventDefault()


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
                               value={dateTimePeru}
                               disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="">Servicio Hospitalario</label>
                        <input type="text" className="px-3 py-2 border rounded"
                               onChange={(e) => setServicio(e.target.value)}
                               value={servicio}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Descripcion del Problema</label>
                        <input type="text" className="px-3 py-2 border rounded"
                               onChange={(e) => setProblema(e.target.value)}
                               value={problema}
                        />
                    </div>

                    <button className="bg-blue-500 text-white p-2 rounded">Add OTM</button>
                </form>
            }

        </div>
    );
};

export default Newotm;