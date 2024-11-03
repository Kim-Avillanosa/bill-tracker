import React from "react";
import QRCode from "react-qr-code";
interface Props {
  value: string;
}
const QRCodeComponent: React.FC<Props> = ({ value }) => {
  return <QRCode size={150} value={value} viewBox={`300 300 300 300`} />;
};

export default QRCodeComponent;
