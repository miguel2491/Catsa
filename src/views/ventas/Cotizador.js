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
import { formatCurrency, getCostoP, getDatosPlanta, getClientesCot, getObrasCot, getProspectos_ } from '../../Utilidades/Funciones';
import {
  CContainer,
  CRow,
  CCol,
  CFormSelect,
  CButton,
  CFormInput,
  CInputGroup, 
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormSwitch
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch, cilTrash, cilPlus } from '@coreui/icons'
import '../../estilos.css'

const animatedComponents = makeAnimated();

const containerStyle = {
  width: '100%',
  height: '500px'
};

const MyMap = () => {
  const [map, setMap] = useState(null);
  const [locationO, setLocationO] = useState({
    latitude: null,
    longitude: null,
    error: null
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null
  });
  const [markerPosition, setMarkerPosition] = useState({
    lat: null,
    lng: null,
  });
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationO({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          });
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          });
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser."
      });
    }
  }, []);

  if (location.error) {
    return <p>Error: {location.error}</p>;
  }
  const onMarkerDragEnd = (e) => {
    // Actualizar las coordenadas del marcador cuando se haya dejado de arrastrar
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLocation({
      latitude: lat,
      longitude: lng,
      error: null
    });
    //console.log("Nuevo marcador en:", lat, lng);
    //console.log(locationO);
  };
  //AIzaSyCmR8S151uu3BTA7Mgtpl6-TBA3_U8HjGQ
  if (location.latitude && location.longitude) {
    return (
      <LoadScript googleMapsApiKey="AIzaSyCxaRbEHBInFto-cnzDgPzqZuaVmllksOE">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={{ lat: location.latitude, lng: location.longitude }}
          zoom={14}
        >
          <Marker 
            position={{ lat: location.latitude, lng: location.longitude }} 
            draggable={true}  // Hacer que el marcador sea arrastrable
            onDragEnd={onMarkerDragEnd} />
        </GoogleMap>
      </LoadScript>
    );
  }
  return <p>Loading...</p>;
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
  // También puedes usar useEffect para actualizar el estado cuando el componente se monta
  // useEffect(() => {
  //   setFechaIni(new Date()); // Esta línea es opcional si ya lo haces directamente en useState
  // }, []);

  const mCambio = (event) => {
    setPlantas(event.target.value);
    getCostoPlanta(event.target.value);
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
        <CCol xs={6} md={4} lg={4}>
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol xs={6} md={4} lg={4}>
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
      </CRow>
      <StepWizard>
        <Step1 fijos={dFijos} corpo={dCorpo} mop={dMop} cdiesel={dDiesel} sucursal={plantasSel} />
        <Step2 fuente={aFuente} segmento={aSegmento} canal={aTC} productos={aProducto} />
        <Step3 />
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
const Step1 = ({ nextStep, fijos, corpo, mop, cdiesel, sucursal }) => {
  const [visible, setVisible] = useState(false);// Modal Cargando
  const [vProspecto, setVProspecto] = useState(false);// Modal Cargando
  const [noCliente, setNoCliente] = useState('');
  const [cliente, setCliente] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [contacto, setContacto] = useState('');
  const [noObra, setNoObra] = useState('');
  const [obra_, setObra] = useState('');
  const [oDir, setObraDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [swValue, setswValue] = useState(false);
  const [dProspecto, setProspectoD] = useState([]);
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda

  const handleChange = selectedOption => {
    setSelectedCity(selectedOption);
  };
  const verCliente = async() =>{
    setLoading(true);
    setVisible(true); // Muestra el modal de carga

  }
  const vCliente = async() =>{
    setLoading(true);
    setVisible(true); // Muestra el modal
    try {
      const cliente = await getClientesCot(sucursal, noCliente);
      if (cliente) {
        const objCliente = cliente;
        setCliente(objCliente[0].Nombre);
        setMunicipio(objCliente[0].Municipio);
        
      } else {
          Swal.fire("Error", "Sin datos", "error");
      }
    } catch (error) {
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  
  const onFindCliente = (e) => {
    setNoCliente(e.target.value); // Actualiza el texto del filtro
  };
  const vObra = async() =>{
    setLoading(true);
    setVisible(true); // Muestra el modal de carga
    try {
      const obra = await getObrasCot(sucursal, noObra);
      if (obra) {
        const objObra = obra;
        setObra(objObra[0].Obra);
        setObraDir(objObra[0].Direccion);
      } else {
          Swal.fire("Error", "Sin datos", "error");
      }
    } catch (error) {
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }

  const onFindObra = (e) => {
    setNoObra(e.target.value); // Actualiza el texto del filtro
  };
  const onHandlerContacto = (e) => {
    setContacto(e.target.value);
  };
  const handleSwitchChange = (e) => {
    setswValue(e.target.checked);
    if(e.target.checked){
      setVProspecto(true);
      gainPro();
    }
  }
  const gainPro = async() =>{
    try {
        const dProspectos = await getProspectos_();
        if (dProspectos) { 
          setProspectoD(dProspectos);
        } else {
            Swal.fire("Error", "Sin Datos", "error");
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }

  const setProspecto = (nom, obra) => {
    setVProspecto(false);
    setCliente(nom)
    setObra(obra)
  }
  const columnsPro = [
    {
        name: 'Acciones',
        selector: row => row.id,
        width:"80px",
        cell: (row) => (
            <div>
                <CButton
                    color="primary"
                    onClick={() => setProspecto(row.Cliente, row.Obra)}
                    size="sm"
                    className="me-2"
                    title="Detalle"
                >
                    <CIcon icon={cilPlus} />
                </CButton>
            </div>
        ),
    },{
        name: 'Id',
        selector: row => row.id,
        width:"80px",
    },{
        name: 'ID Prospecto',
        selector: row => row.tkProspecto,
        sortable: true,
        grow: 1,
        width:"150px",
    },
    {
      name: 'Número Cliente',
      width:"150px",
      selector: row => row.NCliente,
    },
    {
        name: 'Número Obra',
        width:"150px",
        selector: row => row.NObra,
    },
    {
      name: 'Nombre Prospecto',
      width:"150px",
      selector: row => row.Cliente,
    },
    {
      name: 'Obra',
      width:"150px",
      selector: row => row.Obra,
    },
    {
      name: 'Municipio',
      width:"150px",
      selector: row => row.Municipio,
    },
  ];
  const getProspectos = async () => {
    try {
        const prospectos = await getProspectos_();
        if (prospectos) {
            setProspectoD(prospectos); 
        } else {
            Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  };
  // Filtrar datos en función del texto de búsqueda
  const filteredData = dProspecto.filter(item => {
    return item.Cliente.toLowerCase().includes(fText.toLowerCase()) || item.Obra.includes(fText);
  });
  // Lógica de filtro
  const onFilter = (e) => {
    setFText(e.target.value); // Actualiza el texto del filtro
};
  return(
    <div>
      <CCard>
        <CCardHeader>Paso 1</CCardHeader>
        <CCardBody>
          <CRow className='mt-2'>
          <CCol xs={4} md={2} lg={2}>
            <label>Datos</label>
            <p>Opción 1</p>
          </CCol>
          <CCol xs={4} md={2} lg={2}>
            <label>Fijos</label>
            <p><b>{formatCurrency(fijos)}</b></p>
          </CCol>
          <CCol xs={4} md={2} lg={2}>
            <label>Corporativo</label>
            <p><b>{formatCurrency(corpo)}</b></p>
          </CCol>
          <CCol xs={4} md={2} lg={2}>
            <label>MOP</label>
            <p><b>{formatCurrency(mop)}</b></p>
          </CCol>
          <CCol xs={8} md={4} lg={4}>
            <label>Costo de Diesel / Tiempo de Ciclo</label>
            <p><b>{formatCurrency(cdiesel)}</b></p>
          </CCol>
        </CRow>
        <hr />
        <CRow className='mt-2 mb-2'>
            <CCol xs={12} md={6} lg={6}>
              <CRow>
                <CCol xs={6} md={6} lg={6}>
                  <label>Cliente</label>
                  <CInputGroup className="mb-3">
                  <CFormInput placeholder="" value={noCliente} onChange={onFindCliente} aria-label="Example text with two button addons"/>
                    <CButton type="button" color="success" className='btn-primary' onClick={vCliente} style={{'color':'white'}} variant="outline">
                      <CIcon icon={cilSearch} className="me-2" />
                    </CButton>
                  </CInputGroup>    
                </CCol>
                <CCol xs={6} md={4} lg={4}>
                  <label>Obra</label>
                  <CInputGroup className="mb-3">
                  <CFormInput placeholder="" value={noObra} onChange={onFindObra} aria-label="Example text with two button addons"/>
                    <CButton type="button" color="success" className='btn-primary' onClick={vObra} style={{'color':'white'}} variant="outline">
                      <CIcon icon={cilSearch} className="me-2" />
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCol>
            <CCol xs={6} md={6} lg={6}>
              <CRow>
                <CCol xs={6} md={6} lg={6}>
                  <label>Cliente</label><br />
                  <label id='lblCliente'>{cliente}</label>
                </CCol>
                <CCol xs={6} md={6} lg={6}>
                  <label>Obra</label><br />
                  <label id='lblObra'>{obra_}</label>
                </CCol>
              </CRow>
            </CCol>
        </CRow>
        <CRow className='mt-2 mb-2'>
          <CCol xs={6} md={6} lg={6}>
              <CFormSwitch size="xl" label="Prospecto" id="cmbProspecto" checked={swValue} onChange={handleSwitchChange} />
          </CCol>
          <CCol xs={6} md={6} lg={6}>
              <CButton className='btn btn-sm btn-success' style={{'color':'white'}} onClick={verCliente}> VER CLIENTE <CIcon icon={cilSearch} className='me-2' /></CButton>
          </CCol>
        </CRow>
        <CRow className='mt-2 mb-2'>
          <CCol>
            <MyMap />
          </CCol>
        </CRow>
        <CModal
                backdrop="static"
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="stitle">Datos Cliente</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                      <CCol xs={12} md={12} className='mt-2 mb-2'>
                        <CFormInput type="text" placeholder="Nombre" value={cliente} aria-label="Nombree"/>
                      </CCol>
                      <CCol xs={12} md={12} className='mt-2 mb-2'>
                        <CFormInput type="text" placeholder="Municipio" value={municipio} aria-label="Nombree"/>
                      </CCol>
                      <CCol xs={12} md={12} className='mt-2 mb-2'>
                        <CFormInput type="text" placeholder="Contacto" value={contacto} onChange={onHandlerContacto} aria-label="Nombree"/>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={12} md={12} className='mt-2 mb-2'>
                        <h3>Datos de la Obra</h3>
                      </CCol>
                      <CCol xs={12} md={12} className='mt-2 mb-2'>
                        <CFormInput type="text" placeholder="Nombre" value={obra_} aria-label="Nombree"/>
                      </CCol>
                      <CCol xs={12} md={12} className='mt-2 mb-2'>
                        <CFormInput type="text" placeholder="Dirección" value={oDir} aria-label="Nombree"/>
                      </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                  <CRow className='w-100'>
                    <CCol xs={6} md={6}>
                      <CButton className='btn btn-primary' style={{'color':'white'}}>Aceptar <CIcon icon={cilCheck} className='me-2' /></CButton>
                    </CCol>
                    <CCol xs={6} md={6}>
                      <CButton className='btn btn-danger' onClick={() => setVisible(false)} style={{'color':'white'}}>Cerrar <CIcon icon={cilX} className='me-2' /></CButton>
                    </CCol>
                  </CRow>
                </CModalFooter>
        </CModal>
        <CModal
            backdrop="static"
            visible={vProspecto}
            onClose={() => setVProspecto(false)}
            aria-labelledby="sb"
            className='c-modal'
        >
          <CModalHeader>
              <CModalTitle id="stitle">Datos Prospecto</CModalTitle>
          </CModalHeader>
          <CModalBody>
              <CRow>
                <CCol xs={12} md={12} className='mt-2 mb-2'>
                  <CCol xs={6} md={4} lg={4}>
                    <CInputGroup className="mb-3 mt-3">
                        <CFormInput 
                            id='search'
                            type='text'
                            placeholder='Buscar'
                            aria-label='Buscar...'
                            value={fText}
                            onChange={onFilter}  
                        />
                        <CButton type="button" color="primary" id="button-addon1">Buscar</CButton>
                    </CInputGroup>
                </CCol>
                  <DataTable
                  columns={columnsPro}
                  data={filteredData}  // Usamos los datos filtrados
                  pagination
                  persistTableHead
                  subHeader
                  />
                </CCol>
              </CRow>
          </CModalBody>
          <CModalFooter>
            <CRow className='w-100'>
              <CCol xs={6} md={6}>
                <CButton className='btn btn-danger' onClick={() => setVProspecto(false)} style={{'color':'white'}}>Cerrar <CIcon icon={cilX} className='me-2' /></CButton>
              </CCol>
            </CRow>
          </CModalFooter>
        </CModal>
        </CCardBody>
        <CCardFooter>
          <CRow className='mt-2 mb-2'>
            <CCol xs={3}>
              <button className='btn btn-success' onClick={nextStep}>Siguiente </button>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
    </div>
  );
};

const Step2 = ({ nextStep, previousStep, fuente, segmento, canal, productos }) => {
  const [dDetalle, setDataD] = useState([]); // Estado para almacenar los datos de Detalle
  const columns = [
          {
              name: 'Acciones',
              selector: row => row.Producto,
              width:"80px",
              cell: (row) => (
                  <div>
                      <CButton
                          color="primary"
                          onClick={() => getDetalle(1)}
                          size="sm"
                          className="me-2"
                          title="Detalle"
                      >
                          <CIcon icon={cilPlus} />
                      </CButton>
                  </div>
              ),
          },{
              name: 'M3',
              selector: 1.0,
              width:"40px",
          },{
              name: 'Producto',
              selector: row => row.Producto,
              sortable: true,
              grow: 1,
              width:"150px",
          },
          {
              name: 'Descripcion',
              width:"150px",
              selector: row => row.Descripcion,
          },
          {
            name: 'Cemento',
            width:"150px",
            selector: row => row.CPC,
          },
          {
            name: 'Agua',
            width:"150px",
            selector: row => row.H2O,
          },
          {
            name: 'Gravas',
            width:"150px",
            selector: row => row.GRAVAS,
          },
          {
            name: 'Arenas',
            width:"150px",
            selector: row => row.ARENAS,
          },
          {
            name: 'Aditivos',
            width:"150px",
            selector: row => row.ADITIVOS,
          },
          {
            name: 'Costo MP',
            width:"150px",
            selector: row => row.COSTO,
          },
          {
            name: 'MB Mínimo',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Costo Total',
            width:"150px",
            selector: row => row.COSTO,
          },
          {
            name: 'M3 Bomba',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Precio Bomba',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Extras',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Importe Extras',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Precio Sugerido + Extras',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Precio Sugerido m3',
            width:"150px",
            selector: 0.00,
          },
          {
            name: '% Venta',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Comisión',
            width:"150px",
            selector: 0.00,
          },
          {
            name: 'Margen Bruto',
            width:"150px",
            selector: 0.00,
          },
  ];
  const [sOProductos, setOProductos] = useState([]);
  
  const sProductos = (selected) =>{
    setOProductos(selected);
    if (Array.isArray(selected)) {
      // Selección múltiple
      const selectedValues = selected.map(option => option.value);
      getFindPro(selectedValues[selectedValues.length-1]);
    } else {
      // Selección única
      console.log('Valor seleccionado:', selected.value);
    }
    
  }

  function getFindPro(pro)
  {
    const productoBuscado = productos.filter(producto => producto.Producto === pro);
    console.log(productoBuscado)
    setDataD(productoBuscado)
  }

  const oProductos = productos.map(item => ({
    value:item.Producto,
    label:item.Producto
  }))
  const [visible, setVisible] = useState(false)
  return(
    <div>
      <CCard>
        <CCardHeader>Paso 2</CCardHeader>
        <CCardBody>
          <CRow className='mt-2'>
            <CCol xs={6} md={4}>
              <CFormSelect aria-label="Fuente">
                <option>-</option>
                {fuente.map((item, index) => (
                  <option key={index} value={item.IdFuente}>{item.Descripcion}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4}>
              <CFormSelect aria-label="Segmento">
                <option>-</option>
                {segmento.map((item, index) => (
                  <option key={index} value={item.IdSegmento}>{item.Descripcion}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4}>
              <CFormSelect aria-label="Tipo de Cliente">
                <option>-</option>
                {canal.map((item, index) => (
                  <option key={index} value={item.IdCanal}>{item.Descripcion}</option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className='mt-2 mb-2'>
            <CCol xs={4} md={4} className='mt-3'>
              <CButton color="primary">Limpiar</CButton>
            </CCol>
            <CCol xs={4} md={4} className='mt-3'>
              <CButton color="primary">Exportar</CButton>
            </CCol>
            <CCol xs={1} md={4} className='mt-3'>
              <CButton color="success">Guardar</CButton>
            </CCol>
          </CRow>
          <CRow className='mt-2 mb-2'>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>Concreto</label>
              <CFormSelect aria-label="Concreto">
                <option>-</option>
                <option value="C">Convencionales</option>
                <option value="E">Estructurales</option>
                <option value="R">Altas Resistencias</option>
                <option value="MR">Pavimentos</option>
                <option value="B">Baja Contracción</option>
                <option value="A">Auto-Compactables</option>
                <option value="M">Morteros</option>
                <option value="L">Ligeros</option>
                <option value="F">Rellenos Fluidos</option>
                <option value="G">Ecológicos</option>
                <option value="Q">Arquitectónicos</option>
                <option value="D">Durables</option>
                <option value="FL">Relleno Ligero</option>
                <option value="O">Otros</option>
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>Resistencia</label>
              <CFormSelect aria-label="Resistencia">
                <option>-</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="38">38</option>
                <option value="40">40</option>
                <option value="42">42</option>
                <option value="45">45</option>
                <option value="48">48</option>
                <option value="50">50</option>
                <option value="55">55</option>
                <option value="60">60</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
                <option value="80">80</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="200">200</option>
                <option value="250">250</option>
                <option value="275">275</option>
                <option value="300">300</option>
                <option value="350">350</option>
                <option value="400">400</option>
                <option value="450">450</option>
                <option value="500">500</option>
                <option value="550">550</option>
                <option value="600">600</option>
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>Edad</label>
              <CFormSelect aria-label="Edad">
                <option>-</option>
                <option value="1">1 Día</option>
                <option value="3">3 Días</option>
                <option value="7">7 Días</option>
                <option value="R">14 Días</option>
                <option value="N">28 Días</option>
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>Revenimiento</label>
              <CFormSelect aria-label="Revenimiento">
                <option>-</option>
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="22">22</option>
                <option value="66">66</option>
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>TMA</label>
              <CFormSelect aria-label="TMA">
                <option>-</option>
                <option value="05">05</option>
                <option value="08">08</option>
                <option value="10">10</option>
                <option value="13">13</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="40">40</option>
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>Colocación</label>
              <CFormSelect aria-label="Colocación">
                <option>-</option>
                <option value="D">Directo</option>
                <option value="B">Bombeado</option>
                <option value="L">Lanzado</option>
              </CFormSelect>
            </CCol>
            <CCol xs={6} md={4} className='mt-3 mb-3'>
              <label>Producto</label>
              <Select
                className='sStyle'
                styles={{'color':'black'}}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={oProductos}
                onChange={sProductos}
              />
            </CCol>
          </CRow>
          <CRow>
              <CCol xs={12} md={12}>
                <DataTable
                  columns={columns}
                  data={dDetalle}  // Usamos los datos filtrados
                  pagination
                  persistTableHead
                  subHeader
                />
              </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow className='mt-2 mb-2'>
            <CCol xs={4} md={4}>
              <button className='btn btn-warning' onClick={previousStep}>Anterior</button>
            </CCol>
            <CCol xs={6} md={6}>
              <button className='btn btn-success'>Finalizar</button>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
    </div>
  )
};

const Step3 = ({ previousStep }) => {
  return(
    <div>
      <CCard>
        <CCardHeader>Paso 3</CCardHeader>
        <CCardBody>
          <CRow className='mt-3'>
            <CCol xs={12}>
              
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow>
            <CCol xs={6} md={6}>
              <button className='btn btn-warning' onClick={previousStep}>Anterior</button>
            </CCol>
            <CCol xs={6} md={6}>
              <button className='btn btn-success'>Finalizar</button>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
    </div>
  )
};
//-------------------------------------------------------------------------------------------------------------------------------------
export default Cotizador