import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrCodeReader = () => {
    const [result, setResult] = useState('');
    const [cameraId, setCameraId] = useState('');
    const [cameras, setCameras] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanner, setScanner] = useState(null);
    const [cameraSelected, setCameraSelected] = useState(false);

    useEffect(() => {
        const fetchCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                setCameras(devices);
                if (devices.length > 0) {
                    setCameraId(devices[0].id);
                }
            } catch (error) {
                console.error('Error fetching cameras:', error);
            }
        };

        fetchCameras();
    }, []);

    useEffect(() => {
        if (scanner && cameraId) {
            scanner.stop();
            scanner.start({ facingMode: { exact: cameraId } }, { fps: 10, qrbox: 250 }, (decodedText) => {
                setResult(decodedText);
                stopScanning(); // Stop scanning after successful result
            }).catch((error) => {
                console.error('Error starting scanner:', error);
            });
        }
    }, [cameraId]);

    const startScanning = () => {
        if (!cameraId) {
            console.error('No camera selected');
            return;
        }

        const newScanner = new Html5Qrcode("reader");
        setScanner(newScanner);

        newScanner.start(
            { facingMode: { exact: cameraId } },
            { fps: 10, qrbox: 250 },
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
        setCameraSelected(true);
    };

    const stopScanning = () => {
        if (scanner) {
            scanner.stop().catch((error) => {
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
            <div id="reader" style={{ width: '500px' }}></div>
            <div>
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </div>
    );
};

export default QrCodeReader;
