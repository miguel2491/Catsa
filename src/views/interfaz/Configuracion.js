import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import '../../estilos.css';
import BuscadorDT from '../base/parametros/BuscadorDT'
import { getPlantasCon } from '../../Utilidades/Funciones';
import {
  CForm,
  CFormSwitch,
  CFormInput,
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
import { cilSearch, cilX, cilCheckCircle } from '@coreui/icons'

const Configuracion = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [vPlantaM, setVPlanta] = useState(false);
    //Arrays
    const [dtPlanta, setDTPlanta] = useState([]);
    const [PlantaId, setPlantaId] = useState('');
    const [PlantaTxt, setPlantaTxt] = useState('');
    const [Company, setCompany] = useState('');
    const [Unidad, setUnidad] = useState('');
    const [IP, setIP] = useState('');
    const [BD, setBD] = useState('');
    const [Pass, setPass] = useState('');
    const [Activa, setActiva] = useState(false);
    //Buscador
    const [vBPlanta, setBPlanta] = useState('');
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda

    const getPlantaI = (p) =>{
        console.log(p)
        console.log(dtPlanta)
        //Buscar Arreglo por Index Planta
        const resultado = dtPlanta.find(item => item.Planta === p);
        console.log(resultado)
        setPlantaId(resultado.Planta)
        setPlantaTxt(resultado.Planta)
        setCompany(resultado.Compañia)
        setIP(resultado.IP)
        setPass(resultado.Pass)
        setUnidad(resultado.Unidad)
        setBD(resultado.BD)
        setActiva(resultado.Activa)
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
        {
            name:'Activo',
            width:"180px",
            cell: (row) => (
                // Si el valor de row.Activa es 'False', mostramos un ícono de Activa (Logica antigua ya implementada =( )
                row.Activa ? (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '3px' }}>Inactiva</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '3px' }}>Activa</span>
                    </div>
                    
                )
            ),
        },
    ];
    // Estilos condicionales para filas
    const rowStyles = [
        {
        when: row => !row.Activa, // Si Activa es false
        style: {
            backgroundColor: '#48CA84', // Color de fondo rojo claro
            color: '#721c24', // Color de texto rojo oscuro
        },
        },
        {
        when: row => row.Activa, // Si Activa es true
        style: {
            backgroundColor: '#FFFEF6', // Color de fondo verde claro
            color: '#155724', // Color de texto verde oscuro
        },
        },
    ];

    useEffect(() => {
        getPlantas_()
    }, []);

    const getPlantas_ = async () => {
        try {
            const plantas = await getPlantasCon();
            if (plantas) {
                setDTPlanta(plantas); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const mCambio = () =>{
        setActiva(!Activa);
    }
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
      // Función de búsqueda
    const fBusqueda = () => {
        console.log(vBPlanta.length);
        if(vBPlanta.length != 0){
            const valFiltrados = dtPlanta.filter(dtPlanta => 
            dtPlanta.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlanta(valFiltrados);
        }else{
            getPlantas_()
        }
    };
    const fDPlanta = dtPlanta.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.Descripcion.includes(fText) || item.IP.includes(fText);
    });
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
                <CCol xs={3} md={3}>
                    <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
                <DataTable
                    columns={colPlanta}
                    data={fDPlanta}
                    pagination
                    persistTableHead
                    subHeader
                    conditionalRowStyles={rowStyles}
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
                                <CFormInput placeholder="" value={PlantaId} />
                            </CCol>
                            <CCol>
                                <label>Planta</label>
                                <CFormInput placeholder="" value={PlantaTxt} />
                            </CCol>
                            <CCol>
                                <label>Compañia</label>
                                <CFormInput placeholder="" value={Company} />
                            </CCol>
                            <CCol>
                                <label>Unidad</label>
                                <CFormInput placeholder="" value={Unidad} />
                            </CCol>
                            </CRow>
                            <CRow className='mt-2 mb-2'>
                            <CCol>
                                <label>IP</label>
                                <CFormInput placeholder="" value={IP} />
                            </CCol>
                            <CCol>
                                <label>BD</label>
                                <CFormInput placeholder="" value={BD} />
                            </CCol>
                            <CCol>
                                <label>Pass</label>
                                <CFormInput placeholder="" value={Pass} />
                            </CCol>
                            <CCol>
                                <label>Activa</label>
                                <CFormSwitch
                                    size="lg"
                                    checked={Activa}
                                    onChange={mCambio}
                                />
                            </CCol>
                        </CRow>
                        <CRow className='mt-2 mb-2'>
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