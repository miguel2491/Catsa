import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Modal, Button } from "react-bootstrap"; // o cualquier biblioteca de modal que uses

const PDFModal = () => {
  // Estado para manejar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal
  const handleShow = () => setShowModal(true);

  // Función para cerrar el modal
  const handleClose = () => setShowModal(false);

  // Función para generar el PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Agregar contenido al PDF
    doc.text("¡Hola! Este es un PDF generado desde React.", 20, 30);
    doc.text("Este PDF se genera cuando haces clic en el botón.", 20, 40);

    // Guardar el archivo PDF con el nombre "mi_archivo.pdf"
    doc.save("mi_archivo.pdf");
    
    // Cerrar el modal después de generar el PDF
    handleClose();
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button variant="primary" onClick={handleShow}>
        Abrir Modal
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Generar PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Quieres generar un PDF con el contenido especificado?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={generatePDF}>
            Generar PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PDFModal;
