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
        <div className='mt-2'>
            <DatePicker 
              id='fcaF'
              selected={vFcaF} 
              onChange={mFcaF} 
              placeholderText='Selecciona Fecha' 
              dateFormat="yyyy/MM/dd"
              className='form-control' />
        </div>
      </div>
    );
  };
  
  export default FechaFinal;

