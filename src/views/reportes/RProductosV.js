import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import { CChart } from '@coreui/react-chartjs'
import FechaI from '../base/parametros/FechaInicio';
import FechaF from '../base/parametros/FechaFinal';
import '../../estilos.css';
import { getPV, getPlantasList } from '../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilSearch, cilSend } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"
const currentDate = new Date();

const RProductosV = () => {    
    //************************************************************************************************************************************************************************** */
    const [plantasSelF , setPlantasF] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [tipoMantenimiento, setTipoMantenimiento] = useState('-');
    const [ListOC, setOC] = useState([]);
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Arrays
    //********************************************************************** GRÁFICAS ******************************************************************************************************** */
    const [chartDataD, setChartDataD] = useState({
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
          },
        ],
    });
    const [dtPlantas, setDTPlantas] = useState([]);
    //************************************************************************************************************************************************************************** */
    const cFechaI = (fecha) => {
        setFechaIni(fecha);
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF);
    };
    const mCambio = (event) => {
        setPlantasF(event.target.value);
    };
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getPlantas();
    }, []);
    //************************************************************************************************************************************************************************** */
    const getPlantas = async()=>{
        try{
            const ocList = await getPlantasList();
            if(ocList)
            {
                setDTPlantas(ocList)
            }
        }catch(error){
            console.log("Ocurrio un problema cargando Plantas....")
        }
    };
    //************************************************************************************************************************************************************************** */
    const getProductosVenta = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gPV();
            }
        });
    }
    const gPV = async () => {
        const auxFcaI = format(vFechaI, 'yyyy-MM-dd');
        const auxFcaF = format(vFechaF, 'yyyy-MM-dd');
        try{
            console.log(auxFcaI, auxFcaF, plantasSelF)
            const ocList = await getPV(auxFcaI, auxFcaF, plantasSelF);
            if(ocList)
            {
                const labels = [];
                const dataSet = [];
                const dataSetR = [];
                console.log(ocList)
                var totalP = 0;
                var totalPR = 0;
                ocList.forEach(item => {
                    if (item.Producto.length > 0) {
                      totalP += item.Total;
                      totalPR += item.TotalM3;
                      labels.push(item.Producto);
                      dataSet.push(item.Total);
                      dataSetR.push(item.TotalM3);
                    }
                  });
                  // Actualiza el estado con los nuevos datos
                  setChartDataD({
                    labels: labels,
                    datasets: [
                      {
                        label: 'Productos Vendidos: '+totalP,
                        data: dataSet,
                        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                      },
                      {
                        label: totalPR+' Total M3 Vendidos',
                        data: dataSetR,
                        borderWidth:1,
                        backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                        borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
                      }
                    ],
                });
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
        
    
    //************************************************************************************************************************************************************************************** */
    
    //************************************************************************************************************************************************************************************* */
  return (
    <>
    <CContainer fluid>
            <h3>Productos Venta </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2} lg={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <FechaF 
                        vFcaF={vFechaF} 
                        mFcaF={mFcaF}
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={3} lg={3}>
                    <label>Planta</label>
                    <CFormSelect aria-label="Selecciona" value={plantasSelF} onChange={mCambio} className='mt-2'>
                        <option value="" >Selecciona...</option>
                        {dtPlantas.map((planta, index) =>(
                            <option value={planta.IdPlanta} key={index}>{planta.Planta}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol className='mt-3' xs={6} md={3}>
                    <CButton color='primary' onClick={getProductosVenta} className='mt-3'> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={12}>
                    <CCard className="mb-4">
                        <CCardHeader>Productos Venta</CCardHeader>
                        <CCardBody>
                            <CChart
                                type='bar'
                                data={chartDataD}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <br />
        </CContainer>
    </>
  )
}

export default RProductosV
