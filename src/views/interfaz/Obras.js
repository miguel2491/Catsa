import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import '../../estilos.css'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import { format } from 'date-fns';
import { getAlkon, getObras, resetCliente, getProducto, resetProducto } from '../../Utilidades/Funciones';
import {
  CInputGroup,
  CFormInput,
  CFormSwitch,
  CFormSelect,
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
import { cilCheck, cilSearch } from '@coreui/icons'

const Obras = () => {
    const [plantasSel , setPlantas] = useState('');
    const [dInterfaz, setDInterfaz] = useState(['Proveedores', 'Materiales', 'Servicios','Producto']); // Lista de interfaces
    const [filteredInterfaz, setFilteredInterfaz] = useState(dInterfaz); // Interfaz filtrada según fText
    const [interfazSel, setInterfaz] = useState('');
    const [dEstatus, setDEstatus] = useState(['Correcto', 'Error']); // Lista de Estatus
    const [filteredEstatus, setFilteredEstatus] = useState(dEstatus); // Interfaz filtrada según fText
    const [estatusSel, setEstatus] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [vMR, setMR] = useState(false);
    const [vModal, setVModal] = useState(false);
    const [vVMR, setVPR] = useState(false);
    const [noCliente, setNoCliente] = useState('');
    const [swEnviado, setSwEnviado] = useState(false);
    const [swEliminado, setSwEliminado] = useState(false);
    const [plantaB, setPlantaB] = useState('');
    const [descB, setDescB] = useState('');
    const [dAlkon, setDAlkon] = useState([]);
    const [dProductoDT, setDProductoDT] = useState([]);
    const [productoF, setProductoF] = useState([]);
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [fSel, setFSel] = useState(''); // Estado para el filtro de búsqueda
    const [dProducto, setDProducto] = useState([]);
    const [dObra, setDObra] = useState([]);
    //Arrays
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const fInterfaz = (event) => {
        const selectedInterfaz = event.target.value;
        setInterfaz(event.target.value);
    }
    const fStatus = (event) => {
        setFText(event.target.value)
    }
    const onFindNoCliente = (e) => {
        setNoCliente(e.target.value);
    };
    const onFindProducto = (e) => {
        setProductoF(e.target.value);
    };
    const fCliente = async() =>{
        console.log(noCliente)
    }
    const fProducto = async() =>{
        console.log(productoF)
        try {
            const producto = await getProducto(productoF);
            if (producto) {
                setDProductoDT(producto); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const handleSCE = (e) => {
        setSwEnviado(e.target.checked);
    }
    const handleSCD = (e) => {
        setSwEliminado(e.target.checked);
    }
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
      
    const obtenerDatosObra = async () => {
        setVModal(true);
        setLoading(true);
        setPercentage(0);
        const interval = setInterval(() => {
            setPercentage(prev => {
            if (prev < 90) return prev + 10;
            return prev;
            });
        }, 900);
        // Aquí puedes colocar la lógica para llamar a tu API o hacer lo que necesites
        try {
            const alkon = await getAlkon(vFechaI.toLocaleDateString('en-US',opcionesFca));
            if (alkon) {
                setDAlkon(alkon); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            setLoading(false);
            setVModal(false); // Oculta el modal de carga
            setPercentage(100);
        }
    };
    const hsCSend = (index, value) => {
        console.log(index, value)
        const updatedData = [...dProductoDT];
        updatedData[index].Enviado = value; // Actualiza el valor de "Enviado" en el índice correspondiente
        setDProductoDT(updatedData);
        const producto = updatedData[index];
        console.log('Código Producto:', producto.Item_Code);
        console.log('Planta:', producto.Planta);
        resetProducto(producto.Planta, producto.Item_Code, value, producto.Eliminar);
    };
    const hsCDel = (index, value) => {
        const updatedData = [...dProductoDT];
        updatedData[index].Eliminar = value; // Actualiza el valor de "Enviado" en el índice correspondiente
        setDProductoDT(updatedData);
    };
    // Filtrar datos en función del texto de búsqueda
    const fDataAlkon = dAlkon.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        const matchesPlanta = plantasSel ? item.Planta.toLowerCase().includes(plantasSel.toLowerCase()) : true;
        const matchesInterfaz = interfazSel ? item.Interfaz.toLowerCase().includes(interfazSel.toLowerCase()) : true;
        const matchesEstatus = estatusSel ? item.Estatus.toLowerCase().includes(estatusSel.toLowerCase()) : true;
        const matchesText = fText ? item.Planta.toLowerCase().includes(fText.toLowerCase()) ||
                                    item.StatusRecord.toLowerCase().includes(fText.toLowerCase()) ||
                                    item.Operacion.toLowerCase().includes(fText.toLowerCase()) : true;

        return matchesPlanta && matchesInterfaz && matchesText && matchesEstatus;
        //return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.StatusRecord.includes(fText) || item.Operacion.includes(fText) || item.Interfaz.includes(fText);
    });
    // Lógica de filtro
    const onFilter = (e) => {
        setFText(e.target.value); // Actualiza el texto del filtro
    };
    const columnsAlkon = [
        {
            name: 'Planta',
            selector: row => row.Planta,
            width:"80px",
        },{
            name: 'Fecha',
            selector: row => row.Fecha,
            width:"180px",
            sortable:true,
            grow:1,
        },{
            name: 'Registro',
            selector: row => row.Registro,
            sortable: true,
            grow: 1,
            width:"200px",
        },
        {
            name: 'Status',
            width:"100px",
            selector: row => row.StatusRecord,
        },
        {
          name: 'Operación',
          width:"150px",
          selector: row => row.Operacion,
        },
        {
          name: 'Interfaz',
          width:"120px",
          selector: row => row.Interfaz,
        },
        {
          name: 'Comentario',
          width:"500px",
          selector: row => row.Comentario,
        },
    ];
    const colProducto = [
        {
            name: 'Planta',
            selector: row => row.Planta,
            width:"80px",
        },{
            name: 'Código Producto',
            selector: row => row.Item_Code,
            width:"180px",
        },{
            name: 'Descripción',
            selector: row => row.Item_Description,
            width:"400px",
        },{
            name: 'Enviado',
            selector: row => row.Enviado,
            width:"120px",
            cell: (row, index) => (
                <CFormSwitch
                    size="xl"
                    checked={row.Enviado}
                    onChange={(e) => hsCSend(index, e.target.checked)} // Actualiza el estado del switch
                />
            ),
        },{
            name: 'Eliminar',
            selector: row => row.Eliminar,
            width:"120px",
            cell: (row, index) => (
                <CFormSwitch
                    size="xl"
                    checked={row.Eliminar}
                    onChange={(e) => hsCDel(index, e.target.checked)} // Actualiza el estado del switch
                />
            ),
        }

    ];
    
return (
    <>
        <CContainer fluid>
        <CModal
            backdrop="static"
            visible={vMR}
            onClose={() => setMR(false)}
            className='c-modal'
        >
            <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Obra a Reenviar</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol>
                        <label>No. Cliente</label>
                        <CInputGroup className="mb-3">
                        <CFormInput placeholder="" value={noCliente} onChange={onFindNoCliente} />
                        <CButton type="button" color="success" className='btn-primary' onClick={fCliente} style={{'color':'white'}} variant="outline">
                            <CIcon icon={cilSearch} className="me-2" />
                        </CButton>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className='mt-2 mb-2'>
                    <CCol>
                        <label>Planta</label>
                        <label>{plantaB}</label>
                    </CCol>
                    <CCol>
                        <label>Description</label>
                        <label>{descB}</label>
                    </CCol>
                    <CCol>
                        <label>Enviado</label>
                        <CFormSwitch size="xl" id="cmbEnviado" checked={swEnviado} onChange={handleSCE} />
                    </CCol>
                    <CCol>
                        <label>Eliminar</label>
                        <CFormSwitch size="xl" id="cmbDel" checked={swEliminado} onChange={handleSCD} />
                    </CCol>
                    <CCol>
                        <label>Reenviar</label><br />
                        <CButton color='primary' style={{'color':'white'}}><CIcon icon={cilCheck} className="me-2" /></CButton>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
            
            </CModalFooter>
        </CModal>
        <CModal
            backdrop="static"
            visible={vVMR}
            onClose={() => setVPR(false)}
            className='c-modal-80'
        >
            <CModalHeader>
                <CModalTitle id="sbp">Producto a Reenviar</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol xs={12} md={3} lg={3}>
                        <label>Código Producto</label>
                        <CInputGroup className="mb-3">
                        <CFormInput placeholder="" value={productoF} onChange={onFindProducto} />
                        <CButton type="button" color="success" className='btn-primary' onClick={fProducto} style={{'color':'white'}} variant="outline">
                            <CIcon icon={cilSearch} className="me-2" />
                        </CButton>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className='mt-2 mb-2'>
                    <DataTable
                        columns={colProducto}
                        data={dProductoDT}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CRow>
            </CModalBody>
            <CModalFooter>
            
            </CModalFooter>
        </CModal>
        <h3>Interfaz Obras</h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2} lg={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <label>Estatus</label>
                    <CFormSelect aria-label="Seleccione Estatus" onChange={fStatus}>
                        <option>-</option>
                        {filteredEstatus.map((estatus, index) => (
                            <option key={index} value={estatus}>{estatus}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <label>Interfaz</label>
                    <CFormSelect aria-label="Interfaz" onChange={fInterfaz}>
                        <option>-</option>
                        {filteredInterfaz.map((interfaz, index) => (
                            <option key={index} value={interfaz}>{interfaz}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol xs={6} md={3} lg={3}>
                    <label>Buscar</label>
                    <CInputGroup>
                        <CFormInput 
                            id='search'
                            type='text'
                            placeholder='Buscar'
                            aria-label='Buscar...'
                            value={fText}
                            onChange={onFilter}  
                        />
                    </CInputGroup>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3 d-flex justify-content-center'>
                    <CButton color='primary' onClick={obtenerDatosObra}>
                      <CIcon icon={cilSearch} className="me-2" />
                       Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='success' style={{'color':'white'}} onClick={() =>{ setMR(true)}}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Reenviar Obra
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='info' style={{'color':'white'}} onClick={() =>{ setVPR(true)}}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Reenviar Producto
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <DataTable
                    columns={columnsAlkon}
                    data={fDataAlkon}
                    pagination
                    persistTableHead
                    subHeader
                />
            </CRow>
            <br />
            <CModal
                backdrop="static"
                visible={vModal}
                onClose={() => setVModal(false)}
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
            <CModalFooter />
            </CModal>
        </CContainer>
    </>
    )
}
export default Obras