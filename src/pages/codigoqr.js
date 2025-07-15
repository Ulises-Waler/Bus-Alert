// codigoqr.js
const QRCode = require('qrcode');
const fs = require('fs');

const url = 'https://dynamic-pony-6c8520.netlify.app';
const filePath = 'qr-dynamic-pony.png';

QRCode.toFile(filePath, url, {
  color: {
    dark: '#000000',  // color del código QR
    light: '#FFFFFF'  // fondo
  }
}, function (err) {
  if (err) throw err;
  console.log(`✅ Código QR guardado como imagen: ${filePath}`);
});
