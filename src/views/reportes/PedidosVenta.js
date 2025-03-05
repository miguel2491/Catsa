import React,{useEffect, useState, useRef} from 'react'
import classNames from 'classnames'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import { CChart, CChartPolarArea, CChartDoughnut } from '@coreui/react-chartjs'
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
import FechaI from '../base/parametros/FechaInicio'
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons';
import {FormatoFca} from '../../Utilidades/Tools.js'
import { format } from 'date-fns';

const cookies = new Cookies();
const baseUrl="https://apicatsa2.catsaconcretos.mx:2533/api/";
const baseUrl2="http://localhost:2548/api/";

const currentDate = new Date();

const PedidosVenta = () => {
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [visible, setVisible] = useState(false)
  const[fDiaria, setfDiara] = useState(currentDate);
  const[rPSemana, setPSemana] = useState('-');
  const[rPSemanaP, setPSemanaP] = useState('-');
  const[rPMes, setPMes] = useState('-');
  const [vFechaI, setFechaIni] = useState(null);
  const [plantasSel , setPlantas] = useState('');
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  //Chart
  const [chartDataD, setChartDataD] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#042940','#005C53'],
      },
    ],
  });
  const [chartDataS, setChartDataS] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#042940','#005C53'],
      },
    ],
  });
  const [chartDataPS, setChartDataPS] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#042940','#005C53'],
      },
    ],
  });
  const [chartDataM, setChartDataM] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#042940','#005C53'],
      },
    ],
  });
  const cFechaI = (fecha) => {
    const formattedDate = format(fecha, 'yyyy/MM/dd');
    setFechaIni(formattedDate);
};

const mCambio = (event) => {
    setPlantas(event.target.value);
};
  const getRepos = () =>{
    getRepsD();
  }

  useEffect(()=>{    
    
  },[]);


  async function getRepsD()
  {
    setVisible(!visible)
    setLoading(true);
    setPercentage(0);
    const interval = setInterval(() => {
        setPercentage(prev => {
        if (prev < 90) return prev + 10;
        return prev;
        });
    }, 1000);
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
      const fcaI = FormatoFca(vFechaI);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPVenta/'+fcaI+","+plantasSel+",D", confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      obj.forEach(item => {
        let usuario = item.UsuarioCreo + "("+item.TP+" Pedidos)";
        let tmetros = item.Metraje;
        labels.push(usuario);
        dataSet.push(tmetros);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataD({
        labels: labels,
        datasets: [
          {
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        //clearInterval(interval); // Limpiar el intervalo
        //setLoading(false);
        setPercentage(25); 
        getRepsS();
        //setVisible(false);
    }
  }
  async function getRepsS()
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
      const fcaI = FormatoFca(vFechaI);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPVenta/'+fcaI+","+plantasSel+",S", confi_ax);
      const obj = response.data[0].Rows;
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPSemana(rango);
      const labels = [];
      const dataSet = [];
      obj.forEach(item => {
        labels.push(item.UsuarioCreo+"("+item.TP+" Pedidos)");
        dataSet.push(item.Metraje);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataS({
        labels: labels,
        datasets: [
          {
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
        ],
      });
      console.log(obj)
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        setPercentage(50);
        getRepsPS(); 
    }
  }
  async function getRepsPS()
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
      const fcaI = FormatoFca(vFechaI);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPVenta/'+fcaI+","+plantasSel+",SP", confi_ax);
      const obj = response.data[0].Rows;
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPSemanaP(rango);
      const labels = [];
      const dataSet = [];
      obj.forEach(item => {
        labels.push(item.UsuarioCreo+"("+item.TP+" Pedidos)");
        dataSet.push(item.Metraje);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataPS({
        labels: labels,
        datasets: [
          {
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        //clearInterval(interval); // Limpiar el intervalo
        //setLoading(false);
        setPercentage(75);
        getRepsM(); 
        //setVisible(false);
    }
  }
  async function getRepsM()
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
      const fcaI = FormatoFca(vFechaI);
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPVenta/'+fcaI+","+plantasSel+",M", confi_ax);
      const obj = response.data[0].Rows;
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPMes(rango);
      const labels = [];
      const dataSet = [];
      obj.forEach(item => {
        labels.push(item.UsuarioCreo+"("+item.TP+" Pedidos)");
        dataSet.push(item.Metraje);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataM({
        labels: labels,
        datasets: [
          {
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        //clearInterval(interval); 
        // Limpiar el intervalo
        setLoading(false);
        setPercentage(100); 
        setVisible(false);
    }
  }
  return (
    <>
      <CContainer fluid>
        <h1>Reporte Pedidos por Vendedor en m3</h1>
        <CRow>
          <CCol sm="auto">
            <FechaI 
                vFechaI={vFechaI} 
                cFechaI={cFechaI} 
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
                            type="doughnut"
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
                            type="doughnut"
                            data={chartDataS}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={6}>
                <CCard className="mb-4">
                    <CCardHeader>Por Próxima Semana <b>{rPSemanaP}</b></CCardHeader>
                    <CCardBody>
                        <CChart
                            type="doughnut"
                            data={chartDataPS}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={6}>
                <CCard className="mb-4">
                    <CCardHeader>Por Mes <b>{rPMes}</b></CCardHeader>
                    <CCardBody>
                        <CChart
                            type="doughnut"
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

export default PedidosVenta
