import React, { useEffect, useRef, useState, forwardRef } from 'react';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { ReactTabulator } from 'react-tabulator';
import * as XLSX from 'xlsx';

const TabulatorP = ({ titulo, posts }) => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const columnas = titulo === "PreCotizaciones"
    ? [
        { title: "Planta", field: "Planta", width: 100, headerFilter: "input" },
        { title: "No. Pre Cotización", field: "IdCotizacion", width: 100, headerFilter: "input" },
        { title: "Estatus", field: "Estatus", width: 100, headerFilter: "input" },
        { title: "Vendedor", field: "Vendedor", width: 200, headerFilter: "input", formatter: (cell) => cell.getValue() || '-' },
        { title: "Cliente", field: "Cliente", width: 100, headerFilter: "input" },
        { title: "Obra", field: "Obra", width: 100, headerFilter: "input" },
        { title: "Dirección", field: "Direccion", width: 100 },
        { title: "Contacto", field: "Contacto", width: 100 },
        { title: "Creo", field: "Creo", width: 200 },
        { title: "Actualizo", field: "Actualizo", width: 100, formatter: (cell) => cell.getValue() || '-' },
        { title: "Motivo", field: "Motivo", width: 300, formatter: (cell) => cell.getValue() || '-' },
        { title: "Observaciones", field: "Observaciones", width: 300, formatter: (cell) => cell.getValue() || '-' },
      ]
    : [
        { title: "Planta", field: "Planta", width: 100, headerFilter: "input" },
        { title: "No. Cotización", field: "IdCotizacion", width: 100, headerFilter: "input" },
        { title: "Descargar", field: "IdCotizacion", width: 50 },
        { title: "Estatus", field: "Estatus", width: 100, headerFilter: "input" },
        { title: "Vendedor", field: "Vendedor", width: 200, headerFilter: "input" },
        { title: "Cliente", field: "Cliente", width: 100, headerFilter: "input" },
        { title: "Obra", field: "Obra", width: 100, headerFilter: "input" },
        { title: "Dirección", field: "Direccion", width: 100 },
        { title: "Contacto", field: "Contacto", width: 100 },
        { title: "Fin Vigencia", field: "FinVigencia", width: 100 },
        { title: "Seguimiento", field: "IdCotizacion", width: 100 },
        { title: "Creo", field: "Creo", width: 100, headerFilter: "input" },
        { title: "Actualizo", field: "Estatus", width: 100 },
        { title: "Motivo", field: "Motivo", width: 100 },
        { title: "Observación", field: "Observaciones", width: 300 }
      ];

  useEffect(() => {
    setTotalRecords(posts.length);
    setData(posts);
  }, [posts]);

  const options = {
    layout: 'fitData',
    pagination: "local",
    paginationSize: 25,
  };

  const handleDownload = () => {
    console.log(data);
    const ws = XLSX.utils.json_to_sheet(data); // Convertir a hoja de Excel
    const wb = XLSX.utils.book_new(); // Crear un nuevo libro
    XLSX.utils.book_append_sheet(wb, ws, "Datos"); // Añadir la hoja al libro

    // Generar el archivo Excel
    XLSX.writeFile(wb, titulo+".xlsx");
  };

  return (
    <div>
      <br />
      <button onClick={handleDownload}>Descargar</button>
      <ReactTabulator
        columns={columnas}
        data={data}
        options={options}
      />
      <p>Total: {totalRecords}</p>
    </div>
  );
};

export default TabulatorP;
