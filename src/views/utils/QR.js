import React, { useState } from 'react';
import { CFormInput, CContainer, CButton, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilQrCode } from '@coreui/icons';
import ReactQR from 'react-qr-code'; // Usando react-qr-code
import WifiQrCode from './QRPass';

const QR = () => {
    const [text, setText] = useState(''); // Estado para el texto
    const [qrText, setQrText] = useState(''); // Estado para almacenar el texto a convertir en QR

    const handleInputChange = (e) => {
        setText(e.target.value); // Actualiza el texto conforme el usuario escribe
    };

    const generateQR = () => {
        setQrText(text); // Establece el valor del texto para generar el QR
    };

    // Función para descargar el QR como imagen
    const downloadQR = () => {
        const svgElement = document.getElementById('qr-code-svg'); // Obtener el SVG generado
        const svgData = new XMLSerializer().serializeToString(svgElement); // Serializar el SVG a string
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' }); // Convertir el SVG a Blob
        const svgUrl = URL.createObjectURL(svgBlob); // Crear un objeto URL del Blob

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // Convertir el canvas a imagen PNG
            const pngDataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngDataUrl;
            link.download = 'QR_Code.png'; // Nombre del archivo a descargar
            link.click();
        };
        img.src = svgUrl; // Cargar el SVG como imagen
    };

    return (
        <>
            <CContainer fluid>
                <h1>Generador de QR</h1>
                <CRow className='d-flex justify-content-center'>
                    <CCol xs={6} md={8} className="d-flex justify-content-center">
                        <CFormInput
                            type="text"
                            id="Texto"
                            value={text}
                            onChange={handleInputChange} // Cambia el valor del estado al escribir
                            placeholder="Texto Aquí"
                            aria-describedby="Catsa"
                        />
                    </CCol>
                    <CCol xs={6} md={4}>
                        <CButton color="primary" onClick={generateQR}>
                            Generar QR
                            <CIcon icon={cilQrCode} size="lg" />
                        </CButton>
                    </CCol>
                </CRow>

                {/* Mostrar el QR solo si el texto no está vacío */}
                {qrText && (
                    <CRow className='d-flex justify-content-center'>
                        <CCol xs={12} md={6}>
                            <CCard className="mt-4">
                                <CCardHeader>QR:</CCardHeader>
                                <CCardBody className='d-flex justify-content-center align-items-center'>
                                    {/* Establecer el id para poder acceder al SVG */}
                                    <ReactQR id="qr-code-svg" value={qrText} size={256} />
                                </CCardBody>
                            </CCard>
                            <CRow className="mt-3 d-flex justify-content-center">
                                <CButton color="info" onClick={downloadQR}>
                                    Descargar QR
                                </CButton>
                            </CRow>
                        </CCol>
                    </CRow>
                )}
                <CRow className='mb-4 mt-2'>
                    <h2>QR RED</h2>
                    <WifiQrCode 
                        ssid='CATSA_WIRELESS'
                        password='C4TS44202.'
                        securityType='WPA2'
                    />
                </CRow>
            </CContainer>
        </>
    );
};

export default QR;
