
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 128, 
  className = '' 
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="p-3 bg-white rounded-lg">
        <QRCodeSVG
          value={value}
          size={size}
          level="H" // High error correction capability
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
