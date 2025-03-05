import React, {useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import MyMap from './Mapa'
import { formatCurrency, getClientesCot, getObrasCot, getProspectos_, getIdVendedor } from '../../../Utilidades/Funciones';
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import {
  CRow,
  CCol,
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
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch, cilTrash, cilPlus } from '@coreui/icons'
import { Rol } from '../../../Utilidades/Roles'
import '../../../estilos.css'
import Cookies from 'universal-cookie'

const Step1 = ({ nextStep, idC, fijos, corpo, mop, cdiesel, sucursal, clientes_, obras_, coords, coordsPla, nCot, onUpdateFCData, onUpdateFData }) => {
  
  const cookies = new Cookies();
  const [visible, setVisible] = useState(false);// Modal Cargando
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [mMapa, setMMapa] = useState(false);
  const [vProspecto, setVProspecto] = useState(false);
  const [idVendedor, setIDvendedor] = useState('');
  const [noCliente, setNoCliente] = useState('');
  const [clienteTxt, setClienteTxt] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [contacto, setContacto] = useState('');
  const [noObra, setNoObra] = useState('');
  const [obraTxt, setObraTxt] = useState('');
  const [oDir, setObraDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [swValue, setswValue] = useState(false);
  const [dProspecto, setProspectoD] = useState([]);
  const [aObrasB, setObrasB] = useState([]);
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const userIsAsesor = Rol('Vendedor');
  const [mPos, setMPos] = useState([{latitud:0,longitud:0}]);
  const [mPosC, setMPosC] = useState([{latitud:0,longitud:0}]);
  //**************************************************************** */
  useEffect(() => {
      getIdVendedor_()
  }, []);
  //**************************************************************** */
  const getIdVendedor_ = async () => {
    try {
        const vendedor = await getIdVendedor();
        let idV = vendedor[0].CODIGOVENDEDOR
        if (idV) {  
          setIDvendedor(idV) 
        } else {
            Swal.fire("Error", "Comunicate con el área de sistemas para verificar tu código de Vendedor", "error");
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo obtener ID VENDEDOR", "error");
    }
  };
  const handleChange = selectedOption => {
    setSelectedCity(selectedOption);
    
  };
  const verCliente = async() =>{
    setLoading(true);
    setVisible(true); // Muestra el modal de carga

  };
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
  };
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
  //----------FIND CLIENTE ------------------------------  
  const hOnSearch = (string, results) => {
    if(results.length == 0){
        //setMostrarDataTable(false);
    }
  }
  const hOnSelect = (item) =>{
    setClienteTxt(item.name);
    const ncliente = {cliente:item.NoCliente};
    onUpdateFData({ cliente: item.NoCliente});
    getObras(item.NoCliente, sucursal);
    
  }
  const formatResult = (item) => {
    return (
        <>
        <span style={{ display: 'block', textAlign: 'left', color:'black' }}>{item.name}</span>
        </>
    )
  }
  const hOnSearchObras = (string, results) => {
    if(results.length == 0){
        //setMostrarDataTable(false);
    }
  }
  const hOnSelectObras = (item) =>{
    setObraTxt(item.name)
    setNoObra(item.idObra)
    onUpdateFData({ obra: item.name});
  }
  const hMakerPosCh = (newPosition) => {
    setMPos(newPosition)
  };
  const hMakerPosCCh = (newPosition) => {
    setMPosC(newPosition);
  };
  //-----------------------------------------------------
  async function getObras(cliente, sucursal)
  {
    setNoCliente(cliente)
    try{
      const obras = await getObrasCot(sucursal, cliente);
      if(obras){
          const obrasTransformados = obras.map((obras, index) => ({
              id: index,            // Asignar un ID único (en este caso, usamos el índice)
              name: obras.Obra, // Usamos la propiedad 'Producto' como 'name'
              idObra: obras.NoObra
          }));
          setObrasB(obrasTransformados);
      }
    }catch(error){
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const getMMap = ()=>{
    setMMapa(true)
  }
  const hnextStep = async() => {
    const cR = mPos[0].latitud+","+mPos[0].longitud;
    const cC = mPosC[0].latitud+","+mPosC[0].longitud;
    onUpdateFCData({ 
      idCotizacion:idC,
      planta:sucursal,
      noCliente:noCliente,
      noObra:noObra,
      Cliente:clienteTxt,
      Obra:obraTxt,
      Direccion:oDir,
      contacto:contacto,
      idVendedor:idVendedor,
      usuarioCreo:cookies.get('Usuario'),
      flagIVA:0,
      flagTotal:0,
      flagCondiciones:0,
      estatus:'Negociando',
      cotAnterior:'',
      fuente:null,
      coordenadaR: cR, 
      coordenada:cC, 
      flagObservaciones:0,
      segmento:null,
      canal:null
    });
    nextStep();
  }
  //-----------------------------------------------------
  return(
    <div>
      <CCard>
        <CCardHeader>Paso 1</CCardHeader>
        <CCardBody>
          {...(!userIsAsesor ? [
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
          ]:[])
          }
        <hr />
        <CRow className='mt-2 mb-2'>
          <CCol xs={12} md={6}>
            <label>Cliente</label>
            <ReactSearchAutocomplete
              items={clientes_}
              onSearch={hOnSearch}
              onSelect={hOnSelect}
              autoFocus
              formatResult={formatResult}
            />
          </CCol>
          <CCol xs={12} md={6}>
            <label>Cliente</label><br />
            <label id='lblCliente'>{clienteTxt}</label>
            <label></label>
          </CCol>
        </CRow>
        <CRow className='mt-2 mb-2'>
          <CCol xs={12} md={6}>
            <label>Obra:</label>
            <ReactSearchAutocomplete
                items={aObrasB}
                onSearch={hOnSearchObras}
                onSelect={hOnSelectObras}
                autoFocus
                formatResult={formatResult}
              />
          </CCol>
          <CCol xs={12} md={6}>
            <label>Obra</label><br />
            <label id='lblObra'>{obraTxt}</label>
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
            <MyMap coords={"0,0"} cordsPlanta={coordsPla} markerPositionO={mPos} markerPositionR={mPosC} onMarkerPositionO={hMakerPosCh} onMarkerPositionR={hMakerPosCCh} />
          </CCol>
        </CRow>
        <CRow className='mt-2 mb-2'>
          <CCol>
            {nCot != 0 && (
              <CButton color='primary' size='sm' onClick={getMMap}>Ver Ubicación Real</CButton>
            )}
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
                        <CFormInput type="text" placeholder="Nombre" value={clienteTxt} aria-label="Nombree"/>
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
                        <CFormInput type="text" placeholder="Nombre" value={obraTxt} aria-label="Nombree"/>
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
        <CModal
                backdrop="static"
                visible={mMapa}
                onClose={() => setMMapa(false)}
                className='c-modal'
            >
                <CModalHeader>
                    <CModalTitle id="stitle">Ubicación Origen</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                      <MyMap coords={"19.05258,-97.5896"} />
                      {/* {isScriptLoaded ? (
                        <MyMap coords={coords} />
                      ):(
                        <LoadScript googleMapsApiKey="AIzaSyCxaRbEHBInFto-cnzDgPzqZuaVmllksOE">
                          <MyMap coords={coords} />
                        </LoadScript>
                      )} */}
                    </CRow>
                </CModalBody>
                <CModalFooter>
                  <CRow className='w-100'>
                    <CCol xs={6} md={6}>
                      <CButton className='btn btn-danger' onClick={() => setMMapa(false)} style={{'color':'white'}}>Cerrar <CIcon icon={cilX} className='me-2' /></CButton>
                    </CCol>
                  </CRow>
                </CModalFooter>
        </CModal>
        </CCardBody>
        <CCardFooter>
          <CRow className='mt-2 mb-2'>
            <CCol xs={3}>
              <button className='btn btn-success' style={{'color':'white'}} onClick={hnextStep}>Siguiente </button>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
    </div>
  );
};
export default Step1;