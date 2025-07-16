// NewOtmModal.js
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

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index)); // Remove image by index
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
    };

    const handleClose = () => {
        setProblema(''); // Clear the problema input
        setImages([]); // Clear images when modal is closed
        if (cameraOpen) {
            handleCloseCamera(); // Close camera if it was open
        }
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 overflow-y-auto">
            <div className="flex min-h-screen items-start justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 mt-10">
                    <button onClick={handleClose} className="float-right text-purple-600 hover:text-purple-800 text-xl font-bold">✖️</button>
                    <form onSubmit={addotm} className="space-y-4">
                        <p className="text-lg font-semibold mb-4">NEW OTM modal</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Codigo Patrimonial</label>
                            <input
                                type="text"
                                value={item.codepat}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={item.name}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <input
                                type="text"
                                value={item.brand}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                                type="text"
                                value={item.model}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Serie</label>
                            <input
                                type="text"
                                value={item.serie}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={item.location}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Solicitud</label>
                            <input
                                type="text"
                                value={dateTimePeru}
                                className="w-full px-3 py-2 border rounded bg-gray-200 text-gray-600"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion del Problema</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                onChange={(e) => setProblema(e.target.value)}
                                value={problema}
                                required
                            />
                        </div>

                        {/* Firebase storage images */}
                        <div>
                            <label className="block font-semibold text-sm mb-2">Images</label>
                            {cameraOpen ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-64 border rounded mb-4"
                                        videoConstraints={{
                                            facingMode: 'environment'
                                        }}
                                    />
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            type="button"
                                            onClick={capture}
                                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        >
                                            Capture Image
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseCamera}
                                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                        >
                                            Close Camera
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleOpenCamera}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
                                >
                                    Open Camera
                                </button>
                            )}

                            <label className="block text-sm font-medium text-gray-700 mb-1">Captured Images:</label>
                            <div className="flex flex-wrap gap-3">
                                {images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Captured ${index + 1}`}
                                            className="w-32 h-32 object-cover border rounded shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit and Finish Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="submit"
                                className={`bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 ${visible ? '' : 'hidden'}`}
                            >
                                Verificate
                            </button>
                            <button
                                type="button"
                                className={`bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 ${visible ? 'hidden' : ''}`}
                                onClick={handleFinish}
                            >
                                Finish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default NewOtmModal;
