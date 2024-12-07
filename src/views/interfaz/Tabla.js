import React, {useImperativeHandle, forwardRef, useState, useRef} from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import { format } from 'date-fns';
import DataTable from 'react-data-table-component';

import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import '../../estilos.css';
import {CIcon} from '@coreui/icons-react'
import { cilEyedropper } from '@coreui/icons'
import {getProductoIF} from '../../Utilidades/Funciones'
import Swal from 'sweetalert2';

const Tabla = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    //Arrays
    const [dResumen, setResumen] = useState([]);

    const eAccion = async () => {
        var producto = await getProductoIF(props.planta, props.fechaI);
        console.log(producto)
        if(producto){
            setResumen(producto);
        }else{
            Swal.fire("Error", "Ocurrio un error, Vuelve a intentar", "error");
        }
    };
    
    useImperativeHandle(ref, () => ({
        eAccion,
    }));


    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            grow: 2,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },
        },
        {
            name: 'Year',
            selector: row => row.year,
        },
    ];

    const data = [
        {
          id: 1,
          title: 'Beetlejuice',
          year: '1988',
      },
      {
          id: 2,
          title: 'Ghostbusters',
          year: '1984',
      },
    ]
  
    return (
    <>
        <CContainer fluid>
                <h2 style={{ textAlign: 'center' }}>DataTable</h2>
            <CRow>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    dense
                />
            </CRow>
            <CModal
                    backdrop="static"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    aria-labelledby="StaticBackdropExampleLabel"
                >
                    <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel">Cargando...</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {loading && (
                            <CRow className="mt-3">
                            <ProgressBar completed={percentage} />
                            <p>Cargando: {percentage}%</p>
                            </CRow>
                        )}
                    </CModalBody>
                    <CModalFooter>
                    
                    </CModalFooter>
            </CModal>
        </CContainer>
    </>
    )
});
export default Tabla