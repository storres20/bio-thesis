import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

const QrCodeReader = () => {
    const [result, setResult] = useState('');
    const [cameraId, setCameraId] = useState('');
    const [cameras, setCameras] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const qrCodeScannerRef = useRef(null);

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

    const startScanning = () => {
        if (!cameraId) {
            console.error('No camera selected');
            return;
        }

        const qrCodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: 250 },
            false
        );

        qrCodeScannerRef.current = qrCodeScanner;

        qrCodeScanner.render(
            (decodedText, decodedResult) => {
                setResult(decodedText);
                stopScanning(); // Stop scanning after successful result
            },
            (errorMessage) => {
                console.error(`QR Code no longer in front of camera. Error: ${errorMessage}`);
            },
            { facingMode: { exact: cameraId } }
        );

        setIsScanning(true);
    };

    const stopScanning = () => {
        if (qrCodeScannerRef.current) {
            qrCodeScannerRef.current.clear();
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
