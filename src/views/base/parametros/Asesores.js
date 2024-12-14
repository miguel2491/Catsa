import React,{useEffect, useState, useRef} from 'react';
import { getAllVendedores } from '../../../Utilidades/Funciones';
import { CFormSelect } from '@coreui/react';

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
            var obj = asesores_;
              for(var x = 0; x < obj.length; x++)
              {
                  ap.push({
                      "ID":x,
                      "UserName":obj[x].UserName,
                      "UserId":obj[x].UserId,
                      "Asesor":obj[x].Asesor,
                      "Planta":obj[x].Planta,
                      "CodigoV":obj[x].CodigoVendedor
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
        <CFormSelect id="cmbAsesor"  size="md" value={asesoresSel} onChange={mAsesor}>
            <option value="0" >Selecciona...</option>
            {asesor_.map((asesor, index) =>(
                <option value={asesor.CodigoV} key={`${index}`}>
                    {asesor.Asesor} ({asesor.Planta})
                </option>
            ))}
            </CFormSelect>
            {/* {selectedOption && (
                <p>Has seleccionado: {selectedOption}</p>
            )} */}
        </div> {/* Contenedor para Tabulator */}
      </div>
    );
  };
  
  export default Asesores;

