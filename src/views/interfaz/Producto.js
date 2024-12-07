import React, {useImperativeHandle, forwardRef, useState, useRef} from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import { format } from 'date-fns';

import {
    CBadge,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
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

const Producto = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [visibleM, setVisibleM] = useState(false);
    //Arrays
    const [dResumen, setResumen] = useState([]);
    const [aBitacora, setBitacora] = useState([]);
    const [dMov, setMov] = useState([]);
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [productos, setProductos] = useState([]);

    const eAccion = async () => {
        setVisible(!visible)
        setLoading(true);
        setPercentage(0);
        var producto = await getProductoIF(props.planta, props.fechaI);
        console.log(producto)
        if(producto){
            //setResumen(producto);
            setProductos(producto)
            setVisible(visible)
            setLoading(false);
            setPercentage(100);
        }else{
            Swal.fire("Error", "Ocurrio un error, Vuelve a intentar", "error");
        }
        
        setPlantas(props.planta);
        setFechaIni(props.fechaI);
    };
    
    useImperativeHandle(ref, () => ({
        eAccion,
    }));


    return (
    <>
        <CContainer fluid>
                <h2 style={{ textAlign: 'center' }}>Resumen Diario</h2>
                <CCol xs={12}>
                <CTable responsive style={{fontSize:'10px'}}>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Acción</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Planta</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Registro</CTableHeaderCell>
                            <CTableHeaderCell scope="col">StatusRecord</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Operacion</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Interfaz</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Comentario</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {
                            dResumen.length === 0 ?(
                                <CTableRow>
                                    <CTableDataCell colSpan={8}>Sin datos</CTableDataCell>
                                </CTableRow>
                            ):(
                                dResumen.map((itemd,index) => (
                                    <CTableRow key={ index}>
                                        <CTableDataCell>
                                            <CButton color="primary" size="sm" title='Ver' onClick={()=>getMovInt(itemd.Registro)}>
                                                <CIcon icon={cilEyedropper} className="me-2" />
                                            </CButton>
                                            <CModal
                                                backdrop="static"
                                                visible={visibleM}
                                                onClose={() => setVisibleM(false)}
                                                aria-labelledby="StaticBackdropExampleLabel"
                                                className='modalLg'
                                            >
                                                <CModalHeader>
                                                <CModalTitle id="StaticBackdropExampleLabel">Movimientos</CModalTitle>
                                                </CModalHeader>
                                                <CModalBody>
                                                <CRow>
                                                    <CCol xs={6}>
                                                        <h3 className='center-text'>Intelisis</h3>
                                                        <CTable responsive style={{fontSize:'10px'}}>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell scope="col">Material</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                                                    <CTableHeaderCell scope="col">Movimiento</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody style={{backgroundColor:'#f0f0f0'}}>
                                                                {
                                                                    aBitacora.length === 0 ? (
                                                                        <CTableRow>
                                                                            <CTableDataCell colSpan={4}>Sin datos</CTableDataCell>
                                                                        </CTableRow>
                                                                    ):(
                                                                        aBitacora.map((itemd, index) => (
                                                                            <CTableRow key={index}>
                                                                                <CTableDataCell>{itemd.Material}</CTableDataCell>
                                                                                <CTableDataCell>{format(itemd.Fecha, 'yyyy/MM/dd')}</CTableDataCell>
                                                                                <CTableDataCell>{Fnum(itemd.Cantidad)}</CTableDataCell>
                                                                                <CTableDataCell>{itemd.Mov}</CTableDataCell>
                                                                            </CTableRow>
                                                                        ))
                                                                    )
                                                                }
                                                            </CTableBody>
                                                        </CTable>
                                                    </CCol>
                                                </CRow>
                                                </CModalBody>
                                                <CModalFooter>
                                                <CButton color="secondary"onClick={() => setVisibleM(false)} >
                                                    Cerrar
                                                </CButton>
                                                </CModalFooter>
                                            </CModal>
                                        </CTableDataCell>
                                        <CTableDataCell>{itemd.Planta}</CTableDataCell>
                                        <CTableDataCell>{format(itemd.Fecha, 'yyyy/MM/dd')}</CTableDataCell>
                                        <CTableDataCell>{itemd.Registro}</CTableDataCell>
                                        <CTableDataCell>{itemd.StatusRecord}</CTableDataCell>
                                        <CTableDataCell>{itemd.Operacion}</CTableDataCell>
                                        <CTableDataCell>{itemd.Interfaz}</CTableDataCell>
                                        <CTableDataCell>{itemd.Comentario}</CTableDataCell>
                                    </CTableRow>
                                ))
                            )
                        }
                    </CTableBody>
                </CTable>
            </CCol>
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
export default Producto