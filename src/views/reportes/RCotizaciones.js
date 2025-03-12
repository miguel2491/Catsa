import React,{useEffect, useState, useRef} from 'react'
import classNames from 'classnames'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import { CChart, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs'
import {
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

import Plantas from '../base/parametros/Plantas'
import FechaF from '../base/parametros/FechaFinal'
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';
import { format } from 'date-fns';
import {FormatoFca} from '../../Utilidades/Tools.js'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const currentDate = new Date();

const PedidosMetro = () => {
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [visible, setVisible] = useState(false)
  //Fechas
  const[fDiaria, setfDiara] = useState(currentDate);
  const[rPSemana, setPSemana] = useState('-');
  const[rPSemanaP, setPSemanaP] = useState('-');
  const[rPMes, setPMes] = useState('-');
  

  const [vFcaF, setFechaFin] = useState(null);
  const [plantasSel , setPlantas] = useState('');
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  //Diario
  const [chartDataD, setChartDataD] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
      },
    ],
  });
  //Semana Actual
  const [chartDataS, setChartDataS] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  //Semana Proxima
  const [chartDataSP, setChartDataSP] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  //Mes en Curso
  const [chartDataM, setChartDataM] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  const mCambio = (event) => {
    setPlantas(event.target.value);
  };
  const getRepos = () =>{
    getDiario();
  }
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  useEffect(()=>{ 
    
  },[]);
  
  async function getDiario()
  {
    try
    {
      let confi_ax = {
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
        },
      };
      const fcaI = FormatoFca(vFcaF);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Comercial/GetRCotizacion/'+plantasSel+','+fcaI+',D', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      obj.forEach(item => {
        labels.push(item.UsuarioCreo+"-"+item.Estatus);
        dataSet.push(item.Total);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataD({
        labels: labels,
        datasets: [
          {
            data: dataSet,
            backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
          },
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        // clearInterval(interval); // Limpiar el intervalo
        // setLoading(false);
        // setPercentage(100); 
        // setVisible(false);
        getSemana()
    }
  }
  //setSemana
  async function getSemana()
  {
    try
    {
      let confi_ax = {
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
        },
      };
      const fcaI = FormatoFca(vFcaF);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Comercial/GetRCotizacion/'+plantasSel+','+fcaI+',S', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      console.log(obj)
      if(obj.length === 0)
      {
        setPSemana("Sin Datos");

      }else{
        const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
        setPSemana(rango);
        obj.forEach(item => {
          labels.push(item.UsuarioCreo+"-"+item.Estatus);
          dataSet.push(item.Total);
        });
        // Actualiza el estado con los nuevos datos
        setChartDataS({
          labels: labels,
          datasets: [
            {
              data: dataSet,
              backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
            },
          ],
        });
      }
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        getSemanaP()
    }
  }
  //getSemanaProxima
  async function getSemanaP()
  {
    try
    {
      let confi_ax = {
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
        },
      };
      const fcaI = FormatoFca(vFcaF);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Comercial/GetRCotizacion/'+plantasSel+','+fcaI+',SP', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      if(obj.length == 0)
      {
        setPSemanaP("Sin Datos");
      }else{
        const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
        setPSemanaP(rango);
        obj.forEach(item => {
          labels.push(item.UsuarioCreo+"-"+item.Estatus);
          dataSet.push(item.Total);
        });
        // Actualiza el estado con los nuevos datos
        setChartDataSP({
          labels: labels,
          datasets: [
            {
              data: dataSet,
              backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
            },
          ],
        });
      }      
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        getMes()
    }
  }
  //getMesActual
  async function getMes()
  {
    try
    {
      let confi_ax = {
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
        },
      };
      const fcaI = FormatoFca(vFcaF);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Comercial/GetRCotizacion/'+plantasSel+','+fcaI+',M', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPMes(rango);
      obj.forEach(item => {
        labels.push(item.UsuarioCreo+"-"+item.Estatus);
        dataSet.push(item.Total);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataM({
        labels: labels,
        datasets: [
          {
            data: dataSet,
            backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
          },
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        //getMes()
    }
  }
  return (
    <>
      <CContainer fluid>
        <h1>Reporte Cotizaciones</h1>
        <CRow>
          <CCol sm="auto">
            <FechaF 
              vFcaF={vFcaF} 
              mFcaF={mFcaF}
            />
          </CCol>
          <CCol sm="auto">
            <Plantas  
                mCambio={mCambio}
                plantasSel={plantasSel}
            />
          </CCol>
          <CCol sm="auto" className='mt-3'>
            <CButton color='primary' onClick={getRepos}>
                <CIcon icon={cilSearch} className="me-2" />
                Realizar
            </CButton>
            </CCol>
        </CRow>
        <CRow className='mt-4'>
            <CCol xs={12} md={6}>
                <CCard className="mb-4">
                    <CCardHeader>Por Día <b>{format(fDiaria, 'yyyy/MM/dd')}</b></CCardHeader>
                    <CCardBody>
                        <CChart
                          type='pie'
                          data={chartDataD}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={6}>
                <CCard className="mb-4">
                    <CCardHeader>Por Semana <b>{rPSemana}</b></CCardHeader>
                    <CCardBody>
                        <CChart
                          type='pie'
                          data={chartDataS}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={6}>
                <CCard className="mb-4">
                    <CCardHeader>Próxima Semana <b>{rPSemanaP}</b></CCardHeader>
                    <CCardBody>
                        <CChart
                          type='pie'
                          data={chartDataSP}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={6}>
                <CCard className="mb-4">
                    <CCardHeader>Mes en Curso <b>{rPMes}</b></CCardHeader>
                    <CCardBody>
                        <CChart
                          type='line'
                          data={chartDataM}
                        />
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

export default PedidosMetro
