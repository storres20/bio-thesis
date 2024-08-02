import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrCodeReader = () => {
    const [result, setResult] = useState('');
    const [cameraId, setCameraId] = useState('');
    const [cameras, setCameras] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);

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

        const newScanner = new Html5Qrcode("reader");
        scannerRef.current = newScanner;

        newScanner.start(
            { facingMode: 'environment' }, // Default to the back camera
            config,
            (decodedText) => {
                setResult(decodedText);
                stopScanning(); // Stop scanning after successful result
            },
            (errorMessage) => {
                console.error(`QR Code no longer in front of camera. Error: ${errorMessage}`);
            }
        ).catch((error) => {
            console.error('Error starting scanner:', error);
        });

        setIsScanning(true);
    };

    const stopScanning = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                console.log('Scanner stopped');
            }).catch((error) => {
                console.error('Error stopping scanner:', error);
            });
        }
        setIsScanning(false);
    };

    return (
        <div>
            <div>
                <label htmlFor="cameraSelect">Select Camera:</label>
                <select
                    id="cameraSelect"
                    value={cameraId}
                    onChange={(e) => setCameraId(e.target.value)}
                    disabled={isScanning}
                >
                    {cameras.map((camera) => (
                        <option key={camera.id} value={camera.id}>
                            {camera.label || 'Camera ' + camera.id}
                        </option>
                    ))}
                </select>
                <button onClick={isScanning ? stopScanning : startScanning}>
                    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </button>
            </div>
            <div
                id="reader"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    transform: 'scaleX(-1)', // Mirror effect
                    overflow: 'hidden',
                }}
            ></div>
            <div>
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </div>
    );
};

export default QrCodeReader;
