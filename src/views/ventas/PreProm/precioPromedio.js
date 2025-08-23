import React, {useEffect, useState, useMemo} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../../estilos.css';
import '../ObjCom/AddObjCom.css'
import BuscadorDT from '../../base/parametros/BuscadorDT'
import FechaI from '../../base/parametros/FechaInicio'
import FechaF from '../../base/parametros/FechaFinal'
import Mes from '../../base/parametros/Mes'
import { convertArrayOfObjectsToCSV, fNumber, GetPrecioProm, getPlantas } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CBadge,
    CButton,
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';

const PProm = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    const [planta, setDTPlantas] = useState('');
    const [mesSelAs , setMesBAs] = useState('');
    //----------- FILTROS -----------------------------------
    const [filtros, setFiltros] = useState({
      planta: '',
      tventa:'',
      concreto:'',
      resistencia:'',
      colocacion:'',
      producto: '',
      cliente: '',
      obra:'',
      vendedor:''
    });
    // FORM OBJ COM INDI
    const [TxtM3 , setM3] = useState(0);
    const [TxtImp , setImp] = useState(0);
    const [TxtPP , setPP] = useState(0);
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtPP, setDTPP] = useState([]);
    const [dtPrecioProm, setDTPreProm] = useState([]);
    const [dtCliente, setDTCliente] = useState([]);
    const [dtObra, setDTObra] = useState([]);
    const [dtVendedor, setDTVendedor] = useState([]);
    const [exOC, setExOc] = useState([]);
    // FROMS
    //************************************************************************************************************************************************************************** */
    const [showBE, setShowBE] = useState(false);
    const [showDT, setShowDT] = useState(false);
    //************************************************************************************************************************************************************************** */
    const [vFechaI, setFechaIni] = useState(() => {
      const fechaActual = new Date();
      fechaActual.setDate(1); // Establecer al primer día del mes
      return fechaActual;
    });     
    const [vFcaF, setFechaFin] = useState(new Date());
    //************************************************************************************************************************************************************************** */    
    useEffect(()=>{
      getPlantas_();
    },[])
    useEffect(() => {
      console.log(dtPP)
      const dtCliente = [...new Set(
        dtPrecioProm.map(item => item.Cliente)
      )];
      const dtObra = [...new Set(
        dtPrecioProm.map(item => item.Obra)
      )];
      const dtVendedor = [...new Set(
        dtPrecioProm.map(item => item.Vendedor)
      )];
      setDTCliente(dtCliente)  
      setDTObra(dtObra)
      setDTVendedor(dtVendedor)

    }, [dtPP]);

    const datosFiltrados = useMemo(() => {
      return dtPrecioProm.filter(item => {
        return (
          (filtros.planta === '' || item.Planta === filtros.planta) &&
          (filtros.tventa === '' || item.Venta === filtros.tventa) &&
          (filtros.concreto === '' || item.Familia === filtros.concreto) &&
          (filtros.resistencia === '' || item.Resistencia === filtros.resistencia) &&
          (filtros.colocacion === '' || item.Colocacion === filtros.colocacion) &&
          (filtros.producto === '' || item.Tipo === filtros.producto) &&
          (filtros.cliente === '' || item.Cliente === filtros.cliente) &&
          (filtros.obra === '' || item.Obra === filtros.obra) &&
          (filtros.vendedor === '' || item.Vendedor === filtros.vendedor)
        );
      });
    }, [dtPrecioProm, filtros]);
    
    useEffect(() => {
      if (datosFiltrados.length === 0) return;
      // Lógica aquí
      console.log("🔎 Nuevos datos filtrados:", datosFiltrados);
      let cantidad_ = 0;
      let importe_ = 0;
      let pp_ = 0;
      datosFiltrados.forEach((item) => {
        cantidad_ += item.Cantidad;
        importe_ += item.Importe;
      });
      setM3(fNumber(cantidad_.toFixed(2)))
      setImp(fNumber(importe_.toFixed(2)))
      pp_ = importe_ / cantidad_;
      setPP(fNumber(pp_.toFixed(2)))
    }, [datosFiltrados]);
    //************************************************************************************************************************************************************************** */
    const cFechaI = (fecha) => {
      const formattedDate = format(fecha, 'yyyy/MM/dd');
      setFechaIni(formattedDate);
    };
    const mFcaF = (fcaF) => {
      const auxFca = format(fcaF, 'yyyy/MM/dd');
      setFechaFin(auxFca);
    };
    const mMesAs = (event) => {
      setMesBAs(event.target.value);
    };
    const handleFiltroChange = (e) => {
      const { name, value } = e.target;
      setFiltros(prev => ({
        ...prev,
        [name]: value
      }));
    };
    //************************************************************************************************************************************************************************** */
    const getPProm_ = async () => {
      Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
      });
      try{
        const auxFcaI = format(vFechaI, 'yyyy-MM-dd');
        const auxFcaF = format(vFcaF, 'yyyy-MM-dd');
        const ocList = await GetPrecioProm(auxFcaI, auxFcaF);
        if(ocList)
        {
          setShowDT(true)
          setShowBE(true)
          setDTPP(ocList)
          setDTPreProm(ocList)
        }
        Swal.close();  // Cerramos el loading
      }catch(error){
        setShowDT(false)
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    };
    const getPlantas_ = async()=>{
      try{
        const ocList = await getPlantas();
        setDTPlantas(ocList)
      }catch(error){
        console.log(error)
      }
    }
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colPrePro = [
      {
        name: 'PLANTA',
        selector: row => {
            const aux = row.Planta;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: 'AÑO',
        selector: row => {
            const aux = row.Ejercicio;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"80px",
        sortable:true,
        grow:1,
      },
      {
        name: 'MES',
        selector: row => {
            const aux = row.Periodo;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"80px",
        sortable:true,
        grow:1,
      },
      {
        name: 'No. CLIENTE',
        selector: row => {
            const aux = row.NoCliente;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"140px",
        sortable:true,
        grow:1,
      },
      {
        name: 'CLIENTE',
        selector: row => {
            const aux = row.Cliente;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"260px",
        sortable:true,
        grow:1,
      },
      {
        name: 'No. OBRA',
        selector: row => {
            const aux = row.NoObra;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"120px",
        sortable:true,
        grow:1,
      },
      {
        name: 'OBRA',
        selector: row => {
            const aux = row.Obra;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"260px",
        sortable:true,
        grow:1,
      },
      {
        name: 'SEGMENTO',
        selector: row => {
            const aux = row.Segmento;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"120px",
        sortable:true,
        grow:1,
      },
      {
          name: 'VENDEDOR',
          selector: row => {
              const aux = row.Vendedor;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"250px",
          sortable:true,
          grow:1,
      },
      {
          name: 'PRODUCTO',
          selector: row => {
              const aux = row.Producto;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"160px",
          sortable:true,
          grow:1,
      },
      {
          name: 'DESCRIPCIÓN',
          selector: row => {
              const aux = row.Descripcion;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"350px",
          sortable:true,
          grow:1,
      },
      {
        name: 'CANTIDAD',
        selector: row => {
            const aux = row.Cantidad;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"120px",
        sortable:true,
        grow:1,
      },
      {
        name: 'IMPORTE',
        selector: row => {
            const aux = row.Importe;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return fNumber(aux);
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: 'PRECIO PROMEDIO',
        selector: row => {
            const aux = row.PrecioProm;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return <h6><b>{fNumber(aux)}</b></h6>;
        },
        width:"160px",
        sortable:true,
        grow:1,
      },
      {
        name: 'COSTO',
        selector: row => {
            const aux = row.Costo;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return fNumber(aux);
        },
        width:"120px",
        sortable:true,
        grow:1,
      },
      {
        name: 'MARGEN BRUTO',
        selector: row => {
            const aux = row.MargenBruto;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return fNumber(aux);
        },
        width:"160px",
        sortable:true,
        grow:1,
      },
      {
        name: 'COSTO + MB',
        selector: row => {
            const aux = row.Costo;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return <h6><b>{fNumber(aux)}</b></h6>;
        },
        width:"160px",
        sortable:true,
        grow:1,
      },
      {
        name: 'MARGEN BRUTO $',
        selector: row => {
            const aux = row.MargenBruto;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return <h6><b>{fNumber(aux)}</b></h6>;
        },
        width:"160px",
        sortable:true,
        grow:1,
      },
      {
        name: 'MARGEN BRUTO %',
        selector: row => {
            let mb = row.MargenBruto;
            let pp = row.PrecioProm;
            let banderaMB = row.BanderaMB;
            let aux = (mb && pp) ? (mb / pp) * 100 : null;
            if (aux === null || aux === undefined || typeof aux === 'object') {
              return <span style={{ color: 'gray' }}>No disponible</span>;
            }
            // Color según el valor
            let color = 'black';
            let colorb = 'black';
            if(banderaMB == 'V')
            {
              colorb = 'green';
              color = 'white';
            }
            else if(banderaMB == 'A')
            {
              colorb = 'yellow'
              color = 'black'
            }
            else
            {
              colorb = 'red'
              color = 'white'
            }
            return (
              <h4><CBadge style={{ color: color,background:colorb }}>
                {fNumber(aux.toFixed(2))}%
              </CBadge></h4>
            );
        },
        width:"160px",
        sortable:true,
        grow:1,
      },
    ];
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtPP.filter(dtPP => 
              dtPP.Planta.includes(vBPlanta)
            );
            setDTPP(valFiltrados);
        }else{
          getPProm_()
        }
    };
    const fBPP = dtPP.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.Periodo.includes(fText) || item.Ejercicio.includes(fText) || item.Cliente.includes(fText)
        || item.Obra.includes(fText) || item.Segmento.includes(fText) || item.Vendedor.includes(fText);
    });
    //************************************************************************************************************************************************************************************** */
    
    //************************************************************************************************************************************************************************************** */
    const downloadCSV = (e) => {
      const auxFcaI = format(vFechaI, 'yyyy-MM-dd');
      const auxFcaF = format(vFcaF, 'yyyy-MM-dd');
      const link = document.createElement('a');
      let csv = convertArrayOfObjectsToCSV(datosFiltrados);
      if (csv == null) return;
  
      const filename = 'PP_'+auxFcaI+'_'+auxFcaF+'.csv';
  
      if (!csv.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
      }
  
      link.setAttribute('href', encodeURI(csv));
      link.setAttribute('download', filename);
      link.click();
    };
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Precios Promedio </h3>
            <CRow className='mt-3 mb-3'>
                <CCol xs={6} md={2}>
                  <FechaI 
                    vFechaI={vFechaI} 
                    cFechaI={cFechaI} 
                  />
                </CCol>
                <CCol xs={6} md={2}>
                  <FechaF 
                    vFcaF={vFcaF} 
                    mFcaF={mFcaF}
                  />
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                  <CButton color='primary' onClick={getPProm_} style={{'color':'white'}} > 
                    <CIcon icon={cilSearch} />
                    Buscar
                  </CButton>
                </CCol>
                {showBE && (
                <>
                  <CCol xs={12} md={2}>
                  <label>Planta</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" name="planta" onChange={handleFiltroChange}>
                          <option value="" >Selecciona...</option>
                          {planta.map((planta, index) => (
                            <option key={index} value={planta.Planta}>
                            {planta.Planta}
                            </option>
                          ))}
                        </CFormSelect>
                    </div>
                  </CCol>
                  <CCol xs={6} md={2}>
                    <label>Tipo Venta</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbTra" name="tventa" onChange={handleFiltroChange}>
                          <option value="" >Selecciona...</option>
                          <option value="N">Normal</option>
                          <option value="E">Especiales</option>
                        </CFormSelect>
                    </div>
                  </CCol>
                  <CCol xs={6} md={2} className='mt-4'>
                    <CButton color='danger' onClick={downloadCSV}>
                        <CIcon icon={cilCloudDownload} className="me-2" />
                        Exportar
                    </CButton>
                  </CCol>
                </>
                )}
            </CRow>
            {showBE && (
              <>
              <CRow className='mt-3 mb-3'>
                <CCol xs={6} md={2}>
                    <label>Concreto</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" name="concreto" onChange={handleFiltroChange}>
                          <option value="" >Selecciona...</option>
                          <option value="C">Convecionales</option>
                          <option value="E">Estructurales</option>
                          <option value="R">Altas Resistencia</option>
                          <option value="MR">Pavimentos</option>
                          <option value="B">Anti-Bacteriano</option>
                          <option value="A">Auto-Compactable</option>
                          <option value="M">Morteros</option>
                          <option value="L">Ligeros</option>
                          <option value="F">Rellenos Fluido</option>
                          <option value="G">Ecológicos</option>
                          <option value="Q">Arquitectónicos</option>
                          <option value="D">Durables</option>
                          <option value="FL">Relleno Liger</option>
                          <option value="O">Otros</option>
                        </CFormSelect>
                    </div>
                </CCol>
                <CCol xs={6} md={2}>
                    <label>Resistencia</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" name="resistencia" onChange={handleFiltroChange}>
                          <option value="" >Selecciona...</option>
                          <option value="38">38</option>
                          <option value="40">40</option>
                          <option value="48">48</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="150">150</option>
                          <option value="200">200</option>
                          <option value="250">250</option>
                          <option value="300">300</option>
                          <option value="350">350</option>
                          <option value="400">400</option>
                          <option value="450">450</option>
                        </CFormSelect>
                    </div>
                </CCol>
                <CCol xs={6} md={2}>
                    <label>Colocación</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" name="colocacion" onChange={handleFiltroChange}>
                          <option value="" >Selecciona...</option>
                          <option value="D">Directo</option>
                          <option value="B">Bombeado</option>
                        </CFormSelect>
                    </div>
                </CCol>
                <CCol xs={6} md={2}>
                    <label>Tipo Producto</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" name="producto" onChange={handleFiltroChange}>
                          <option value="" >Selecciona...</option>
                          <option value="C">Concreto</option>
                          <option value="B">Bombeo</option>
                          <option value="S">Servicio</option>
                          <option value="P">Bulto</option>
                          <option value="M">Materia prima</option>
                        </CFormSelect>
                    </div>
                </CCol>
              </CRow>
              <CRow className='mt-2 mb-2'>
                  <CCol xs={6} md={4}>
                      <label>Cliente</label>
                      <div className='mt-2'>
                          <CFormSelect aria-label="Selecciona" name="cliente" onChange={handleFiltroChange}>
                            <option value="" >Selecciona...</option>
                            {dtCliente.map((dtCliente, index) => (
                              <option key={index} value={dtCliente}>
                              {dtCliente}
                              </option>
                            ))}
                          </CFormSelect>
                      </div>
                  </CCol>
                  <CCol xs={6} md={4}>
                      <label>Obra</label>
                      <div className='mt-2'>
                          <CFormSelect aria-label="Selecciona" name="obra" onChange={handleFiltroChange}>
                            <option value="" >Selecciona...</option>
                            {dtObra.map((dtObra, index) => (
                              <option key={index} value={dtObra}>
                              {dtObra}
                              </option>
                            ))}
                          </CFormSelect>
                      </div>
                  </CCol>
                  <CCol xs={6} md={4}>
                      <label>Vendedor</label>
                      <div className='mt-2'>
                          <CFormSelect aria-label="Selecciona" name="vendedor" onChange={handleFiltroChange}>
                            <option value="" >Selecciona...</option>
                            {dtVendedor.map((dtVendedor, index) => (
                              <option key={index} value={dtVendedor}>
                              {dtVendedor}
                              </option>
                            ))}
                          </CFormSelect>
                      </div>
                  </CCol>
              </CRow>
              </>
            )} 
            <CRow className='mt-2 mb-2'>
              <CCol xs={6} md={3}>
                <CCol xs={12} md={12}>
                  <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
              </CCol>
              {showBE && (
                <>
                  <CCol xs={6} md={3} className='mt-3 mb-3'>
                    <label className='mt-3 mb-3'>M3:<h2><b>{TxtM3}</b></h2></label>
                  </CCol>
                  <CCol xs={6} md={3} className='mt-3 mb-3'>
                    <label className='mt-3 mb-3'>Importe:<h2><b>{TxtImp}</b></h2></label>
                  </CCol>
                  <CCol xs={6} md={3} className='mt-3 mb-3'>
                    <label className='mt-3 mb-3'>Precio Promedio:<h2><b>{TxtPP}</b></h2></label>
                  </CCol>
                </>  
              )}
            </CRow>
            {showDT && (
            <>
            <CRow className='mt-2 mb-2'>
                <CCol>
                  <DataTable
                      columns={colPrePro}
                      data={datosFiltrados}
                      pagination
                      persistTableHead
                      subHeader
                  />
                </CCol>
            </CRow>
            </>
            )}
            
            <CModal 
                backdrop="static"
                visible={vOC}
                onClose={() => setVOC(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_" className='tCenter'>Objetivo Comerical</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-4 mb-4'>
                      <CCol xs={6} md={3}>
                        <Mes
                          mMes={mMesAs}
                          mesSel={mesSelAs}
                          className="input"
                        />
                      </CCol>
                      
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> -
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <br />
        </CContainer>
    </>
    )
}
export default PProm
