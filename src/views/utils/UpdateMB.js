import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import Periodo from '../base/parametros/Periodo'
import Mes from '../base/parametros/Mes'
import DataTable from 'react-data-table-component';
import { getCalendario, setMBruto, fNumberCad } from '../../Utilidades/Funciones';
import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'
import { auto } from '@popperjs/core';

const UpdateMB = () => {
    const [btn3, setDisabled3] = useState(false);
    const [btnBC, setBC] = useState(false);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [periodoSel , setPeriodo] = useState('');
    const [mesSel , setMes] = useState('');
    const [periodoSelC , setPeriodoC] = useState('');
    const [mesSelC , setMesC] = useState('');
    const [visible, setVisible] = useState(false)
    //Buscador
    const [fText, setFText] = useState('');
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtCalendario, setDTCalendario] = useState([]);
    //VISIBLES
    const [showD, setShowD] = useState(false);
    //=============================================================================================================================================================================
    const mPeriodo = (event) => {
        setPeriodo(event.target.value);
    };
    const mMes = (event) => {
        setMes(event.target.value);
    };
    const mPeriodoC = (event) => {
        setPeriodoC(event.target.value);
    };
    const mMesC = (event) => {
        setMesC(event.target.value);
        if(!btnBC){
            setBC(true);
        }
    };
    //=================================================================== USE EFFECT ====================================================================================================
    
    //=================================================================== *********** ====================================================================================================
    const comenzarMB = () => {
        if (btn3) return; // Prevenir múltiples clics
        setMB(periodoSel, mesSel);
    };    
    const setMB = async(mes,ejercicio) =>
    {
        if(mes === "" || ejercicio === "")
        {
            Swal.fire("AVISO", "Valida que no esten vacios", "error");
        }else{     
            setVisible(!visible)       
            setLoading(true);
            setPercentage(0);
            setDisabled3(true);
            // Simular carga gradual
            try{
                const ocList = await setMBruto(fNumberCad(mesSelC),periodoSelC);
                if(ocList)
                {
                    
                }
                Swal.close();  // Cerramos el loading
            }catch(error){
                Swal.close();
                Swal.fire("Error", "No se pudo obtener la información", "error");
            }
        }
    }
    const verCalendario = async() =>{
        setDTCalendario([]);
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            const ocList = await getCalendario(fNumberCad(mesSelC),periodoSelC,'0');
            console.log(ocList)
            if(ocList)
            {
                setShowD(true)
                setDTCalendario(ocList)
            }
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    const setCalendario = async() =>{
        setDTCalendario([]);
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            const ocList = await getCalendario(fNumberCad(mesSelC),periodoSelC,'1');
            if(ocList)
            {
                setShowD(true)
                setDTObjCom(ocList)
            }
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }; 
    //=============================================================================================================================================================================
    const colCalendario = [
        {
            name: 'DÍA',
            selector: row => {
                const aux = row.DIA;
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
                const aux = row.MES;
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
            name: 'AÑO',
            selector: row => {
                const aux = row.ANIO;
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
            name: 'FECHA REAL',
            selector: row => {
                const aux = row.FECHAREAL;
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
            name: 'INDICADOR',
            selector: row => {
                const aux = row.INDICADOR;
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
            name: 'SEMANA',
            selector: row => {
                const aux = row.SEMANA;
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
    ];
    //=============================================================================================================================================================================
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtCalendario.filter(dtCalendario => 
              dtCalendario.DIA.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTCalendario(valFiltrados);
        }else{
          //getAcObjCom_()
        }
    };
    const fBCalendario = dtCalendario.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.DIA.toLowerCase().includes(fText.toLowerCase());
    });
    //=============================================================================================================================================================================
return (
    <>
        <CContainer fluid>
            <h1>Actualizar MB</h1>
            <CForm>
                <CRow>
                <CCol sm="auto" className='mt-3'>
                    <Periodo
                        mPeriodo={mPeriodo}
                        periodoSel={periodoSel}
                    />
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <Mes
                        mMes={mMes}
                        mesSel={mesSel}
                    />
                </CCol>
                <CCol sm="auto" className='mt-3'>
                    <br></br>
                    <CButton color='light' style={{ display:btn3 ? 'none':'block' }}>
                        <CIcon icon={cilLoopCircular} className="me-2" />
                        Comenzar
                    </CButton>
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
                </CCol>
                </CRow>
            </CForm>
            <CForm className='mt-4'>
                <h1>Actualizar Calendario</h1>
                <CRow>
                    <CCol xs={2} md={2}>
                        <Periodo
                            mPeriodo={mPeriodoC}
                            periodoSel={periodoSelC}
                        />
                    </CCol>
                    <CCol xs={2} md={2}>
                        <Mes
                            mMes={mMesC}
                            mesSel={mesSelC}
                        />
                    </CCol>
                    <CCol xs={auto} md={auto} className='mt-4'>
                        <CButton color='primary' onClick={() => verCalendario()} style={{ display:btnBC ? 'block':'none' }}>
                            <CIcon icon={cilSearch} className="me-2" />
                            Buscar
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} className='mt-4'>
                        <CButton color='warning' onClick={() => setCalendario()} style={{ display:btnBC ? 'block':'none' }}>
                            <CIcon icon={cilLoopCircular} className="me-2" />
                            Comenzar
                        </CButton>
                    </CCol>
                </CRow>
                <CRow className='mt-4'>
                    <CCol xs={2} md={2}></CCol>
                    <CCol xs={6} md={6}>
                    {showD && (
                        <DataTable
                            columns={colCalendario}
                            data={fBCalendario}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    )}
                    </CCol>
                </CRow>
            </CForm>
        </CContainer>
    </>
    )
}
export default UpdateMB