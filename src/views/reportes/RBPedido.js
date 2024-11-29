import React,{useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  CFormInput,
  CFormCheck,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';
import {getPedidoInd, getObraInd} from '../../Utilidades/Funciones'
import {TiempoT, Fnum} from '../../Utilidades/Tools'

const RBPedido = () => {
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fetchedData, setDataPedido] = useState({
      planta: '',
      asesor: '',
      programado: true,
      vBueno: false,
      obra:'',
      direccion:'',
      producto:'',
      m3:'',
      bomba:'',
      fcaEntrega:'',
      hraSalida:'',
      tRecorrido:0,
      tRealAprox:'',
      espaciado:0,
      estatus:'',
      pProducto:'',
      iTotalPagar:'',
      sAnticipo:'',
      mBrutoReal:'',
      fPago:'',
      observaciones:'',
      creo:'',
      actualizo:'',
      aVBueno:'',
  })
  const [DataObra, setDataObra] = useState({
    Obra: '',
    utm: '',
    nvendedor: '',
    vendedor: '',
    nocliente:'',
    cliente:'',
    Direccion:'',
    bloqueado:false,
    alkon:false,
    calle:'',
    ciudad:'',
    telefono:'',
    postal:'',
    solicita:'',
    descripcionP:''
})
  const handleInputChange = (e) => {
    setNPedido(e.target.value); // Actualiza el estado con el nuevo valor del input
  };
  //Constantes Formulario
  const [nPedido, setNPedido] = useState('');
  const [Planta, setPlanta] = useState('');
  const [asesor, setAsesor] = useState('');
  const [programado, setProgramado] = useState(false);
  const [vBueno, setVBueno] = useState(false);
  const [obra, setObra] = useState('');
  const [direccion, setDireccion] = useState('');
  const [producto, setProducto] = useState('');
  const [m3, setM3] = useState('');
  const [bomba, setBomba] = useState('');
  const [fcaEntrega, setFcaEntrega] = useState('');
  const [hraSalida, setHraSalida] = useState('');
  const [tRecorrido, setRecorrido] = useState('');
  const [tRealAprox, setRAprox] = useState('');
  const [espaciado, setEspaciado] = useState('');
  const [estatus, setEstatus] = useState('');
  const [pProducto, setPProducto] = useState('');
  const [iTotalPagar, setTotalPagar] = useState('');
  const [sAnticipo, setAnticipo] = useState('');
  const [mBrutoReal, setMBReal] = useState('');
  const [fPago, setFPago] = useState('');
  const [observaciones, setObserv] = useState('');
  const [UsuarioCreo, setCreo] = useState('');
  const [actualizo, setActualizo] = useState('');
  const [aVBueno, setAVBueno] = useState('');
  
  const getRepos = async () =>{
    setVisible(true);
    setLoading(true);
    try {
      const data = await getPedidoInd(nPedido);
      console.log(data[0]);
      if (data) {
        setDataPedido(data[0]);
        var planta = data[0].Planta;
        var obra = data[0].NoObra;
        getDObra(obra,planta);
      } else {
        Swal.fire("No se encontraron datos", "El número de pedido no es válido", "error");
        setLoading(false); // Oculta el modal de carga
        setVisible(false); // Cierra el modal de carga
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
    } 
  }

  const getDObra = async (nObra, planta) => {
    try {
      const dataObra = await getObraInd(nObra, planta);
      console.log(dataObra[0]);
      if (dataObra) {
        setDataObra(dataObra[0]); // Aquí se asigna el primer objeto del array (suponiendo que es el único)
      } else {
        Swal.fire("No se encontraron datos", "Obra NO válida", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
    } finally {
      setLoading(false); // Oculta el modal de carga
      setVisible(false); // Cierra el modal de carga
    }
  }
  useEffect(() => {
    if (fetchedData && DataObra) {
      const fcaEntrega = fetchedData.FechaHoraPedido ?? '';
      // Usar split para separar la fecha y la hora
      const [fecha, hora] = fcaEntrega.split("T");
      const obra_ = (fetchedData.NoObra ?? '')+ ' ' + (DataObra.Obra ?? '');
      setPlanta(fetchedData.Planta ?? '');
      setAsesor(DataObra.Vendedor ?? '');
      setProgramado(fetchedData.activo ?? false);
      setVBueno(fetchedData.VistoBueno ?? false);
      setObra(obra_);
      setDireccion(DataObra.Direccion ?? '');
      setProducto(fetchedData.Producto ?? '');
      setM3(fetchedData.M3Viaje ?? '');
      setBomba(fetchedData.CodBomba ?? '');
      setFcaEntrega(fecha ?? '');
      setHraSalida(hora ?? '');
      setRecorrido(TiempoT(fetchedData.TRecorrido ?? 0) ?? 0);
      setRAprox(fetchedData.TiempoReal ?? '');
      setEspaciado(TiempoT(fetchedData.Espaciado ?? 0) ?? 0);
      setEstatus(fetchedData.estatus ?? '');
      setPProducto(fetchedData.PrecioProducto ?? '');
      setTotalPagar(fetchedData.Total ?? '');
      setAnticipo(fetchedData.sAnticipo ?? '');
      setMBReal(fetchedData.mBrutoReal ?? '');
      setFPago(fetchedData.Pago ?? '');
      setObserv(fetchedData.Observaciones ?? '');
      setCreo(fetchedData.UsuarioCreo ?? '');
      setActualizo(fetchedData.UsuarioActualizo ?? '');
      setAVBueno(fetchedData.UsuarioCyC ?? '');
    }
  }, [fetchedData, DataObra]);

  return (
    <>
      <CContainer fluid>
        <h1>Reporte Pedidos</h1>
        <CRow>
          <CCol sm="auto" className='mt-3'>
            <CFormInput type="text" placeholder="No. Pedido" value={nPedido}  onChange={handleInputChange} />
          </CCol>
          <CCol sm="auto" className='mt-3'>
            <CButton color='primary' onClick={getRepos}>
                <CIcon icon={cilSearch} className="me-2" />
                Realizar
            </CButton>
            </CCol>
        </CRow>
        <CRow className='mt-4'>
            <CCol xs={12} md={12}>
                <CCard className="mb-4">
                    <CCardHeader>PEDIDO: <b id='npedido'></b></CCardHeader>
                    <CCardBody>
                        <CRow>
                          <CCol xs={3} md={2}>
                            <CFormCheck id="cbProgramado" label="Programado" disabled className='mt-4' checked={programado} />
                          </CCol>
                          <CCol xs={3} md={2}>
                            <CFormCheck id="cbVBueno" label="Visto Bueno" disabled className='mt-4' checked={vBueno} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='planta' label='Planta' disabled value={Planta} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='asesor' label='Asesor' disabled value={asesor} />
                          </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='obra' label='Obra' disabled value={obra} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='direccion' label='Dirección' disabled value={direccion} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='producto' label='Producto' disabled value={producto} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='m3' label='M3/Viaje' disabled value={m3}/>
                          </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='bomba' label='Bomba' disabled value={bomba} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='fcaEntrega' label='Fecha Entrega' disabled value={fcaEntrega} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='hraSalida' label='Hora Salida' disabled value={hraSalida} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='tRecorrido' label='Tiempo Recorrido' disabled value={tRecorrido}/>
                          </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='tReal' label='Tiempo Real Aproximado' disabled value={tRealAprox}/>
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='espaciado' label='Espaciado' disabled value={espaciado}/>
                          </CCol>
                          {/* <CCol xs={6} md={3}>
                            <CFormInput type='text' id='estatus' label='Estatus' disabled value={estatus}/>
                          </CCol> */}
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='pProducto' label='Precio Producto' disabled value={pProducto}/>
                          </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='iTotalPagar' label='Importe Total a Pagar' disabled value={iTotalPagar} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='sAnticipo' label='Saldo Anticipo' disabled value={sAnticipo}/>
                          </CCol>
                          {/* <CCol xs={6} md={3}>
                            <CFormInput type='text' id='mBrutoReal' label='Margen Bruto Real' disabled value={mBrutoReal} />
                          </CCol> */}
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='fPago' label='Forma de Pago' disabled value={fPago} />
                          </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='obs' label='Observaciones' disabled value={observaciones} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='creo' label='Creo' disabled value={UsuarioCreo} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='actualizo' label='Actualizo' disabled value={actualizo} />
                          </CCol>
                          <CCol xs={6} md={3}>
                            <CFormInput type='text' id='aVB' label='Actualizo Visto Bueno' disabled value={aVBueno} />
                          </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
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
}

export default RBPedido
