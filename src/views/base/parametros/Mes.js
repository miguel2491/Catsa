import React,{useEffect, useState, useRef} from 'react';
import {
  CFormSelect,
} from '@coreui/react'
const mes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MesSelector = ({mesSel, mMes}) => {
    
  //const [mesSel, setMesSel] = useState('');
  const mesNombres = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
    
    return (
      <div>
        <label>Seleccione Mes</label>
        <div className='mt-2'>
          <CFormSelect aria-label="Selecciona" id="cmbMes" value={mesSel} onChange={mMes}>
            <option value="" >Selecciona...</option>
              {mes.map((m) => (
                <option key={m} value={m}>
                  {mesNombres[m - 1]} {/* Usamos m-1 porque el arreglo empieza en 0 */}
                </option>
              ))}
          </CFormSelect>
        </div>
      </div>
    );
  };
  
  export default MesSelector;

