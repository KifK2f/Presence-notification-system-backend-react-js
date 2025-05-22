import React, { useRef } from 'react';
// import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = () => {
//   const url = "https://web.whatsapp.com"; 
  // const url = "https://172.30.80.1:3000/matricule";
  // const url = "http://192.168.1.70:3000/matricule";
  const url = "http://192.168.0.109:3000/matricule";
  const qrRef = useRef(null); // Pour référencer le QR Code

  // Fonction pour télécharger l'image du QR Code
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const imageURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "MonQRCode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', background: '#fff9f2' }}>
      <h1>Scannez moi</h1>
      <div ref={qrRef}>
        {/* <QRCode value={url} size={256} /> */}
        <QRCodeCanvas value={url} size={256} />

      </div>
      <br />
      <button onClick={downloadQRCode} 
      style={{
          backgroundColor: '#F75C03FF', /* Un joli bleu */
          color: 'white',
          padding: '12px 25px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '17px',
          fontWeight: '600',
          marginTop: '25px', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease, transform 0.2s ease', // La transition sera là, mais pas l'effet de survol
        }}
      >Télécharger le QR Code</button>
    </div>
  );
};

export default QRCodeGenerator;
