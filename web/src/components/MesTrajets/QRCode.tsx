import React from 'react';
// Import the named export instead of the default export
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  data: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ data }) => (
  <div className="mt-2">
    <QRCodeSVG value={data} />
  </div>
);

export default QRCodeComponent;