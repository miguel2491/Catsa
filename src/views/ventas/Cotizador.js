import React, {useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom';
import ProgressBar from "@ramonak/react-progress-bar";
import makeAnimated from 'react-select/animated';
import Swal from 'sweetalert2';
import StepWizard from "react-step-wizard";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import Step1 from '../ventas/Cotizador/Step1'
import Step2 from '../ventas/Cotizador/Step2'
import Step3 from '../ventas/Cotizador/Step3'
import { getCostoP, getClientesCot, getDatosPlanta, getCotizacionId, getCotizacionPedido } from '../../Utilidades/Funciones';
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
import { cilSearch } from '@coreui/icons'
import '../../estilos.css'

const animatedComponents = makeAnimated();
const userIsAsesor = Rol('Vendedor');

const containerStyle = {
  width: '100%',
  height: '500px'
};

const Cotizador = () => {
  const { id } = useParams();
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(new Date());
  const [noCotizacion, setNoCotizacion] = useState(id);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [vModal, setVModal] = useState(false);// Modal Cargando
  const [shSteps, setShSteps] = useState(false);
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
  const [coordsO, setCoordsO] = useState("");
  //********************************************************************* */
  const updPData = (newData) => {
    setPData((prevData) => [...prevData, ...newData]);
  };
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
  const [pedData, setPedData] = useState({
    IdPedido:null,
    FechaCreacion:null,
    Planta:null,
    Archivos:null,
    CantidadM3:null,
    CodBomba:null,
    Distancia:null,
    Elemento:null,
    Espaciado:null,
    FechaHoraPedido:null,
    M3Viaje:null,
    NoObra:null,
    Observaciones:null,
    Pago:null,
    PlantaEnvio:null,
    PrecioBomba:null,
    PrecioExtra:null,
    PrecioProducto:null,
    Producto:null,
    Recibe:null,
  });
  //********************************************************************* */
  useEffect(()=>{    
      if(noCotizacion != 0)
      {   
          Swal.fire({
            title: 'Cargando...',
            text: 'Buscando...',
            didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
              getCotizacion(noCotizacion)
            }
          });
      }
    },[]);

    const getCotizacion = async(id) =>{
      try{
        const ocList = await getCotizacionId(id);
        if(ocList){
          console.log(ocList)
          setPlantas(ocList[0].Planta);
          getCostoPlanta(ocList[0].Planta);
          const fecha = ocList[0].FechaCreacion;
          const [fecha_, hora_] = fecha.split("T");
          setCoordsO(ocList[0].coordenada)//coordenadaR
          setFechaIni(fecha_);
          setFData(prevState => ({
            ...prevState,
            planta: ocList[0].Planta,
            fecha: fecha_,
            no_cotizacion: ocList[0].IdCotizacion,
            cliente: ocList[0].Cliente,
            obras: ocList[0].Obra,
            coordenadas:ocList[0].coordenada,            
            fuente:ocList[0].Fuente,
            segmento:ocList[0].Segmento,
            tipo_cli:null,
            concreto:null,
            resistencia:null,
            edad:null,
            revenimiento:null,
            tma:null,
            colocacion:null,
            producto:null,
            facturar_a:null,
            direccion_clie:ocList[0].Direccion,
            asesor:null,
            alkon:null,
            bloqueado:null,
            seguridad:null,
            fpago:null,
            nombre_sol:null,
            telefono:null,
          }));          
          console.log(ocList)
          getPedidosCot(id)
        }
      }catch(error){
          Swal.close();
          Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }

    const getPedidosCot = async(id) => {
      try{
        Swal.close();
        const ocList = await getCotizacionPedido(id);
        if(ocList){
          setShSteps(true)
          console.log(ocList)
          setFData(prevState => ({
            ...prevState,
            producto:ocList
          }));
        }
      }catch(error){
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }

  //******************************************************************** */
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
    const planta = event.target.value;
    if(planta.length > 0){
      Swal.fire({
        title: 'Cargando...',
        text: 'Trabajando...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
            setPlantas(planta);
            getCostoPlanta(planta);
            setShSteps(true)     
        }
    });
    }else{
      setShSteps(false);
    } 
  };
  const getCostoPlanta = async (planta) =>
  {
    try {
      const comisiones = await getCostoP(planta);
      setProducto(comisiones)
      if (comisiones) {
          Swal.close();
          setDFijos(comisiones);
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
          getClientes(planta);
      } else {
          Swal.close();
          Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
      }
    } catch (error) {
      Swal.close();
      console.log(error);
      //Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  };  
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
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const onFindCotizacion = (e) => {
    setNoCotizacion(e.target.value); // Actualiza el texto del filtro
  };
  const fCotizacion = async() =>{
    console.log(noCotizacion)
  };
  //***************************************************************** */
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
          <CButton color="success" className='txtTitleBtn'>Limpiar</CButton>
        </CCol>
        <CCol xs={4} md={1} lg={1} className='mt-4'>
          <CButton color="danger" className='txtTitleBtn'>Exportar</CButton>
        </CCol>
        <CCol xs={4} md={1} lg={1} className='mt-4'>
          <CButton color="primary" className='txtTitleBtn'>Guardar</CButton>
        </CCol>
      </CRow>
      {shSteps && (
      <StepWizard>
        <Step1 fijos={dFijos} corpo={dCorpo} mop={dMop} cdiesel={dDiesel} sucursal={plantasSel} clientes_={aClientes} obras_={aObras} coords={coordsO} onUpdateFData={updFData} />
        <Step2 fuente={aFuente} segmento={aSegmento} canal={aTC} productos={aProducto} fData={fData} updPData={updPData} />
        <Step3 fData={fData} pData={pData} />
      </StepWizard>
      )}
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