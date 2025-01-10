import React from 'react';
import QRCode from 'react-qr-code';

const QRPass = ({ ssid, password, securityType }) => {
  // Formateamos el string del QR con los datos de la red
  const qrData = `WIFI:T:${securityType};S:${ssid};P:${password};;`;

  return (
    <div>
      <h3>Comparte tu contraseña Wi-Fi</h3>
      <QRCode value={qrData} size={256} />
      <p>Escanea este QR para conectarte a la red: {ssid}</p>
    </div>
  );
};

export default QRPass;
