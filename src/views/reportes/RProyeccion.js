import React, { useState, useEffect } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardHeader,
    CCardBody,
    CFormSelect
} from '@coreui/react';
import '../../estilos.css';
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'
import { CChart, CChartPolarArea, CChartRadar } from '@coreui/react-chartjs'
import { CIcon } from '@coreui/icons-react';
import { cilXCircle, cilSearch, cilX, cilCloudDownload,cilCameraControl, cilCheckCircle } from '@coreui/icons';
import { getProyeccion } from '../../Utilidades/Funciones';
import Swal from 'sweetalert2';
import {FormatoFca, Fnum} from '../../Utilidades/Tools'
import { format } from 'date-fns';

const RProyeccion = () => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);// Modal Cargando
    const [visibleD, setVisibleD] = useState(false);// Modal Detalle
    const [data, setData] = useState([]); // Estado para almacenar los datos de la tabla
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [vFcaF, setFechaFin] = useState(null);
    const [dHeaders, putHeaders] = useState([]);
    const [vAsesores, setAsesores] = useState([]);
    const [selectedAsesor, setSelectedAsesor] = useState('');
    const [newArray, setNewArray] = useState({});
    const [objDiario, setObjDiario] = useState(0);
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
    //Estilo
    const [isDetalle, setIsDetalle] = useState(false);    
    
    const cFechaI = (fecha) => {
        const formattedDate = format(fecha, 'yyyy/MM/dd');
        setFechaIni(formattedDate);
    };
    const mFcaF = (fcaF) => {
        const auxFca = format(fcaF, 'yyyy/MM/dd');
        setFechaFin(auxFca);
      };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };

    useEffect(() => {
        console.log('El valor actualizado de objDiario es:', objDiario);
        // Aquí puedes realizar cualquier acción que dependa de `objDiario` actualizado
      }, [objDiario]);  // Dependencia de `objDiario`
    

    const getProyeccionAsesores = async () => {
        setLoading(true);
        setVisible(true); // Muestra el modal de carga

        try {
            const proyecciones = await getProyeccion(vFechaI,vFcaF,plantasSel,'0');
            console.log(proyecciones);
            if (proyecciones) {
                const objAsesores = proyecciones.asesores.data;
                putHeaders(Object.keys(objAsesores[0]));
                setData(objAsesores); 
                setAsesores(objAsesores);
                setIsDetalle(true);
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            setLoading(false);
            setVisible(false); // Oculta el modal de carga
        }
    };

    // Función para convertir a CSV
    const convertArrayOfObjectsToCSV = (array) => {
        if (!array || !array.length) return null;
        const header = Object.keys(array[0]).join(','); // Extrae las claves como cabeceras
        const rows = array.map(obj => Object.values(obj).join(',')); // Mapea los valores en cada fila
        return [header, ...rows].join('\n'); // Une todo en una cadena CSV
    };

    const downloadCSV = (e) => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(filteredData);
        if (csv == null) return;
    
        const filename = 'export.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };

     // Función para extraer fechas y asociarlas con "CAMPO 1"
    const extractDatesData = (data, selectedAsesor) => {
        return data.reduce((acc, item) => {
        // Obtener el valor de "CAMPO 1"
        if (item.Asesor === selectedAsesor) {
            const campo1 = item["Asesor"];
            const cOD = item["ObjDiario"];
            setObjDiario(cOD);
        // Filtrar las fechas (todo lo que no sea "CAMPO 1", "CAMPO 2", o "CAMPO 3")
            const dates = Object.keys(item).filter(key => 
                key !== 'Asesor' && 
                key !== 'Categoria' && 
                key !== 'Porcentaje' && 
                key !== 'Objetivo_ac' && 
                key !== 'VolMin_Diario' && 
                key !== 'ObjMensual' && 
                key !== 'ObjDiario' && 
                key !== 'AvanceReal' && 
                key !== 'Promedio' && 
                key !== 'Proyeccion' && 
                key !== 'PorcAvance');
  
        // Obtener los valores de las fechas
            //const dateValues = dates.map(date => item[date]);
            const dateValues = dates.map((date) => ({
                [date]: item[date], // La fecha es la clave real, no "FechaX"
              }));        
        // Asociar "CAMPO 1" con los valores de las fechas
            acc[campo1] = {dateValues,cOD};
        }
      return acc;
    }, {});
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedAsesor(value);
    
        // Ejecutar la extracción de datos cuando cambie el valor seleccionado
        if (value) {
            const result = extractDatesData(vAsesores, value);
            console.log(result);
            const labels = [];
            const dataSet = [];
            const dataSetR = [];
            // Iterar sobre todas las claves de result (los nombres dinámicos)
            Object.keys(result).forEach(person => {
                const { dateValues, cOD } = result[person];
                dateValues.forEach(item => {
                const date = Object.keys(item)[0]; // Obtener la fecha (clave)
                const value = item[date]; // Obtener el valor asociado (número)
                
                // Verificar que el valor sea numérico antes de agregarlo
                if (typeof value === 'number') {
                    labels.push(date);
                    dataSet.push(value);
                    console.log(cOD);
                    dataSetR.push(cOD);
                }
                });
            });
            
            setChartDataD({
                labels: labels,
                datasets: [
                  {
                    label:"Volumen",
                    data: dataSet,
                    backgroundColor:['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
                  },{
                    label:"Objetivo Diario",
                    data:dataSetR,
                    type:'bar',
                    borderWidth:1
                  }
                ],
            });
            setNewArray(result); // Guardamos el resultado en el estado
        } else {
            setNewArray({}); // Si no hay selección, limpiar el resultado
        }
      };

    return (
        <CContainer fluid>
            <h2 style={{ textAlign: 'center' }}>Proyecciones</h2>
            <CRow className='mb-2'>
                <CCol xs={6} md={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <FechaF 
                        vFcaF={vFcaF} 
                        mFcaF={mFcaF}
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CButton color='primary' className='mt-3' onClick={getProyeccionAsesores}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Buscar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mb-1 mt-2'>
                <CTable responsive style={{fontSize:'10px'}}>
                        <CTableHead>
                            <CTableRow>
                                {
                                    dHeaders.map((itemd,index) => {
                                        return(
                                            <CTableHeaderCell key={itemd || index} scope="col">{itemd}</CTableHeaderCell>
                                        )
                                    })
                                }
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                data.length === 0 ?(
                                    <CTableRow>
                                        <CTableDataCell colSpan={data.length}>Sin datos</CTableDataCell>
                                    </CTableRow>
                                ):(
                                    data.map((itemd,index) => (
                                        <CTableRow key={itemd.Entrada || index}>
                                            {
                                                dHeaders.map((item, index_) => {
                                                    // Accedemos al valor de 'item' en 'itemd', y si es undefined, mostramos 'Valor no disponible'
                                                    const value = itemd[item];
                                                    const renderableValue = value != null ? value : 'Valor no disponible';
                                                    const valueToDisplay = typeof renderableValue === 'object' ? Fnum(0) : Fnum(renderableValue);
                                                    // Si el valor es nulo o indefinido, se coloca un texto alternativo
                                                    return (
                                                    <CTableDataCell key={item || index_}>
                                                        {valueToDisplay}
                                                    </CTableDataCell>
                                                    );
                                                })
                                            }
                                        </CTableRow>
                                    ))
                                )
                            }
                        </CTableBody>
                </CTable>
            </CRow>
            <CRow className='mb-1 mt-2'>
                <CCol xs={12} md={12}>
                <CCard className={isDetalle ? 'visible' : 'oculto'}>
                    <CCardHeader>Asesor: <b>
                        <CFormSelect aria-label="Default select example" 
                            value={selectedAsesor}
                            onChange={handleChange}>
                            <option value="">Seleccione...</option>
                            {vAsesores.length > 0 ? (
                                vAsesores.map((itemd, index) => {
                                const value = itemd.Asesor; // Suponiendo que 'Asesor' es el campo que deseas mostrar
                                return (
                                    <option key={index} value={value}>
                                    {value}
                                    </option>
                                );
                                })
                            ) : (
                                <option disabled>No hay asesores disponibles</option>
                            )}
                        </CFormSelect>
                    </b></CCardHeader>
                    <CCardBody style={{background:'white'}}>
                            <CChart
                                type='line'
                                data={chartDataD}
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
                <CModalFooter />
            </CModal>
        </CContainer>
    );
};

export default RProyeccion;
