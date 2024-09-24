import React,{useEffect, useRef, useState} from 'react';
import { Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css'; // Importa el CSS de Tabulator

const TabulatorP = ({titulo, posts}) => {
    const tableRef = useRef(null); // Referencia para el contenedor de Tabulator
    console.log(posts)
    useEffect(() => {
      // Define la configuración de Tabulator
      const table = new Tabulator(tableRef.current, {
        data:posts,
        layout: 'fitData',
        // data: [
        //   { id: 1, name: "John", age: 29 },
        //   { id: 2, name: "Jane", age: 34 },
        //   { id: 3, name: "Billy", age: 22 },
        // ],
        columns: [
          { title: "ID", field: "id", width: 100 },
          { title: "Name", field: "name", width: 200 },
          { title: "Age", field: "age", width: 100 },
        ],
      });
  
      // Limpiar Tabulator en el desmontaje del componente
      return () => {
        table.destroy();
      };
    }, []);
    
  
    return (
      <div>
        <h1>{titulo}</h1>
        <div ref={tableRef}></div> {/* Contenedor para Tabulator */}
      </div>
    );
  };
  
  export default TabulatorP;

