import React, {useRef, useState, useEffect} from 'react'
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  
} from '@coreui/react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import { findLogin } from '../../Utilidades/Funciones';

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const currentDate = new Date();

const Dashboard = () => {
  const navigate = useNavigate();
  const userIsA = true;
  const [aPedidosD, setPedidosD] = useState([]);
  //Diario
  const[fDiaria, setfDiara] = useState(currentDate);
  const[rPSemana, setPSemana] = useState('-');
  const[rPSemanaP, setPSemanaP] = useState('-');
  const[rPMes, setPMes] = useState('-');
  //Diario
  const [chartDataD, setChartDataD] = useState({
    labels: [],
    datasets: [
      {
        label: 'Pedidos',
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  //Semana
  const [chartDataS, setChartDataS] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total de Pedidos',
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  //ProximaSemanal
  const [chartDataPS, setChartDataPS] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  //Mes
  const [chartDataM, setChartDataM] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  
  useEffect(() => {
    const banderaL = findLogin();
    if(!banderaL){
      navigate('/login')
    }
    getPedidosD();
    getPedidosS();
    getPedidosPS();
    getPedidosM();
  }, []);
  async function getPedidosD()
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
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPedidos/0', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      const dataSetR = [];
      var totalP = 0;
      var totalPR = 0;
      obj.forEach(item => {
        if (item.TPA !== null && !(typeof item.TPA === 'object' && Object.keys(item.TPA).length === 0)) {
          totalP += item.P_TotalPedidos;
          totalPR += item.TPA;
          labels.push(item.Planta);
          dataSet.push(item.P_TotalPedidos);
          dataSetR.push(item.TPA);
        }
      });
      // Actualiza el estado con los nuevos datos
      setChartDataD({
        labels: labels,
        datasets: [
          {
            label: totalP+' Pedidos Totales',
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
          {
            label: totalPR+' Pedidos Realizados',
            data: dataSetR,
            borderWidth:1,
            backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
          }
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{

    }
  }
  async function getPedidosS()
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
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPedidos/1', confi_ax);
      const obj = response.data[0].Rows;
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPSemana(rango);
      const labels = [];
      const dataSet = [];
      const dataSetR = [];
      var totalP = 0;
      var totalPR = 0;
      obj.forEach(item => {
        if (item.TPA !== null && !(typeof item.TPA === 'object' && Object.keys(item.TPA).length === 0)) {
          totalP += item.P_TotalPedidos;
          totalPR += item.TPA;
          labels.push(item.Planta);
          dataSet.push(item.P_TotalPedidos);
          dataSetR.push(item.TPA);
        }
      });
      // Actualiza el estado con los nuevos datos
      setChartDataS({
        labels: labels,
        datasets: [
          {
            label: 'Total de Pedidos',
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
          {
            label: totalPR+' Pedidos Realizados',
            data: dataSetR,
            borderWidth:1,
            backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
          }
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{

    }
  }
  async function getPedidosPS()
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
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPedidos/2', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPSemanaP(rango);
      var totalP = 0;
      obj.forEach(item => {
        if (item.P_TotalPedidos !== null && !(typeof item.P_TotalPedidos === 'object' && Object.keys(item.P_TotalPedidos).length === 0)) {
          totalP += item.P_TotalPedidos;
          labels.push(item.Planta);
          dataSet.push(item.P_TotalPedidos);
        }
      });
      // Actualiza el estado con los nuevos datos
      setChartDataPS({
        labels: labels,
        datasets: [
          {
            label:'Total de Pedidos('+totalP+')',
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

    } 
  }
  async function getPedidosM()
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
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl+'Operaciones/GetPedidos/3', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      const dataSetR = [];
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPMes(rango);
      var totalP = 0;
      var totalPR = 0;
      obj.forEach(item => {
        if (item.P_TotalPedidos !== null && !(typeof item.P_TotalPedidos === 'object' && Object.keys(item.P_TotalPedidos).length === 0)) {
          totalP += item.P_TotalPedidos;
          totalPR += item.TPA;
          labels.push(item.Planta);
          dataSet.push(item.P_TotalPedidos);
          dataSetR.push(item.TPA);
        }
      });
      // Actualiza el estado con los nuevos datos
      setChartDataM({
        labels: labels,
        datasets: [
          {
            label: 'Total de Pedidos: '+totalP,
            data: dataSet,
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
          {
            label: totalPR+' Pedidos Realizados',
            data: dataSetR,
            borderWidth:1,
            backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
          }
        ],
      });
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{

    } 
  }
  return (
    <>
      {userIsA && <WidgetsDropdown className="mb-4" />}
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Pedidos Por Día <b>{format(fDiaria, 'yyyy/MM/dd')}</b></CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                data={chartDataD}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Proyección por Semana <b>{rPSemana}</b></CCardHeader>
            <CCardBody>
              <CChart
                type='bar'
                data={chartDataS}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Proyección por Semana Proxima <b>{rPSemanaP}</b></CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                data={chartDataPS}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Proyección por Mes <b>{rPMes}</b></CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                data={chartDataM}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
