import React,{useEffect, useRef, useState} from 'react';
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';


const TabulatorP = ({titulo, posts}) => {
    const [data, setData] = useState([]);
    var columnas = [];
    if(titulo == "PreCotizaciones"){
      columnas = [
        { title: "Planta", field: "Planta", width: 100, headerFilter:"input" },
        { title: "No. Cotización", field: "IdCotizacion", width: 100, headerFilter:"input" },
        { title: "Descargar", field: "IdCotizacion", width: 50 },
        { title: "Estatus", field: "Estatus", width: 100, headerFilter:"input" },
        { title: "Vendedor", field: "Vendedor", width: 200, headerFilter:"input" },
        { title: "Cliente", field: "Cliente", width: 100, headerFilter:"input" },
      ];
    }else{
      columnas = [
        { title: "Planta", field: "Planta", width: 100, headerFilter:"input" },
        { title: "No. Cotización", field: "IdCotizacion", width: 100, headerFilter:"input" },
        { title: "Descargar", field: "IdCotizacion", width: 50 },
        { title: "Estatus", field: "Estatus", width: 100, headerFilter:"input" },
        { title: "Vendedor", field: "Vendedor", width: 200, headerFilter:"input" },
        { title: "Cliente", field: "Cliente", width: 100, headerFilter:"input" },
        { title: "Obra", field: "Obra", width: 100, headerFilter:"input" },
        { title: "Dirección", field: "Direccion", width: 100 },
        { title: "Contacto", field: "Contacto", width: 100 },
        { title: "Fin Vigencia", field: "FinVigencia", width: 100 },
        { title: "Seguimiento", field: "IdCotizacion", width: 100 },
        { title: "Creo", field: "Creo", width: 100, headerFilter:"input" },
        { title: "Actualizo", field: "Estatus", width: 100 },
        { title: "Motivo", field: "Motivo", width: 100 },
        { title: "Observación", field: "Observaciones", width: 300 }
      ];
    }
    
    
    useEffect(()=>{
      const fetchData = () => {
        setData(posts);
      };
      fetchData();
    },[]);

    useEffect(() =>{
      console.log(posts);
      // if(table && posts.length)
      // {
      //   table.setData(posts);
      // }
    },[posts]);
    
    const handleDownloadCSV = () => {
      if (table) {
        table.download("csv", "datos.csv");
      }
    };
  
    const handleDownloadPDF = () => {
      if (table) {
        table.download("pdf", "datos.pdf");
      }
    };
    const options = {
      pagination:"local",
      paginationSize:25
    }
    return (
      <div>
        <br />
        <ReactTabulator 
          columns={columnas}
          layout={"fitData"}
          data={posts}
          options={options}
        />
      </div>
    );
  };
  
  export default TabulatorP;

