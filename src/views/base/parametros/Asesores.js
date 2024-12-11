import React,{useEffect, useState, useRef} from 'react';
import { getAllVendedores } from '../../../Utilidades/Funciones';

const ap = [];
const Asesores = ({asesoresSel, mAsesor}) => {
    const [asesor_, setAsesor_] = useState([]);
    
    const [selectedOption, setSelectedOption] = useState('');
    const handleChange = (event) => {
        //setSelectedOption(event.target.value);
    };
    useEffect(()=>{
        getAsesoresArr()
    });

    const getAsesoresArr = async () => {
        try {
            const asesores_ = await getAllVendedores();
            console.log(asesores_);
            var obj = asesores_;
              for(var x = 0; x < obj.length; x++)
              {
                  ap.push({
                      "UserName":obj[x].UserName,
                      "UserId":obj[x].UserId,
                      "Asesor":obj[x].Asesor,
                      "Planta":obj[x].Planta
                  });
              }
              setAsesor_(ap);
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };

    return (
      <div>
        <label>Asesor</label>
        <div>
        <select id="cmbAsesor" value={asesoresSel} onChange={mAsesor}>
            <option value="" >Selecciona...</option>
            {asesor_.map(asesor =>(
                <option value={asesor.UserId} key={asesor.UserName}>{asesor.Asesor} ({asesor.Planta})</option>
            ))}
            </select>
            {/* {selectedOption && (
                <p>Has seleccionado: {selectedOption}</p>
            )} */}
        </div> {/* Contenedor para Tabulator */}
      </div>
    );
  };
  
  export default Asesores;

