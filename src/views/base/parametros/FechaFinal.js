import React,{useEffect, useState} from 'react';
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)

import "react-datepicker/dist/react-datepicker.css"

const FechaFinal = ({vFcaF, mFcaF}) => {
    const [stratDate, setStartDate] = useState(new Date());
    
    return (
      <div>
        <label>Fecha Final</label>
        <div>
            <DatePicker 
              id='fcaF'
              selected={vFcaF} 
              onChange={mFcaF} 
              placeholderText='Selecciona Fecha' 
              locale="es" 
              dateFormat="yyyy/MM/dd" />
        </div>
      </div>
    );
  };
  
  export default FechaFinal;

