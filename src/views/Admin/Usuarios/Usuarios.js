import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getIncidencias, getIncidenciasId, delInci, setIncidencia } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CImage,
    CBadge,
    CFormTextarea,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import { IMaskMixin } from 'react-imask'
import IMask from 'imask'
import { jsPDF } from "jspdf";
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilCloudDownload, cilPen, cilPlus, cilPrint, cilSave, cilSearch, cilShareAlt, cilShortText, cilTag, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"

import "react-datepicker/dist/react-datepicker.css"
const Usuarios = () => {
    //************************************************************************************************************************************************************************** */
    const [plantasSelF , setPlantasF] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [fechaInci, setFechaInci] = useState(new Date());
    const [vMINCI, setMInci] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtIncidencia, setDTIncidencia] = useState([]);
    const [exOC, setExOc] = useState([]);
    // FROMS
    const [idInci, setIdInci] = useState(0);
    const [modulo, setModulo] = useState('');
    const [isDTxtModulo, setIsDMod] = useState(true)
    const [usuario, setUsuario] = useState('');
    const [isDTxtUsuario, setIsDUsuario] = useState(true)
    const [fecha, setFca] = useState('');
    const [isDTxtFca, setIsDFca] = useState(true)
    const [descripcion, setDesc] = useState('');
    const [isDTxtDesc, setIsDDesc] = useState(true)
    const [solucion, setSol] = useState('');
    const [duracion, setDura] = useState('');
    //************************************************************************************************************************************************************************** */    
    const [shRespuesta, setshRespuesta] = useState(false);
    //************************************************************************************************************************************************************************** */
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        //getIncidencias_();
    }, []);
    //************************************************************************************************************************************************************************** */
    const getIncidencias_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gIncidencia();
            }
        });
    }
    const gIncidencia = async () => {
        const auxFcaI = format(vFechaI, 'yyyy-MM-dd');
        const auxFcaF = format(vFechaF, 'yyyy-MM-dd');
        try{
            const ocList = await getIncidencias(auxFcaI, auxFcaF);
            if(ocList)
            {
                setDTIncidencia(ocList);
            }
            Swal.close();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const addInc = (id) =>{
        setMInci(true)
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gIncId(id);
            }
        });
    }
    const gIncId = async (id) => {
        try{
            const ocList = await getIncidenciasId(id);
            console.log(ocList)
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setIdInci(id);
            setModulo(ocList[0].modulo);
            setIsDMod(true)
            setUsuario(ocList[0].usuario);
            setIsDUsuario(true)
            setFechaInci(ocList[0].fechaCreo);
            setIsDFca(true)
            setDesc(ocList[0].descripcion);
            setIsDDesc(true)
            setSol(ocList[0].solucion);
            setDura(ocList[0].duracion);
            // setTimeout(function(){getVehiculo(ocList[0].planta,ocList[0].tipoMant)},1000);
            setBtnTxt('Actualizar')
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const deleteInci = async(id) => {
        try{
            const ocList = await delInci(id);
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Estamos obteniendo la información...',
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                setTimeout(() => { getIncidencias_();},1000);
        }catch(error){
            Swal.fire({
                title: "ERROR",
                text: "Ocurrio un error, vuelve a intentarlo",
                icon: "error"
            });
        }
    }
    const autorizaOC = (id)=>{
        Swal.fire({
            title: "¿Autorizar Orden de Compra?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Autorizar"
          }).then((result) => {
            if (result.isConfirmed) {
              setAutorizarOC(id,'2');
            }
          });
    }
    const setAutorizarOC = async(id, tipo) => {
        try{
            const ocAutoriza = await setStatusOC(id, tipo);
                Swal.fire({
                    title: "Autorizado",
                    text: ocAutoriza.message,
                    icon: "success"
                });
                setTimeout(() => { gOC();},2000);
        }catch(error){
            Swal.fire({
                title: "ERROR",
                text: "Ocurrio un error, vuelve a intentarlo",
                icon: "error"
            });
        }
    }
    
    const getVehiculo = async(planta, vehiculo)=>{
        try{
            const ocVehiculo = await getVehiculos(planta,vehiculo);
            if(ocVehiculo){
                setVehiculo(ocVehiculo);
            }
        }catch(error){
            Swal.fire({
                title: "ERROR",
                text: "Ocurrio un error, vuelve a intentarlo",
                icon: "error"
            });
        }
    }
    const setNFactura = (id) =>{
        Swal.fire({
            title: "Número de Factura",
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Ingresar",
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
              try {
                const response = await addNFac(id, login);
          
                // Comprobamos si la respuesta es true o false
                if (response) { 
                  // Si la respuesta es true, mostramos un mensaje de éxito
                  Swal.fire({
                    title: "Factura Ingresada",
                    text: "La factura fue ingresada correctamente.",
                    icon: 'success'
                  });
                  gOC();
                } else {
                  // Si la respuesta es false, mostramos un mensaje de error
                  Swal.fire({
                    title: "Error",
                    text: "No se pudo ingresar la factura.",
                    icon: 'error'
                  });
                }
                
                return response;  // Devolvemos la respuesta para continuar con el flujo de la promesa
          
              } catch (error) {
                // En caso de error, mostramos un mensaje de fallo
                Swal.fire({
                  title: "Error",
                  text: `Request failed: ${error}`,
                  icon: 'error'
                });
                throw error;  // Rechazamos la promesa si hay error
              }
            },
            allowOutsideClick: () => !Swal.isLoading(),  // Impide hacer clic fuera si está cargando
          }).then((result) => {
            if (result.isConfirmed) {
              // Acción cuando el usuario confirma
              Swal.fire({
                title: "Factura Ingresada",
                text: "La factura fue procesada correctamente.",
                icon: 'success'
              });
            }
          });
                    
    };
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colError = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"200px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsOperacion) && (
                        <CCol xs={6} md={4} lg={4}>
                        <CButton
                            color="warning"
                            onClick={() => addInc(row.id)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilPen} />
                        </CButton>
                        </CCol>
                    )}
                    {(userIsOperacion) && ( 
                        <CCol xs={6} md={4} lg={4}>
                            <CButton
                                color="danger"
                                onClick={() => deleteInci(row.id)}
                                size="sm"
                                className="me-2"
                                title="Eliminar"
                                style={{color:'white'}}
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Fecha',
            selector: row => {
                const fecha = row.fechaCreo;
                // Verifica si estatus es null, undefined o un objeto
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'Modulo',
            selector: row => {
                const aux = row.modulo;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Descripción',
            selector: row => {
                const aux = row.descripcion;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"350px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Usuario',
            selector: row => row.usuario,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Solución',
            selector: row => {
                const aux = row.solucion;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"300px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Duración',
            selector: row => {
                const aux = row.duracion;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
    ];
    //************************************************************************************************************************************************************************** */
    const downloadCSV = (e) => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exOC);
        if (csv == null) return;
    
        const filename = 'OC_'+auxFcaI+'-'+auxFcaF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
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
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtIncidencia.filter(dtIncidencia => 
            dtIncidencia.modulo.includes(vBPlanta) || dtIncidencia.usuario.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTIncidencia(valFiltrados);
        }else{
            gIncidencia()
        }
    };
    const fIncidencias = dtIncidencia.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.modulo.toLowerCase().includes(fText.toLowerCase()) || item.usuario.includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************** */
    const nOrdenCh = (e) =>{
        setNorden(e.target.value);
    }
    const nFacturaCh = (e) =>{
        setFactura(e.target.value);
    }
    const onDescripcion = (e) =>{
        setDescripcion(e.target.value);
    }
    const inciFca = (fcaF) => {
        setFechaInci(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const newIncidencia = () =>{
        setMInci(true)
        setModulo('')
        setIsDMod(false)
        setUsuario('')
        setIsDUsuario(false)
        setFechaInci(new Date())
        setIsDFca(false)
        setDesc('')
        setIsDDesc(false)
        setSol('')
        setDura('')
        setBtnTxt("Guardar");
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hModulo = (e) => {
        setModulo(e.target.value);
    };
    const hUsuario = (e) => {
        setUsuario(e.target.value);
    }
    const hFecha = (e) => {
        setFca(e.target.value);
    }
    const hDescripcion = (e) => {
        setDesc(e.target.value);
    }
    const hSolucion = (e) => {
        setSol(e.target.value);
    }
    const hDuracion = (e) => {
        setDura(e.target.value);
    }
    //************************************************************************************************************************************************************************************* */
    const onSaveInci = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        var tipo = idInci == 0 ? 'G':'U';
        // Crear un objeto FormData
        const formData = [{
            ID: idInci,
            Tipo:idInci == 0 ? 'CREATE':'UPDATE',
            Modulo: modulo,
            FechaCreo: fechaInci,
            Usuario: usuario,
            Descripcion: descripcion,
            Solucion: solucion,
            Duracion: duracion
        }];
        saveIncidencia(formData,tipo);
    }
    const saveIncidencia = async (data, tipo) => {
        try{
            const ocList = await setIncidencia(data,tipo);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            setMInci(false);
            getIncidencias_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>INCIDENCIAS </h3>
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
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='primary' onClick={getIncidencias_}> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='warning btnW' onClick={newIncidencia} > 
                        <CIcon icon={cilPlus} />
                            Agregar Incidencia
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='danger btnW' onClick={downloadCSV}>
                        <CIcon icon={cilCloudDownload} className="me-2" />
                        Exportar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={12}>
                    <CCol xs={3} md={3}>
                        <br />
                        <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                    </CCol>
                </CCol>
                <CCol>
                    <DataTable
                        columns={colError}
                        data={fIncidencias}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vMINCI}
                onClose={() => setMInci(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">INCIDENCIAS</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="Módulo"
                                placeholder="Módulo"
                                value={modulo}
                                onChange={hModulo}
                                disabled={isDTxtModulo}
                            />
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="Usuario"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={hUsuario}
                                disabled={isDTxtUsuario}
                            />
                        </CCol>
                        <CCol xs={6} md={2}>
                            <label>Fecha</label>
                            <div className='mt-2'>
                                <DatePicker 
                                    id='fcaF'
                                    disabled={isDTxtFca}
                                    selected={fechaInci} 
                                    onChange={inciFca} 
                                    placeholderText='Selecciona Fecha' 
                                    dateFormat="yyyy/MM/dd"
                                    className='form-control' />
                            </div>
                        </CCol>
                    </CRow>
                    <CRow className='mt-4 mb-4'>
                        <CCol xs={12} md={4}>
                            <CFormInput
                                type="text"
                                label="Descripción"
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={hDescripcion}
                                disabled={isDTxtDesc}
                            />
                        </CCol>
                        <CCol xs={12} md={4}>
                            <CFormInput
                                type="text"
                                label="Solución"
                                placeholder="Solución"
                                value={solucion}
                                onChange={hSolucion}
                            />
                        </CCol>
                        <CCol xs={12} md={4}>
                            <CFormInput
                                type="text"
                                label="Duración"
                                placeholder="Duración"
                                value={duracion}
                                onChange={hDuracion}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSaveInci} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setMInci(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <br />
        </CContainer>
    </>
    )
}
export default Usuarios