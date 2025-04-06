import React, { useEffect,useState } from "react";
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import '../../estilos.css';
import '../ventas/ObjCom/AddObjCom.css'
import Plantas from '../base/parametros/Plantas'
import Periodo from '../base/parametros/Periodo'
import Mes from '../base/parametros/Mes'
import { formatResult, fNumberCad, fNumber,getVendedores, GetObjComGen } from '../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilAvTimer, cilCloudDownload, cilEyedropper, cilPen, cilPlus, cilSave, cilSearch, cilTrash } from '@coreui/icons'
function RObjCom() {
  // ------------------------------------------------------------------------------------------------------------------------
  // ESTADOS
  // ------------------------------------------------------------------------------------------------------------------------
  // Campos principales
  const [plantasSel , setPlantas] = useState('');
  const [periodoSel , setPeriodoB] = useState('');
  const [mesSel , setMesB] = useState('');
  const [totalPM3 , setTotalPM] = useState(0);
  const [totalPIm , setTotalPI] = useState(0);
  const [showP, setShowP] = useState(false);
  const [showDT, setShowDT] = useState(false);
  const [showDTP, setShowDTP] = useState(false);
  // ARRAYS
  const [arrAsesores, setAsesores] = useState([]);
  const [dtObjCom, setDTObjCom] = useState([]);
  const [dtObjAss, setDTAss] = useState([]);
  const [agrupado, setAgrupado] = useState([]);
  // Graficas
  const [gData, setgData] = useState({
    labels: [],
    datasets: [
      {
        label: 'M3',
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#000B0D','#2E038C'],
      },
    ],
  });
  const [gDataI, setgDataI] = useState({
    labels: [],
    datasets: [
      {
        label: 'Importe',
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#000B0D','#2E038C'],
      },
    ],
  });
  const [gDataAsr, setgDataAsr] = useState({
    labels: [],
    datasets: [
      {
        label: 'Asesor',
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#000B0D','#2E038C'],
      },
    ],
  });
  const [gDataAsrP, setgDataAsrP] = useState({
    labels: [],
    datasets: [
      {
        label: 'Asesor Importe',
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#000B0D','#2E038C'],
      },
    ],
  });
  //----------------------------- USE EFFECT ---------------------------------------------------------------------------------
  useEffect(() => {
    const labels = [];
    const dataSet = [];
    const dataSetR = [];
    var totalC = 0;
    var totalI = 0;
    agrupado.forEach(item => {
      if (item.TotalCantidad !== null && !(typeof item.TotalCantidad === 'object' && Object.keys(item.TotalCantidad).length === 0) && item.Planta != "BMD1") {
        totalC += item.TotalCantidad;
        totalI += item.TotalImporte;
        labels.push(item.Planta);
        dataSet.push(fNumberCad(item.TotalCantidad));
        dataSetR.push(item.TotalImporte);
      }
    });
    // Actualiza el estado con los nuevos datos
    setgData({
      labels: labels,
      datasets: [
        {
          label: ' Total Cantidad M3',
          data: dataSet,
          backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#000B0D','#2E038C'],
        },
      ],
    });
    setgDataI({
      labels: labels,
      datasets: [
        {
          label: ' Total Importe',
          data: dataSetR,
          borderWidth:1,
          backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#000B0D','#2E038C'],
          borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
        }
      ],
    });
  }, [agrupado]);
  useEffect(() => {
    const agrupado = dtObjAss.reduce((acc, item) => {
      if (!acc[item.GrupoVendedor]) {
        acc[item.GrupoVendedor] = {
          GrupoVendedor: item.GrupoVendedor,
          Vendedor:item.Vendedor,
          TotalCantidad: 0,
          TotalImporte: 0,
          Transacciones: 0,
          ProductosVendidos: new Set()
        };
      }
      acc[item.GrupoVendedor].TotalCantidad += item.TotalCantidad;
      acc[item.GrupoVendedor].TotalImporte += item.Importe;
      acc[item.GrupoVendedor].Transacciones += 1;
      acc[item.GrupoVendedor].ProductosVendidos.add(item.Producto);
      return acc;
    }, {});
    const resultado = Object.values(agrupado).map(item => ({
      ...item,
      ProductosUnicos: item.ProductosVendidos.size
    }));
    console.log(resultado)
    const labels = [];
    const dataSet = [];
    const dataSetI = [];
    let totalM3 = 0;
    let totalIm = 0;
    resultado.forEach(item => {
      if (item.TotalCantidad !== null && !(typeof item.TotalCantidad === 'object' && Object.keys(item.TotalCantidad).length === 0)) {
        totalM3 += item.TotalCantidad;
        totalIm += item.TotalImporte;
        labels.push(item.Vendedor);
        dataSet.push(fNumberCad(item.TotalCantidad));
        dataSetI.push(fNumberCad(item.TotalImporte));
      }
    });
    setTotalPM(totalM3);
    setTotalPI(fNumber(totalIm));
    setgDataAsr({
      labels: labels,
      datasets: [
        {
          label: ' Total Cantida M3',
          data: dataSet,
          borderWidth:1,
          backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
        }
      ],
    });
    setgDataAsrP({
      labels: labels,
      datasets: [
        {
          label: ' Total Importe',
          data: dataSetI,
          borderWidth:1,
          backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
        }
      ],
    });
  }, [dtObjAss]);
  //------------------------------ FUNCIONES ---------------------------------------------------------------------------------
  const mCambio = (event) => {
    const pla = event.target.value; 
    if(pla != "")
    {
      getVendedores_(pla);
      setPlantas(pla);
      setShowDT(false);
      setShowDTP(true);
      fPPlanta(pla);
    }else{
      setShowDT(true);
      setShowDTP(false);
      setPlantas("")
    }
  };
  const mMes = (event) => {
      setMesB(event.target.value);
  };
  const mPeriodo = (event) => {
      setPeriodoB(event.target.value);
  };
  //-------------------------------------------------------------------------------------------------------------------------
  const getObjCom = async () => {
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    try{
      const pla = plantasSel != '' ? plantasSel:'-';
      const ocList = await GetObjComGen(fNumberCad(mesSel),periodoSel);
      Swal.close();  // Cerramos el loading
      setDTObjCom(ocList);
      const agrupadoPorPlanta = ocList.reduce((acc, item) => {
        if (!acc[item.Planta]) {
          acc[item.Planta] = {
            Planta: item.Planta,
            TotalCantidad: 0,
            TotalImporte: 0
          };
        }
        acc[item.Planta].TotalCantidad += item.TotalCantidad;
        acc[item.Planta].TotalImporte += item.Importe;
        return acc;
      }, {});
      setAgrupado(Object.values(agrupadoPorPlanta));
      setShowP(true);
      setShowDT(true);
    }catch(error){
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  };
  const getVendedores_ = async(p)=>{
    try{
      const ocList = await getVendedores(p);
      if(ocList)
      {
        setAsesores(ocList)
      }
    }catch(error){
        console.log("Ocurrio un problema cargando Plantas....")
    }
  };
  const fPPlanta = async (pla) => {
    try{
      const datosFiltrados = dtObjCom.filter(item => item.Planta === pla);
      setDTAss(Object.values(datosFiltrados));
    }catch(error){
      console.log(error)
      setShowDT(true);
      setShowDTP(false);
    }
  };
  // ------------------------------------------------------------------------------------------------------------------------
  // FUNCIONES DE AUTOCOMPLETADO
  // ------------------------------------------------------------------------------------------------------------------------
  const hOnSearch = (string, results) => {
    if(results.length == 0){
        //setMostrarDataTable(false);
    }
  };
  const hOnSelect = (item) =>{
    setAsesor(item.id);
  };
  // ------------------------------------------------------------------------------------------------------------------------
  // FUNCIONES DE BÚSQUEDA Y GUARDAR
  // ------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------
  // RENDERIZADO
  // ------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <CContainer fluid>
        <h3>Objetivos Comerciales </h3>
        <CRow className='mt-3 mb-3'>
          <CCol xs={6} md={2}>
            <Mes
              mMes={mMes}
              mesSel={mesSel}
              className="input"
            />
          </CCol>
          <CCol xs={6} md={2}>
            <Periodo
              mPeriodo={mPeriodo}
              periodoSel={periodoSel}
            />
          </CCol>
          {showP && (
            <>
              <CCol xs={6} md={2}>
                <Plantas  
                  mCambio={mCambio}
                  plantasSel={plantasSel}
                />
              </CCol>
              {/* <CCol xs={6} md={3}>
                <label>Asesor</label>
                <ReactSearchAutocomplete
                  items={arrAsesores}
                  onSearch={hOnSearch}
                  onSelect={hOnSelect}
                  autoFocus
                  formatResult={formatResult}
                />
              </CCol> */}
            </>
          )}
          <CCol xs={6} md={2} lg={2} className='mt-4'>
            <CButton color='primary' onClick={getObjCom} style={{'color':'white'}} > 
              <CIcon icon={cilSearch} />
              Buscar
            </CButton>
          </CCol>
        </CRow>
        {showDT && (
          <CRow className="mt-3 mb-3">
            <CCol xs={6} md={6}>
              <CCard className="mb-4">
                <CCardHeader>M3</CCardHeader>
                <CCardBody>
                  <CChart
                    type="bar"
                    data={gData}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6} md={6}>
              <CCard className="mb-4">
                <CCardHeader>Importe $ </CCardHeader>
                <CCardBody>
                  <CChart
                    type="bar"
                    data={gDataI}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}
        {showDTP && (
          <CRow className="mt-3 mb-3">
            <CCol xs={6} md={6}>
              <CCard className="mb-4">
                <CCardHeader>
                  <CRow>
                    <CCol xs={9} md={9}>
                      M3
                    </CCol>
                    <CCol xs={3} md={3}>
                      Total:{fNumber(totalPM3)}
                    </CCol>
                  </CRow>
                  </CCardHeader>
                <CCardBody>
                  <CChart
                    type="pie"
                    data={gDataAsr}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6} md={6}>
              <CCard className="mb-4">
                <CCardHeader>
                  <CRow>
                    <CCol xs={8} md={8}>
                      Importe
                    </CCol>
                    <CCol xs={4} md={4}>
                      Total:{totalPIm}
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  <CChart
                    type="pie"
                    data={gDataAsrP}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}
      </CContainer>
    </>
  );
}

export default RObjCom;
