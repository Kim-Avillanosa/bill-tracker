import React from "react";
import QRCode from "react-qr-code";
interface Props {
  value: string;
}
const QRCodeComponent: React.FC<Props> = ({ value }) => {
  return (
    <div>
      <QRCode
        size={100}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={value}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
};

export default QRCodeComponent;
