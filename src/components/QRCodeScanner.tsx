import React, { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import { QrReader } from 'react-qr-reader';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  active: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, active }) => {
  const [hasCamera, setHasCamera] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1️⃣ Check for camera access
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  // 2️⃣ Grab the video element when active
  useEffect(() => {
    if (active) {
      setTimeout(() => {
        const video = document
          .getElementById('qr-video')
          ?.querySelector('video') as HTMLVideoElement;
        if (video) {
          videoRef.current = video;
        }
      }, 500);
    }
  }, [active]);

  // 3️⃣ Stop camera manually when inactive
  useEffect(() => {
    if (!active && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [active]);

  const handleScan = (result: any) => {
    if (result) {
      onScan(result?.text);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="border border-purple-800 rounded-lg p-4 bg-black bg-opacity-50">
      <div className="mb-6">
        <div className="relative">
          <div className="w-full h-64 bg-gray-800 rounded-lg overflow-hidden" id="qr-video">
            {active && (
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                videoStyle={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center">
          <Info size={16} className="text-blue-400 mr-2" />
          <span className="text-sm text-blue-400">
            Scan the Ticket QR for Attendance
          </span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
