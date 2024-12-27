import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import { useSelect } from 'downshift';
import { getSimuladorInv, getSimuladorPro, getSimuladorProInd } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
} from '@coreui/react'
import '../../../estilos.css';
import {CIcon} from '@coreui/icons-react'
import { cilCameraControl } from '@coreui/icons'
import {FormatoFca} from '../../../Utilidades/Tools.js'
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
import { format } from 'date-fns';


const Simulador = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [aMateriales, setMateriales] = useState([]);
    const [aProductos, setProductos] = useState([]);
    const [chartDataM, setChartDataM] = useState({
        labels: [],
        datasets: [
          {
            label: 'Materiales',
            data: [],
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          },
        ],
      });
    const [inputValue, setInputValue] = useState('');
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const {
        isOpen,
        selectedItem,
        getItemProps,
        getMenuProps,
        getInputProps,
        highlightedIndex
      } = useSelect({
        aProductos,
        onInputValueChange: ({ inputValue }) => setInputValue(inputValue),
        onSelectedItemChange: ({ selectedItem }) => setInputValue(selectedItem),
        itemToString: (item) => (item ? item : ''),
      });
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        const auxFca = format(fcaF, 'yyyy/MM/dd');
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
        getSimulador(event.target.value);
        getProductos(event.target.value);
    };
    useEffect(() => {
    }, []);
    const getSimulador = async (Planta) =>{
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try {
            const materiales = await getSimuladorInv(Planta, auxFcaI, auxFcaF);
            const dataSet = [];
            const labels = [];
            const limite = [];
            var valM = "";
            var valR = 0;
            if (materiales) {
                materiales.forEach(item => {
                    valM = item.Material+"("+item.Unidad+")";
                    valR = item.InicioCB+item.EntradasCB-item.SalidasCB;
                    dataSet.push(valR);
                    labels.push(valM);
                    limite.push(25000)
                });
                //setMateriales(materiales)
                setChartDataM({
                    labels: labels,
                    datasets: [
                        {
                            label: 'LIMITE ',
                            data: limite,
                            backgroundColor: ['#FF6384'],
                        },
                        {
                        label: ' Materiales',
                        data: dataSet,
                        borderWidth:1,
                        backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                        borderColor:['rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)','rgb(255, 99, 132)']
                      }
                    ],
                  });
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const getProductos = async (Planta) =>{
        try{
            const productos = await getSimuladorPro(Planta);
            if(productos){
                console.log(productos);
                setProductos(productos);
            }
            
        }catch(error){
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************** */
return (
    <>
        <CContainer fluid>
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
            <h3>Proyección de Inventario </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <FechaF 
                        vFcaF={vFechaF} 
                        mFcaF={mFcaF}
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={3}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={12} >
                    <CCard>
                        <CCardHeader>Inventarios</CCardHeader>
                        <CCardBody>
                            <CChart
                                type="bar"
                                data={chartDataM}
                            />    
                        </CCardBody>
                        <CCardFooter>

                        </CCardFooter>
                    </CCard>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={3} md={3}>
                <input {...getInputProps()} placeholder="Search fruits..." />
      <ul {...getMenuProps()}>
        {isOpen &&
          aProductos
            .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
            .map((item, index) => (
              <li
                key={item}
                {...getItemProps({ item, index })}
                style={{
                  backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                }}
              >
                {item}
              </li>
            ))}
      </ul>

                </CCol>
                <CCol xs={12} md={12}>

                </CCol>
            </CRow>
        </CContainer>
    </>
    )
}
export default Simulador