import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { ReactTabulator } from 'react-tabulator';
import * as XLSX from 'xlsx';

const TabEdi = ({ titulo }) => {
    const [data, setData] = useState([]);

    const columnas = titulo === "PreCotizaciones"
        ? [
            { title: "Planta", field: "Planta", width: 100, headerFilter: "input" },
            { title: "Vendedor", field: "Vendedor", width: 200, headerFilter: "input", formatter: (cell) => cell.getValue() || '-' },
        ]
        : [
            { title: "Planta", field: "Planta", width: 100, headerFilter: "input", editor: "input" },
            { title: "No. Cotización", field: "IdCotizacion", width: 100, headerFilter: "input", editor: "input",
                editorParams: {
                    minLength: 4,
                    maxLength: 6,
                },
                editorValidator: (value) => {
                    if (value.length < 2) {
                        return "El número de cotización debe tener al menos 2 caracteres";
                    }
                    return true;
                }
            },
            { title: "Descargar", field: "IdCotizacion", width: 50 },
        ];

    useEffect(() => {
        const posts = [
            { Planta: "Pue1", IdCotizacion: 1 },
            { Planta: "Pue1", IdCotizacion: 2 }
        ];
        setData(posts);
    }, []);

    const options = {
        layout: 'fitData',
        pagination: "local",
        paginationSize: 25,
        cellEdited: (cell) => { // Evento cuando una celda es editada
            const updatedData = cell.getRow().getData();
            setData(prevData => 
                prevData.map(row => row.IdCotizacion === updatedData.IdCotizacion ? updatedData : row)
            );
            console.log("Celda editada:", updatedData);
        },
    };

    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet(data); // Convertir a hoja de Excel
        const wb = XLSX.utils.book_new(); // Crear un nuevo libro
        XLSX.utils.book_append_sheet(wb, ws, "Datos"); // Añadir la hoja al libro

        // Generar el archivo Excel
        XLSX.writeFile(wb, `${titulo}.xlsx`);
    };

    return (
        <div>
            <br />
            <button onClick={handleDownload}>Descargar</button>
            <ReactTabulator
                columns={columnas}
                options={options}
                data={data}
            />
            <p>Total: {data.length}</p> {/* Muestra el total dinámicamente */}
        </div>
    );
};

export default TabEdi;
