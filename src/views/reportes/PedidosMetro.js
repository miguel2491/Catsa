import React,{useEffect, useState, useRef} from 'react'
import classNames from 'classnames'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
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

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const currentDate = new Date();

const PedidosMetro = () => {
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [visible, setVisible] = useState(false)
  const[fDiaria, setfDiara] = useState(currentDate);
  const [vFcaF, setFechaFin] = useState(null);
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
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  const [chartDataS, setChartDataS] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
  });
  const [chartDataPS, setChartDataPS] = useState({
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
    getReps();
  }
  useEffect(()=>{    
    
  },[]);
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };

  async function getReps()
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
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const response = await axios.get(baseUrl2+'Operaciones/GetPedidoPlanta/D', confi_ax);
      const obj = response.data[0].Rows;
      const labels = [];
      const dataSet = [];
      obj.forEach(item => {
        labels.push(item.Planta);
        dataSet.push(item.TotalPedidos);
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
      console.log(obj)
    }
    catch(error)
    {
      Swal.fire("Error", "Ocurrio un error, vuelva a intentarlo", "error");
    }finally{
        clearInterval(interval); // Limpiar el intervalo
        setLoading(false);
        setPercentage(100); 
        setVisible(false);
    }
  }

  return (
    <>
      <CContainer fluid>
        <h1>Reporte Pedidos Metro</h1>
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
            <CCol xs={12} md={4}>
                <CCard className="mb-4">
                    <CCardHeader>Proyección por Día <b>{format(fDiaria, 'yyyy/MM/dd')}</b></CCardHeader>
                    <CCardBody>
                        <CChartPolarArea
                            data={chartDataD}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={4}>
                <CCard className="mb-4">
                    <CCardHeader>Proyección por Semana <b>{format(fDiaria, 'yyyy/MM/dd')}</b></CCardHeader>
                    <CCardBody>
                        <CChartPolarArea
                            data={chartDataS}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12} md={4}>
                <CCard className="mb-4">
                    <CCardHeader>Proyección por Semana Próxima <b>{format(fDiaria, 'yyyy/MM/dd')}</b></CCardHeader>
                    <CCardBody>
                        <CChartPolarArea
                            data={chartDataPS}
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
