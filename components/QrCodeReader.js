import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrCodeReader = () => {
    const [result, setResult] = useState('');
    const [cameraId, setCameraId] = useState('');
    const [cameras, setCameras] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [videoElement, setVideoElement] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const scannerRef = useRef(null);

    const fileInputRef = useRef(null); // Ref for file input

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                setCameras(devices);
                if (devices.length > 0) {
                    setCameraId(devices[0].id); // Default to the first camera
                }
            } catch (error) {
                console.error('Error fetching cameras:', error);
            }
        };

        fetchCameras();
    }, []);

    const startScanning = () => {
        if (!cameraId) {
            console.error('No camera selected');
            return;
        }

        const config = {
            fps: 10,
            qrbox: 250,
        };

        //setImagePreview(null)
        setIsPreviewVisible(false)

        const newScanner = new Html5Qrcode("reader");
        scannerRef.current = newScanner;

        newScanner.start(
            { facingMode: 'environment' }, // Default to the back camera
            config,
            (decodedText) => {
                setResult(decodedText);
                stopScanning(); // Stop scanning after successful result

                //setImagePreview(null) // hide image preview button
                //setIsPreviewVisible(true)
                fileInputRef.current.value = ''; // Clear the file input value
            },
            (errorMessage) => {
                console.error(`QR Code no longer in front of camera. Error: ${errorMessage}`);
            }
        ).then(() => {
            if (videoElement) {
                videoElement.style.transform = 'scaleX(-1)'; // Apply mirror effect
            }
        }).catch((error) => {
            console.error('Error starting scanner:', error);
        });

        setIsScanning(true);
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                console.log('Scanner stopped');
                setIsScanning(false);

                // Clean up video element if necessary
                if (videoElement) {
                    const tracks = videoElement.srcObject?.getTracks();
                    if (tracks) {
                        tracks.forEach(track => track.stop());
                    }
                }
                scannerRef.current = null; // Clear the reference
            } catch (error) {
                console.error('Error stopping scanner:', error);
            }
        } else {
            setIsScanning(false);
        }
    };

    const handleImageUpload = (event) => {
        setResult(''); // Clear the result before starting a new scan
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl); // Set image preview URL
            setIsPreviewVisible(false) // Show preview image
            const newScanner = new Html5Qrcode("reader");
            scannerRef.current = newScanner;

            newScanner.scanFile(file, true)
                .then(decodedText => {
                    setResult(decodedText);
                    stopScanning(); // Stop scanning after successful result
                })
                .catch(err => {
                    console.error('Error decoding image:', err);
                    setResult('NO QR CODE DETECTED');
                });
        }
    };

    const togglePreview = () => {
        setIsPreviewVisible(!isPreviewVisible);
    };

    useEffect(() => {
        // Watch for changes to the video element and apply mirror effect
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.tagName === 'VIDEO') {
                    setVideoElement(mutation.target);
                }
            });
        });

        const readerElement = document.getElementById('reader');
        observer.observe(readerElement, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="cameraSelect" className="block mb-2 font-medium text-gray-700">Select Camera:</label>
                <select
                    id="cameraSelect"
                    value={cameraId}
                    onChange={(e) => setCameraId(e.target.value)}
                    disabled={isScanning}
                    className="border border-gray-300 rounded p-2"
                >
                    {cameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                            {camera.label || 'Camera ' + camera.id}
                        </option>
                    ))}
                </select>
                <button
                    onClick={isScanning ? stopScanning : startScanning}
                    className={`mt-2 px-4 py-2 rounded text-white ${isScanning ? 'bg-red-500' : 'bg-blue-500'} hover:${isScanning ? 'bg-red-600' : 'bg-blue-600'}`}
                >
                    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </button>
            </div>
            <div>
                <label htmlFor="imageUpload" className="block mb-2 font-medium text-gray-700">Attach Image:</label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isScanning}
                    className="border border-gray-300 rounded p-2"
                    ref={fileInputRef} // Attach ref
                />
                {imagePreview && (
                    <button
                        onClick={togglePreview}
                        className={`px-4 py-2 rounded text-white ${isPreviewVisible ? 'bg-green-500' : 'bg-gray-500'} hover:${isPreviewVisible ? 'bg-gray-600' : 'bg-green-600'}`}
                    >
                        {isPreviewVisible ? 'Show Preview' : 'Hide Preview'}
                    </button>
                )}
            </div>

            <div id="reader" className={`w-auto max-w-lg mx-auto relative ${isPreviewVisible ? 'hidden' : ''}`}></div>
            <div>
                <h2 className="text-xl font-semibold">Result:</h2>
                <p className="mt-2 text-lg">{result}</p>
            </div>
        </div>
    );
};

export default QrCodeReader;
