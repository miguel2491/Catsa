import React,{useEffect, useState, useRef} from 'react';
const ap = [];
const Periodo = ({periodoSel, mPeriodo}) => {
    const [periodo_, setperiodo_] = useState([]);
    const currentYear = new Date().getFullYear(); // Obtiene el año actual
    const startYear = 2019; // Año de inicio (2019)
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);

    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (event) => {
        //setSelectedOption(event.target.value);
    };
    useEffect(()=>{
        
    });
    
    return (
      <div>
        <label>Seleccione Periodo</label>
        <div>
        <select id="cmbPeriodo" value={periodoSel} onChange={mPeriodo}>
            <option value="" >Selecciona...</option>
                {years.map(year => (
                    <option key={year} value={year}>
                    {year}
                    </option>
                ))}
            </select>
        </div>
      </div>
    );
  };
  
  export default Periodo;

