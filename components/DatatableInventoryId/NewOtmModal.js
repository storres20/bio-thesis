import React, { useState } from 'react';
import { uploadFile } from '@/firebase/config';
import config from '@/config'; // for apiUrl
import { parseCookies } from 'nookies';

const NewOtmModal = ({ isOpen, onClose, item, fetchHistoryData }) => {
    const [problema, setProblema] = useState('');
    const [file, setFile] = useState(null); // setFile for Firebase
    const [preview, setPreview] = useState(''); // setPreview for image preview
    const [image, setImage] = useState(''); // save image URL
    const [visible, setVisible] = useState(true);

    const cookies = parseCookies();
    const users_id = cookies.users_id;
    const hospitals_id = cookies.hospitals_id;

    const dateTimePeru = new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Lima',
        hour12: false,
    });

    const addotm = async (e) => {
        e.preventDefault();

        try {
            const result = await uploadFile(file);
            setImage(result);
            alert('All fields are correct');
            setVisible(false);
        } catch (error) {
            alert(error);
        }
    };

    const handleFinish = async () => {
        onClose(); // Close the modal
        setProblema(''); // Clear the problema input

        try {
            const response = await fetch(`${config.apiUrl}/historials/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hospitals_id: hospitals_id,
                    inventories_id: item._id,
                    problema: problema,
                    fecha_open: dateTimePeru,
                    estado: 'open',
                    usersid_open: users_id,
                    image: image,
                }),
            });

            if (!response.ok) {
                alert('Error al agregar OTM. Intente de nuevo');
                throw new Error('Error adding OTM');
            }

            // Refresh the history data after adding new OTM
            fetchHistoryData();

            setVisible(true); // Reset visibility for modal
        } catch (error) {
            console.error('Error adding OTM:', error);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview('');
        }
    };

    // Modified onClose function
    const handleClose = () => {
        setProblema(''); // Clear the problema input
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-y-auto">
            <div className="p-8 bg-white rounded-lg shadow-lg m-4 sm:m-8 lg:w-1/2 max-h-screen overflow-y-auto mt-4 md:mt-12">
                <button onClick={handleClose} className="float-right text-gray-500 hover:text-gray-700">✖️</button>
                <form onSubmit={addotm}>
                    <p>NEW OTM modal</p>
                    <div className="mb-4">
                        <label>Codigo Patrimonial</label>
                        <input
                            type="text"
                            value={item.codepat}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label>Name</label>
                        <input
                            type="text"
                            value={item.name}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label>Brand</label>
                        <input
                            type="text"
                            value={item.brand}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label>Model</label>
                        <input
                            type="text"
                            value={item.model}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label>Serie</label>
                        <input
                            type="text"
                            value={item.serie}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label>Location</label>
                        <input
                            type="text"
                            value={item.location}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label>Fecha de Solicitud</label>
                        <input
                            type="text"
                            value={dateTimePeru}
                            className="px-3 py-2 border rounded bg-gray-300"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Descripcion del Problema</label>
                        <input
                            type="text"
                            className="px-3 py-2 border rounded"
                            onChange={(e) => setProblema(e.target.value)}
                            value={problema}
                            required
                        />
                    </div>
                    {/* Firebase storage image */}
                    <div className="mb-4">
                        <label htmlFor="image">
                            <b>Image</b>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={handleFileChange}
                                required
                            />
                        </label>
                    </div>
                    {/*************************/}
                    <button
                        type="submit"
                        className={`bg-green-500 text-white py-2 rounded hover:bg-green-600 ${visible ? '' : 'hidden'}`}
                    >
                        Verificate
                    </button>
                    <button
                        type="button"
                        className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${visible ? 'hidden' : ''}`}
                        onClick={handleFinish}
                    >
                        Finish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewOtmModal;
