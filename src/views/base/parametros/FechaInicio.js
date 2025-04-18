import React,{useState} from 'react';
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)

import "react-datepicker/dist/react-datepicker.css"

const FechaInicio = ({vFechaI, cFechaI}) => {
    const [stratDate, setStartDate] = useState(new Date());
    
    return (
      <div>
        <label>Fecha Inicio</label>
        <div className='mt-2'>
            <DatePicker 
                id='fecha' 
                selected={vFechaI} 
                onChange={cFechaI} 
                placeholderText='Seleccione Fecha Inicial'  
                locale="es"
                dateFormat="yyyy/MM/dd" 
                className='form-control' 
            />
        </div>
      </div>
    );
  };
  
  export default FechaInicio;

