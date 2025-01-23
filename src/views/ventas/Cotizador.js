import React, {useEffect, useState, useRef} from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import StepWizard from "react-step-wizard";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import Step1 from '../ventas/Cotizador/Step1'
import Step2 from '../ventas/Cotizador/Step2'
import Step3 from '../ventas/Cotizador/Step3'
import { formatCurrency, getCostoP, getDatosPlanta, getClientesCot, getObrasCot, getProspectos_, getElementos } from '../../Utilidades/Funciones';
import { Rol } from '../../Utilidades/Roles'
import { IMaskMixin } from 'react-imask'
import IMask from 'imask'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import {
  CContainer,
  CRow,
  CCol,
  CFormSelect,
  CFormCheck,
  CFormTextarea,
  CFormText,
  CFormLabel,
  CButton,
  CFormInput,
  CInputGroup, 
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormSwitch,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs
} from '@coreui/react'
import { useNavigate } from "react-router-dom";
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch, cilTrash, cilPlus } from '@coreui/icons'
import '../../estilos.css'

const animatedComponents = makeAnimated();
const userIsAsesor = Rol('Vendedor');

const containerStyle = {
  width: '100%',
  height: '500px'
};

const Cotizador = () => {
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(new Date());
  const [noCotizacion, setNoCotizacion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [vModal, setVModal] = useState(false);// Modal Cargando
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  const [dFijos, setDFijos] = useState(' ');
  const [dCorpo, setDCorpo] = useState(' ');
  const [dMop, setDMop] = useState(' ');
  const [dDiesel, setDDiesel] = useState(' ');
  const [aFuente, setFuente] = useState([]);
  const [aSegmento, setSegmento] = useState([]);
  const [aTC, setTC] = useState([]);
  const [aProducto, setProducto] = useState([]);
  const [aClientes, setClientes] = useState([]);
  const [aObras, setObras] = useState([]);
  const [pData, setPData] = useState([]);
  const updPData = (newData) => {
    setPData((prevData) => [...prevData, ...newData]);
  };
  //********************************************************************* */
  const [fData, setFData] = useState({
    planta:plantasSel,
    fecha:vFechaI,
    no_cotizacion:null,
    cliente:null,
    obras:null,
    coordenadas:[],
    fuente:null,
    segmento:null,
    tipo_cli:null,
    concreto:null,
    resistencia:null,
    edad:null,
    revenimiento:null,
    tma:null,
    colocacion:null,
    producto:[],
    facturar_a:null,
    direccion_clie:null,
    asesor:null,
    alkon:false,
    bloqueado:false,
    seguridad:false,
    fpago:null,
    nombre_sol:null,
    telefono:null,

  });

  const updFData = (newFData) => {
    setFData((prevData) => ({
      ...prevData,
      ...newFData
    }));
  };
  const [fProductos, setfProductos] = useState({
    producto:null,
    m3:0,
    extras:[],
    precioVentaM3:0,
    porcVenta:0
  })
  const updProductos = (newPData) => {
    setfProductos((prevData) => ({
      ...prevData,
      ...newPData
    }));
  }
  //************************************************************** */
  const mCambio = (event) => {
    setPlantas(event.target.value);
    getCostoPlanta(event.target.value);
    getClientes(event.target.value);
  };

  async function getCostoPlanta(planta)
  {
    setLoading(true);
    setVModal(true);
    try {
      const comisiones = await getCostoP(planta);
      setProducto(comisiones)
      if (comisiones) {
          //setDFijos(comisiones);
          //setData(comisiones);
          var cpc = comisiones[0].CPC;
          var fecha = vFechaI.toLocaleDateString('en-US',opcionesFca);
          const fcaIni = fecha.split('/');
          let auxFcaI = fcaIni[2]+"-"+fcaIni[0]+"-"+fcaIni[1];
          const datosPla = await getDatosPlanta(planta, auxFcaI, cpc);
          setDFijos(datosPla.autoriza.data[0].FIJOS);
          setDCorpo(datosPla.autoriza.data[0].CORPORATIVO);
          setDMop(datosPla.autoriza.data[0].MOP);
          setDDiesel(datosPla.autoriza.data[0].DISEL);
          setFuente(datosPla.origen.data);
          setSegmento(datosPla.segmento.data);
          setTC(datosPla.canal.data);
          setPlantas(planta);
      } else {
          Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
      }
    } catch (error) {
      console.log(error);
      //Swal.fire("Error", "No se pudo obtener la información", "error");
    } finally {
        setLoading(false);
        setVModal(false); // Oculta el modal de carga
    }
  }
  
  async function getClientes(planta)
  {
    try{
      const clientes = await getClientesCot(planta);
      if(clientes){
          const clientesTransformados = clientes.map((clientes, index) => ({
              id: index,            // Asignar un ID único (en este caso, usamos el índice)
              name: clientes.Nombre, // Usamos la propiedad 'Producto' como 'name'
              NoCliente: clientes.NoCliente,
          }));
          setClientes(clientesTransformados);
      }    
    }catch(error){
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const onFindCotizacion = (e) => {
    setNoCotizacion(e.target.value); // Actualiza el texto del filtro
  };
  const fCotizacion = async() =>{
    console.log(noCotizacion)
  }
  return(
    <CContainer fluid>
      <CRow className='mt-2'>
        <CCol xs={6} md={2} lg={2}>
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol xs={6} md={2} lg={2}>
          <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
          />
        </CCol>
        <CCol xs={12} md={2} lg={2}>
          <label>No. Cotización</label>
          <CInputGroup className="mb-3">
          <CFormInput placeholder="" value={noCotizacion} onChange={onFindCotizacion} aria-label="Example text with two button addons"/>
            <CButton type="button" color="success" className='btn-primary' onClick={fCotizacion} style={{'color':'white'}} variant="outline">
              <CIcon icon={cilSearch} className="me-2" />
            </CButton>
          </CInputGroup>
        </CCol>
        <CCol xs={4} md={1} lg={1} className='mt-4'>
          <CButton color="primary">Limpiar</CButton>
        </CCol>
        <CCol xs={4} md={1} lg={1} className='mt-4'>
          <CButton color="primary">Exportar</CButton>
        </CCol>
        <CCol xs={4} md={1} lg={1} className='mt-4'>
          <CButton color="success">Guardar</CButton>
        </CCol>
      </CRow>
      <StepWizard>
        <Step1 fijos={dFijos} corpo={dCorpo} mop={dMop} cdiesel={dDiesel} sucursal={plantasSel} clientes_={aClientes} obras_={aObras} onUpdateFData={updFData} />
        <Step2 fuente={aFuente} segmento={aSegmento} canal={aTC} productos={aProducto} fData={fData} updPData={updPData} />
        <Step3 fData={fData} pData={pData} />
      </StepWizard>
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
  )  
}
//STEPS

//-------------------------------------------------------------------------------------------------------------------------------------
export default Cotizador