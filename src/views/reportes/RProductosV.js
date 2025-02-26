import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import { CChart, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs'
import FechaI from '../base/parametros/FechaInicio';
import FechaF from '../base/parametros/FechaFinal';
import '../../estilos.css';
import { getOC, getPlantasList } from '../../Utilidades/Funciones';
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
import { cilCheck } from '@coreui/icons'
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
    const[fDiaria, setfDiara] = useState(currentDate);
    const [tipoMantenimiento, setTipoMantenimiento] = useState('-');
    const [tEstatus, setTEstatus] = useState('-');
    const [ListOC, setOC] = useState([]);
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Arrays
    const [dtOrdenes, setDTOrdenes] = useState([]);
    //************************************************************************************************************************************************************************** */
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIsJP ? false : true;
    //************************************************************************************************************************************************************************** */
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const cFechaI = (fecha) => {
        //const fechaFormateada = fecha.toLocaleDateString('en-US', opcionesFca);
        setFechaIni(fecha);
        getOC_(fecha, vFechaF);
    };
    
    const mFcaF = (fcaF) => {
        //const fechaFormateada = fcaF.toLocaleDateString('en-US', opcionesFca);
        setFechaFin(fcaF);
        getOC_(vFechaI, fcaF);
    };
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
    const getOC_ = (vFechaI, vFechaF) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOC(vFechaI, vFechaF);
            }
        });
    }
    const gOC = async (FI, FF) => {
        const auxFcaI = format(FI, 'yyyy/MM/dd');
        const auxFcaF = format(FF, 'yyyy/MM/dd');
        try{
            const ocList = await getOC(auxFcaI, auxFcaF);
            if(ocList)
            {
                const labels = [];
                const dataSet = [];
                
                const agrupadoPorPlanta = Object.keys(ocList.reduce((acc, item) => {
                    const planta = item.planta;  
                    // Si la planta ya existe, incrementamos el contador
                    if (acc[planta]) {
                        acc[planta]++;
                    } else {
                        acc[planta] = 1;
                    }                  
                    return acc;
                    }, {})).map(planta => ({
                    planta: planta,
                    cantidad: ocList.filter(item => item.planta === planta).length 
                }));

                agrupadoPorPlanta.forEach(item => {
                    labels.push(item.planta);
                    dataSet.push(item.cantidad);
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
                setOC(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
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
    }    
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getOC_(vFechaI, vFechaF);
        getPlantas();
    }, []);
    //************************************************************************************************************************************************************************************** */
    const mCambio = (event) => {
        setPlantasF(event.target.value);
    };
    const handleTipoMantenimientoChange = (e) => {
        setTipoMantenimiento(e.target.value);
        const TipoM = event.target.value;
        const labels = [];
        const dataSet = [];
        // Actualiza el estado con los nuevos datos
        let fTM = [];
        if (TipoM && plantasSelF) {
            if(TipoM == "-"){
                // Si TipoM es "-", filtramos por tipoMant y planta
                fTM = ListOC.filter(item => item.planta === plantasSelF);
            }else{
                fTM = ListOC.filter(item => item.tipoMant === TipoM && item.planta === plantasSelF);
            }
        } else {
            if(TipoM == "-"){
                // Si TipoM tiene otro valor, solo filtramos por tipoMant
                fTM = ListOC;
            }else{
                // Si TipoM tiene otro valor, solo filtramos por tipoMant
                fTM = ListOC.filter(item => item.tipoMant === TipoM);
            }
        }
        const agEstatus = Object.keys(fTM.reduce((acc, item) => {
            const estatus = item.estatus;
            if (acc[estatus]) {
                acc[estatus]++;
            } else {
                acc[estatus] = 1;
            }
            return acc;
            }, {})).map(estatus => ({
            estatus: estatus,
            cantidad: fTM.filter(item => item.estatus === estatus).length 
        }));

        agEstatus.forEach(item => {
            const estats = item.estatus == "0" ? "Eliminado":item.estatus == "1" ? "En Proceso":item.estatus == "2"?"Aprobada":"Finalizada";
            labels.push(estats);
            dataSet.push(item.cantidad);
        });
        setChartDataD({
            labels: labels,
            datasets: [
            {
                data: dataSet,
                backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
            },
            ],
        });
    };
    const hEstatusCh = (e) => {
        setTEstatus(e.target.value);
        const Estatus = event.target.value;
        const labels = [];
        const dataSet = [];
        // Actualiza el estado con los nuevos datos
        let fTE = [];
        if (Estatus && plantasSelF) {
            if(Estatus && tipoMantenimiento)
            {
                if(Estatus == "-"){
                    if(tipoMantenimiento == "-"){
                        fTE = ListOC.filter(item => item.planta === plantasSel);
                    }else{
                        fTE = ListOC.filter(item => item.planta === plantasSel && item.tipoMant === tipoMantenimiento);
                    }
                }else{
                    if(tipoMantenimiento === "-")
                    {
                        fTE = ListOC.filter(item => item.estatus === Estatus && item.planta === plantasSel);
                    }else{
                        fTE = ListOC.filter(item => item.estatus === Estatus && item.tipoMant === tipoMantenimiento && item.planta === plantasSel);
                    }
                }
            }else{                
                if(Estatus == "-"){
                    fTE = ListOC.filter(item => item.planta === plantasSel);
                }else{
                    fTE = ListOC.filter(item => item.estatus === Estatus && item.planta === plantasSel);
                }
            }
        } else {//SIN PLANTA
            if(tipoMantenimiento == "-"){
                if(Estatus == "-")
                {
                    fTE = ListOC;
                }else if(plantasSelF){
                    fTE = ListOC.filter(item => item.estatus === Estatus && item.planta === plantasSelF);
                }else{
                    fTE = ListOC.filter(item => item.estatus === Estatus);
                }
            }else{
                if(Estatus == "-")
                {
                    fTE = ListOC.filter(item => item.tipoMant === tipoMantenimiento);
                }else{
                    fTE = ListOC.filter(item => item.tipoMant === tipoMantenimiento && item.estatus === Estatus);
                }
            }
        }
        const agEstatus = Object.keys(fTE.reduce((acc, item) => {
            const estatus = item.estatus;
            if (acc[estatus]) {
                acc[estatus]++;
            } else {
                acc[estatus] = 1;
            }
            return acc;
            }, {})).map(estatus => ({
            estatus: estatus,
            cantidad: fTE.filter(item => item.estatus === estatus).length 
        }));

        agEstatus.forEach(item => {
            const estats = item.estatus == "0" ? "Eliminado":item.estatus == "1" ? "En Proceso":item.estatus == "2"?"Aprobada":"Finalizada";
            labels.push(estats);
            dataSet.push(item.cantidad);
        });
        setChartDataD({
            labels: labels,
            datasets: [
            {
                data: dataSet,
                backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
            },
            ],
        });
    };
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
                    <CFormSelect aria-label="Selecciona" value={plantasSelF} onChange={mCambio}>
                        <option value="" >Selecciona...</option>
                        {dtPlantas.map((planta, index) =>(
                            <option value={planta.IdPlanta} key={index}>{planta.Planta}</option>
                        ))}
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={12}>
                    <CCard className="mb-4" style={{'minHeight':'700px'}}>
                        <CCardHeader>Ordenes de Compra</CCardHeader>
                        <CCardBody>
                            <CChart
                                type='pie'
                                data={chartDataD}
                                style={{height:'600px'}}
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
