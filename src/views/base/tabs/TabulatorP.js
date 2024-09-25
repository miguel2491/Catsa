import React, { useEffect, useRef, useState } from 'react';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { ReactTabulator } from 'react-tabulator';

// Componente de contenedor para ReactTabulator
const TabulatorContainer = React.forwardRef((props, ref) => (
  <ReactTabulator ref={ref} {...props} />
));

const TabulatorP = ({ titulo, posts }) => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const tableRef = useRef(null);

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
    const table = tableRef.current?.getTable();
    if (table) {
      table.download("csv", "data.csv");
    } else {
      console.error("La tabla no está disponible.");
    }
  };

  return (
    <div>
      <br />
      <button onClick={handleDownload}>Descargar CSV</button>
      <TabulatorContainer
        ref={tableRef}
        columns={columnas}
        data={data}
        options={options}
      />
      <p>Total: {totalRecords}</p>
    </div>
  );
};

export default TabulatorP;
