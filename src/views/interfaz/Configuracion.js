import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import { getPlantasCon } from '../../Utilidades/Funciones';
import {
  CForm,
  CFormSelect,
  CWidgetStatsF,
  CContainer,
  CButton,
  CRow,
  CCol,
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import '../../estilos.css';
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const Configuracion = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [vPlantaM, setVPlanta] = useState(false);
    //Arrays
    const [dtPlanta, setDTPlanta] = useState([]);
    
    const getPlantaI = (p) =>{
        console.log(p)
        setVPlanta(true)
    }
    const colPlanta = [
        {
            name: 'Acciones',
            width:"150px",
            cell: (row, index) => (
                <CButton color='primary' onClick={ ()=> getPlantaI(row.Planta)} >Editar</CButton>
            ),
        },{
            name: 'Planta',
            selector: row => row.Planta,
            sortable:true,
            width:"80px",
        },{
            name: 'Descripcion',
            selector: row => row.Descripcion,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Compañia',
            selector: row => row.Compañia,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Unidad',
            selector: row => row.Unidad,
            width:"80px",
            sortable:true,
            grow:1,
        },
        {
            name: 'IP',
            selector: row => row.IP,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Pass',
            selector: row => row.Pass,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'BD',
            selector: row => row.BD,
            width:"180px",
            sortable:true,
            grow:1,
        },
    ];

    useEffect(() => {
        console.log('La función se ejecutó una sola vez al renderizar');
        getPlantas_()
    }, []);

    const getPlantas_ = async () => {
        try {
            const plantas = await getPlantasCon();
            console.log(plantas)
            if (plantas) {
                setDTPlanta(plantas); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
return (
    <>
        <CContainer fluid>
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
            <h3>Interfaz Configuraciones</h3>
            <CRow className='mt-4 mb-4'>
                <DataTable
                    columns={colPlanta}
                    data={dtPlanta}
                    pagination
                    persistTableHead
                    subHeader
                />
                <CModal
                    backdrop="static"
                    visible={vPlantaM}
                    onClose={() => setVPlanta(false)}
                    className='c-modal-80'
                >
                    <CModalHeader>
                        <CModalTitle id="StaticBackdropExampleLabel">Planta</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CRow>
                            <CCol>
                                <label>ID Planta</label>
                            </CCol>
                            <CCol>
                                <label>Planta</label>
                            </CCol>
                            <CCol>
                                <label>Compañia</label>
                            </CCol>
                            <CCol>
                                <label>Unidad</label>
                            </CCol>
                            <CCol>
                                <label>IP</label>
                            </CCol>
                            <CCol>
                                <label>BD</label>
                            </CCol>
                            <CCol>
                                <label>Pass</label>
                            </CCol>
                            <CCol>
                                <label>Activa</label>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CButton color='success'>Guardar</CButton>
                            </CCol>
                            <CCol>
                                <CButton color='info'>Modificar</CButton>
                            </CCol>
                            <CCol>
                                <CButton color='danger'>Eliminar</CButton>
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                    </CModalFooter>
                </CModal>
            </CRow>
            <br />
        </CContainer>
    </>
    )
}
export default Configuracion