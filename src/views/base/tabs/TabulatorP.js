import React, { useEffect, useRef, useState, forwardRef } from 'react';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { ReactTabulator, reactFormatter } from 'react-tabulator';
import * as XLSX from 'xlsx';

function SimpleButton(props) {
  const rowData = props.cell._cell.row.data;
  const cellValue = props.cell._cell.value || "Edit | Show";
  return <button onClick={() => alert(rowData.name)}>{cellValue}</button>;
}
function CBvo(props) {
  const rowData = props.cell._cell.row.data;
  const cellValue = props.cell._cell.value || false;
  return <input type='checkbox' checked={cellValue}></input>;
}
function CBpr(props) {
  const rowData = props.cell._cell.row.data;
  const cellValue = props.cell._cell.value || false;
  return <input type='checkbox' checked={cellValue}></input>;
}
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
    : titulo == "PreCierre" ? 
    [
      { title: "Planta", field: "Planta", width: 100, headerFilter: "input" },
      { title: "Material", field: "Material", width: 200, headerFilter: "input" },
      { title: "FechaInv", field: "FechaInv", width: 200},
      { title: "Usuario", field: "Usuario", width: 100},
      { title: "Comentario", field: "Comentario", width: 200 },
      { title: "InvInicial", field: "InvInicial", width: 100},
      { title: "Compras", field: "Compras", width: 100 },
      { title: "InvFinal", field: "InvFinal", width: 100 },
      { title: "Consumos", field: "Consumos", width: 100 },
      { title: "ConsumosReal", field: "ConsumosReal", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "TotalInv", field: "TotalInv", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "CantMerma", field: "CantMerma", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "PorCentMerma", field: "PorCentMerma", width: 100, formatter: (cell) => cell.getValue() || '-' },
    ]
    : titulo == "Pedidos" ? 
    [
      { title: "Programar", field: "activo", width:100, align:"center", 
        formatter:reactFormatter(
          <CBpr 
            onClick={activo => {
              this.setState({ selectedName: activo });
            }}
          />
        )
      },
      { title: "VistoBueno", field: "VistoBueno", width:100, align:"center", 
        formatter:reactFormatter(
          <CBvo 
            onSelect={VistoBueno => {
              this.setState({ selectedName: VistoBueno });
              alert(VistoBueno);
            }}
          />
        )
      },
      { title: "Programar", field: "IdPedido", width: 100 },
      { title: "No. Pedido", field: "IdPedido", width: 100, headerFilter: "input"},
      { title: "Planta", field: "PlantaEnvio", width: 100},
      { title: "Asesor", field: "Asesor", width: 300 },
      { title: "Cliente", field: "Cliente", width: 300},
      { title: "Obra", field: "Obra", width: 300 },
      { title: "Dirección", field: "Direccion", width: 300 },
      { title: "Producto", field: "Producto", width: 200 },
      { title: "M3", field: "M3", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Bomba", field: "CodBomba", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Fecha Entrega", field: "FechaHoraPedido", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Hora Llegada Obra", field: "PorCentMerma", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Hr Salida", field: "InvFinal", width: 100 },
      { title: "T. Recorrido", field: "InvFinal", width: 100 },
      { title: "Tiempo Real Aprox.", field: "TiempoReal", width: 100 },
      { title: "Espaciado", field: "Espaciado", width: 100 },
      { title: "Status", field: "InvFinal", width: 100 },
      { title: "Desc Status", field: "InvFinal", width: 100 },
      { title: "Precio Producto", field: "PrecioProducto", width: 100 },
      { title: "Precio Bombeo", field: "PrecioBomba", width: 100 },
      { title: "Precio Extra", field: "PrecioExtra", width: 100 },
      { title: "Importe Total Pagar", field: "Total", width: 100 },
      { title: "Saldo Anticipo", field: "InvFinal", width: 100 },
      { title: "Margen Bruto Real", field: "MB", width: 100 },
      { title: "Forma Pago", field: "Pago", width: 100 },
      { title: "Observaciones", field: "Observaciones", width: 100 },
      { title: " ", field: "InvFinal", width: 100 },
      { title: "Creo", field: "UsuarioCreo", width: 100 },
      { title: "Actualizo", field: "UsuarioActualizacion", width: 100 },
      { title: "Documentos", field: "InvFinal", width: 100 },
      { title: "Actualizo Vo. Bo.", field: "UsuarioActualizo", width: 100 },
      { title: " - ", field: "IdPedido", width: 100, align:"center", editor:"input",
        formatter: reactFormatter(
          <SimpleButton
            onSelect={name => {
              this.setState({ selectedName: name });
              alert(name);
            }}
          />)
       },
    ]:
    titulo == "RCP" ? 
    [
      
      { title: "Planta", field: "Planta", width: 100 },
      { title: "Producto", field: "Producto", width: 100, headerFilter: "input"},
      { title: "Descripcion", field: "Descripcion", width: 100},
      { title: "Familia", field: "Familia", width: 100 },
      { title: "Resistencia", field: "Resistencia", width: 100},
      { title: "Edad", field: "Edad", width: 100 },
      { title: "TMA", field: "TMA", width: 100 },
      { title: "Revenimiento", field: "Revenimiento", width: 100 },
      { title: "Colocacion", field: "Colocacion", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Variante", field: "Variante", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "CPC", field: "CPC", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "H2O", field: "H2O", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Gravas", field: "GRAVAS", width: 100 },
      { title: "Arenas", field: "ARENAS", width: 100 },
      { title: "Aditivos", field: "ADITIVOS", width: 100 },
      { title: "Insumos", field: "INSUMOS", width: 100, formatter: (cell) => cell.getValue() || '-' },
      { title: "Costo", field: "COSTO", width: 100 },
      { title: "-", field: "FlgCol", width: 100 },
    ]:
   [
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
    layout: 'fitColumns',
    movableColumns:true,
    renderHorizontal:"virtual",
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
      <button onClick={handleDownload} className='bg-primary btn-md'>Descargar</button>
      <br/>
      <div style={{  overflowX: 'auto' }} className='mt-4'>
        <ReactTabulator
          columns={columnas}
          data={data}
          options={options}
          layout="fitData"
        />
      </div>
      <p>Total: {totalRecords}</p>
    </div>
  );
};

export default TabulatorP;
