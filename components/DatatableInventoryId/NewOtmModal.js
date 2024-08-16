import React, { useState, useRef } from 'react';
import { uploadFile } from '@/firebase/config';
import config from '@/config';
import { parseCookies } from 'nookies';
import Webcam from 'react-webcam';
import { v4 } from 'uuid';

const NewOtmModal = ({ isOpen, onClose, item, fetchHistoryData }) => {
    const [problema, setProblema] = useState('');
    const [images, setImages] = useState([]); // Save multiple image URLs
    const [visible, setVisible] = useState(true);
    const [capturing, setCapturing] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false); // State to control camera visibility

    const webcamRef = useRef(null);

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

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const blob = await (await fetch(imageSrc)).blob();
        const file = new File([blob], `${v4()}.jpg`, { type: 'image/jpeg' });
        const result = await uploadFile(file);
        setImages((prevImages) => [...prevImages, result]); // Add new image URL to the array
    };

    const addotm = async (e) => {
        e.preventDefault();

        try {
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
                    images: images, // Send the array of image URLs
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

    const handleOpenCamera = () => {
        setCameraOpen(true);
    };

    const handleCloseCamera = () => {
        setCameraOpen(false);
        setCapturing(false);
    };

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
                    {/* Firebase storage images */}
                    <div className="mb-4">
                        <label htmlFor="images">
                            <b>Images</b>
                        </label>
                        <div className="mb-4">
                            {cameraOpen ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-64 border rounded mb-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={capture}
                                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mr-2"
                                    >
                                        Capture Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseCamera}
                                        className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
                                    >
                                        Close Camera
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleOpenCamera}
                                    className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                >
                                    Open Camera
                                </button>
                            )}
                        </div>
                        <div className="mb-4">
                            <label>Captured Images:</label>
                            <div className="flex flex-wrap gap-4">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Captured ${index + 1}`}
                                        className="w-32 h-32 border rounded"
                                    />
                                ))}
                            </div>
                        </div>
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
