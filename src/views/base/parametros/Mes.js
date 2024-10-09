import React,{useEffect, useState, useRef} from 'react';

const Mes = ({mesSel, mMes}) => {
    const [mes_, setmes] = useState([]);
    const mes = Array.from({ length: 12 }, (_, index) => 1 + index);

    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (event) => {
        //setSelectedOption(event.target.value);
    };
    useEffect(()=>{
        
    });
    
    return (
      <div>
        <label>Seleccione Mes</label>
        <div>
        <select id="cmbMes" value={mesSel} onChange={mMes}>
            <option value="" >Selecciona...</option>
                {mes.map(mes => (
                    <option key={mes} value={mes}>
                    {mes}
                    </option>
                ))}
            </select>
        </div>
      </div>
    );
  };
  
  export default Mes;

