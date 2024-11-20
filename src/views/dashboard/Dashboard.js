import React, {useRef, useState, useEffect} from 'react'
import classNames from 'classnames'
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
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca, Fnum} from '../../Utilidades/Tools.js'
import { format } from 'date-fns';
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

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
const currentDate = new Date();

const Dashboard = () => {
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
  
  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  useEffect(() => {
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
      const response = await axios.get(baseUrl+'Operaciones/GetPedidosD', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      var totalP = 0;
      obj.forEach(item => {
        totalP += item.TotalPedidos;
        labels.push(item.Planta);
        dataSet.push(item.TotalPedidos);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataD({
        labels: labels,
        datasets: [
          {
            label: 'Total de Pedidos: '+totalP,
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
      const response = await axios.get(baseUrl+'Operaciones/GetPedidosPD', confi_ax);
      const obj = response.data[0].Rows;
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPSemana(rango);
      const labels = [];
      const dataSet = [];
      var totalP = 0;
      obj.forEach(item => {
        totalP += item.TotalPedidos;
        labels.push(item.Planta);
        dataSet.push(item.TotalPedidos);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataS({
        labels: labels,
        datasets: [
          {
            label: 'Total de Pedidos:'+totalP,
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
      const response = await axios.get(baseUrl+'Operaciones/GetPedidosPS', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      const rango = format(obj[0].FcaIni, 'yyyy/MM/dd')+"-"+format(obj[0].FcaFin, 'yyyy/MM/dd');
      setPSemanaP(rango);
      var totalP = 0;
      obj.forEach(item => {
        totalP += item.TotalPedidos;
        labels.push(item.Planta);
        dataSet.push(item.TotalPedidos);
      });
      // Actualiza el estado con los nuevos datos
      setChartDataPS({
        labels: labels,
        datasets: [
          {
            label:'Total de Pedidos: '+totalP,
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
      const response = await axios.get(baseUrl2+'Operaciones/GetPedidosM', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      console.log(obj)
      const rango = format(obj[0].FI, 'yyyy/MM/dd')+"-"+format(obj[0].FF, 'yyyy/MM/dd');
      setPMes(rango);
      var totalP = 0;
      obj.forEach(item => {
        totalP += item.TotalPedidos;
        labels.push(item.Planta);
        dataSet.push(item.TotalPedidos);
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
      <WidgetsDropdown className="mb-4" />
      
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
