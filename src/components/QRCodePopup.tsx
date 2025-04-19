
import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from '@/components/ui/dialog';

interface QRCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
  code: string;
  userName: string;
  eventName: string;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({
  isOpen,
  onClose,
  qrValue,
  code,
  userName,
  eventName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-purple-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-white">
            {eventName}
          </DialogTitle>
          
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <QRCodeGenerator value={qrValue} size={250} />
          
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-300 mb-2">
              {userName}
            </p>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <p className="text-gray-400 text-sm">Ticket Code</p>
              <p className="text-2xl font-bold tracking-wider">{code}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePopup;
