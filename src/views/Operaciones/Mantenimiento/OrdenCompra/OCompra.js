import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../../base/parametros/FechaInicio';
import FechaF from '../../../base/parametros/FechaFinal';
import Plantas from '../../../base/parametros/Plantas';
import '../../../../estilos.css';
import BuscadorDT from '../../../base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getOCompras, setOCompra, delOCompra, getOComprasInd, setStatusOC, getVehiculos, addNFac } from '../../../../Utilidades/Funciones';
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
import { cilCheck, cilCloudDownload, cilPlus, cilPrint, cilSave, cilSearch, cilShareAlt, cilShortText, cilTag, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"

import "react-datepicker/dist/react-datepicker.css"
const OCompra = () => {
    //************************************************************************************************************************************************************************** */
    const [plantasSel , setPlantas] = useState('');
    const [plantasSelF , setPlantasF] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [vOC, setVOC] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtOrdenes, setDTOrdenes] = useState([]);
    const [cmbVehiculo, setVehiculo] = useState([]);
    const [exOC, setExOc] = useState([]);
    // FROMS
    const [nOrden, setNorden] = useState("");
    const [fechaOC, setFechaOC] = useState(new Date());
    const [nFactura, setFactura] = useState("");
    const [tipoMantenimiento, setTipoMantenimiento] = useState('-');
    const[aDescripcion, setDesc] = useState(
        [
            {
                "idTipo":0,
                "Categoria":0,
                "descripcion":"-"
            },{
                "idTipo":1,
                "Categoria":1,
                "descripcion":"SILOS, BASCULAS y ESTRUCTURA"
            },{
                "idTipo":2,
                "Categoria":1,
                "descripcion":"SISTEMA ELECTROMECANICO Y NEUMATICO"
            },
            {
                "idTipo":3,
                "Categoria":1,
                "descripcion":"TOLVAS RECEPTORAS Y BANDAS TRANSPORTISTAS"
            },{
                "idTipo":4,
                "Categoria":1,
                "descripcion":"SISTEMA DE AUTOMATIZACIÓN CARGA Y CONTROL"
            },{
                "idTipo":5,
                "Categoria":2,
                "descripcion":"CHASIS CABINA"
            },{
                "idTipo":6,
                "Categoria":2,
                "descripcion":"TREN MOTRIZ"
            },{
                "idTipo":7,
                "Categoria":2,
                "descripcion":"M. MEZCLADO"
            },
            {
                "idTipo":8,
                "Categoria":2,
                "descripcion":"IMAGEN"
            },
            {
                "idTipo":9,
                "Categoria":2,
                "descripcion":"LLANTAS"
            },{
                "idTipo":10,
                "Categoria":3,
                "descripcion":"CHASIS CABINA"
            },{
                "idTipo":11,
                "Categoria":3,
                "descripcion":"TREN MOTRIZ"
            },{
                "idTipo":12,
                "Categoria":3,
                "descripcion":"M. BOMBEO"
            },
            {
                "idTipo":13,
                "Categoria":3,
                "descripcion":"IMAGEN"
            },
            {
                "idTipo":14,
                "Categoria":3,
                "descripcion":"LLANTAS"
            },{
                "idTipo":15,
                "Categoria":4,
                "descripcion":"CHASIS CABINA"
            },{
                "idTipo":16,
                "Categoria":4,
                "descripcion":"TREN MOTRIZ"
            },{
                "idTipo":17,
                "Categoria":4,
                "descripcion":"PALA DE CARGA"
            },{
                "idTipo":18,
                "Categoria":4,
                "descripcion":"IMAGEN"
            },{
                "idTipo":19,
                "Categoria":4,
                "descripcion":"LLANTAS"
            },{
                "idTipo":20,
                "Categoria":5,
                "descripcion":"CHASIS ESTRUCTURA"
            },{
                "idTipo":21,
                "Categoria":5,
                "descripcion":"MOTOR DIESEL"
            },{
                "idTipo":22,
                "Categoria":5,
                "descripcion":"GENERADOR"
            },{
                "idTipo":23,
                "Categoria":5,
                "descripcion":"TABLERO DE CONTROL"
            },{
                "idTipo":24,
                "Categoria":8,
                "descripcion":"PLANTAS"
            },{
                "idTipo":25,
                "Categoria":8,
                "descripcion":"TR"
            },{
                "idTipo":26,
                "Categoria":8,
                "descripcion":"TB"
            },{
                "idTipo":27,
                "Categoria":8,
                "descripcion":"TX"
            },{
                "idTipo":28,
                "Categoria":8,
                "descripcion":"GN"
            },{
                "idTipo":29,
                "Categoria":8,
                "descripcion":"PC"
            },{
                "idTipo":30,
                "Categoria":8,
                "descripcion":"AU"
            },

        ]);
    const [descripcion, setDescripcion] = useState("-");
    const [vehiculo, setVehiculo_] = useState("-");
    const [descMan, setDMan] = useState("");
    const [respuesta, setResp] = useState("");
    const [idOC, setIdOC] = useState("0");
    const [file, setFile] = useState(null);
    //************************************************************************************************************************************************************************** */    
    const [vFile, setVFile] = useState(false);
    const [vImg, setVImg] = useState(false);
    const [urlImg, setUrlImg] = useState('');
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
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const mCambioF = (event) => {
        setPlantasF(event.target.value);
    };
    const handleEdit = (e, rowIndex) => {
        const newVal = e.target.value;
        const updatedRemisiones = [...dtRemisiones];
        updatedRemisiones[rowIndex].NoRemision = newVal; // Actualiza el valor de la columna 
        //setDTRemisiones(updatedRemisiones);
    };
    // Función para manejar el cambio del archivo
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Solo se guardará el primer archivo seleccionado
    };
    //************************************************************************************************************************************************************************** */
    const getOComprasBtn = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOC();
            }
        });
    }
    const gOC = async () => {
        var planta = plantasSel;
        if(plantasSel == undefined || plantasSel.length == 0 || plantasSel === ""){
            if(userIsJP && !userIsOperacion)
            {
                Swal.close();
                Swal.fire("Error", "Debes seleccionar alguna planta", "error");
                return false;
            }else {
                setPlantas('0')
                planta = '0'
            }
        }
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try{
            const ocList = await getOCompras(planta, auxFcaI, auxFcaF);
            if(ocList)
            {
                setDTOrdenes(ocList);
                setExOc(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const addOC = (id) =>{
        setVOC(true)
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOCI(id);
            }
        });
    }
    const gOCI = async (id) => {
        try{
            const ocList = await getOComprasInd(id);
            console.log(ocList)
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setIdOC(ocList[0].id)
            setNorden(ocList[0].ordenCompra)
            setFechaOC(ocList[0].fecha)
            setFactura(ocList[0].nFactura.length === 0 ? '' : ocList[0].nFactura.numero)
            setDescripcion(ocList[0].descripcion)
            setTipoMantenimiento(ocList[0].tipoMant)
            setTimeout(function(){getVehiculo(ocList[0].planta,ocList[0].tipoMant)},1000);
            setTimeout(function(){setVehiculo_(ocList[0].idVehiculo)},3000);
            setDMan(ocList[0].descMant)
            setPlantasF(ocList[0].planta)
            setBtnTxt('Actualizar')
            if(ocList[0].urlImg.length > 0){
                setVFile(false)
                setVImg(true)
                setUrlImg("http://apicatsa.catsaconcretos.mx:2543/Uploads/OC/"+ocList[0].urlImg)
            }
            setshRespuesta(true);
            setResp(ocList[0].respuesta)
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
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
    const deleteOC = async(id) => {
        try{
            const ocAutoriza = await delOCompra(id);
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Estamos obteniendo la información...',
                    didOpen: () => {
                        Swal.showLoading();  // Muestra la animación de carga
                    }
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
    const viewPDF = (id) =>{
        Swal.fire({
            title: "¿Descargar el PDF?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Descargar",
            denyButtonText: `Cancelar`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                generatePDF(id);
                Swal.fire("Descargado Correctamente", "", "success");
            } else if (result.isDenied) {
              Swal.fire("No se descargo", "", "info");
            }
          });
    }
     // Función para generar el PDF
    const generatePDF = async(id) => {
        try{
            const ocList = await getOComprasInd(id);
            // Si ocList[0].idVehiculo puede ser null o undefined
            let idVehiculoString = String(ocList[0]?.idVehiculo ?? "Valor no disponible");
            let nFactura = (ocList[0] && ocList[0].nFactura != null && typeof ocList[0].nFactura === 'string' && ocList[0].nFactura.trim() !== '') 
                ? ocList[0].nFactura 
                : '-';
            const doc = new jsPDF();
            const imgURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP3qFI_sXT_DHWAcUiaoXT_aJoW4V2E3qN3qHUZMG_q7vvjXNhf_KL8Zy_9iTTLkc72CY&usqp=CAU";
            //doc.addImage(imgURL, 'JPEG', 5, 5, doc.internal.pageSize.width, doc.internal.pageSize.height);
            doc.addImage(imgURL, 'JPEG', 5, 5, 40, 30);
            doc.addImage(imgURL, 'JPEG', 160, 5, 40, 30);
            // Colocar el texto del encabezado
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("Orden de Compra", 70, 30);  // Posición X, Y

            // Dibujar una línea debajo del encabezado
            doc.setLineWidth(0.5);  // Establece el grosor de la línea
            doc.line(10, 40, 200, 40);  // Dibuja una línea desde (10, 12) hasta (200, 12)
            doc.setFontSize(16);
            // Agregar contenido al PDF
            doc.setFont("helvetica", "regular");
            doc.text("No Orden Compra", 10, 50);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].ordenCompra, 60, 50);
            doc.setFont("helvetica", "regular");
            doc.text("Fecha", 100, 50);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].fecha, 120, 50);
            doc.setFont("helvetica", "regular");
            doc.text("Planta", 10, 70);
            doc.setFont("helvetica", "bold");  
            doc.text(ocList[0].planta, 30, 70);
            doc.setFont("helvetica", "regular");
            doc.text("No Factura", 60, 70);
            doc.setFont("helvetica", "bold");
            doc.text(nFactura, 90, 70);
            doc.setFont("helvetica", "regular");
            doc.text("Usuario", 120, 70);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].UserName, 150, 70);
            doc.setFont("helvetica", "regular");
            doc.text("Tipo Mantenimiento", 10, 100);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].tipoMant, 60, 100);
            doc.setFont("helvetica", "regular");
            doc.text("Grupo", 80, 100);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].Grupo, 100, 1000);
            doc.setFont("helvetica", "regular");
            doc.text("NoEconomico", 120, 100);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].NoEconomico, 160, 100);
            doc.setFont("helvetica", "regular");
            doc.text("Placas", 10, 120);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].Placas, 40, 120);
            doc.setFont("helvetica", "regular");
            doc.text("Descripción Mantenimiento", 10, 140);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].descMant, 10, 150);
            doc.setFont("helvetica", "regular");
            doc.text("Descripción", 10, 200);
            doc.setFont("helvetica", "bold");
            doc.text(ocList[0].descripcion, 10, 210);
            //PIE DE PAGINA
            const marginBottom = 40;  // Márgenes desde la parte inferior de la página
            doc.addImage(imgURL, 'JPEG', 160, doc.internal.pageSize.height - marginBottom, 40, 30);
            // Guardar el archivo PDF con el nombre "mi_archivo.pdf"
            doc.save("OC_"+ocList[0].ordenCompra+".pdf");
            
            // Cerrar el modal después de generar el PDF
            handleClose();
        }catch(error){
            console.log(error)
        }
        
    };
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
    const colOC = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"200px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsOperacion || userIsJP) && row.estatus === '1' && (
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            color="primary"
                            onClick={() => addOC(row.id)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilSave} />
                        </CButton>
                        </CCol>
                    )}
                    {(userIsOperacion || userIsJP) && (row.estatus === '2' || row.estatus === '3') && (
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            color="info"
                            onClick={() => viewPDF(row.id)}
                            size="sm"
                            className="me-2"
                            title="Ver Orden Compra"
                        >
                            <CIcon icon={cilShareAlt} style={{'color':'white'}} />
                        </CButton>
                        </CCol>
                    )}
                    {userIsOperacion && row.estatus === '2' && (
                        <CCol xs={6} md={2}>
                        <CButton
                            color="dark"
                            onClick={() => setNFactura(row.id)}
                            size="sm"
                            className="me-2"
                            title="Agregar Número de Factura"
                        >
                            <CIcon icon={cilTag} style={{'color':'white'}} />
                        </CButton>
                        </CCol>
                    )}
                    {userIsOperacion && row.estatus === '1' &&( 
                        <CCol xs={6} md={2}>
                        <CButton
                            color="warning"
                            onClick={() => autorizaOC(row.id)}
                            size="sm"
                            className="me-2"
                            title="Autorizar"
                            style={{color:'white'}}
                        >
                            <CIcon icon={cilCheck} />
                        </CButton>
                        </CCol>
                    )}
                    {...((userIsOperacion || !userIsJP) && row.estatus !== '3'
                        ? [
                        <CCol xs={6} md={2}>
                            <CButton
                                color="danger"
                                onClick={() => deleteOC(row.id)}
                                size="sm"
                                className="me-2"
                                title="Eliminar"
                                style={{color:'white'}}
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                        ]:[])
                    }
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Estatus',
            selector: row => {
                const aux = row.estatus;
                if (aux === '0' ) {
                    return <CBadge textBgColor='danger'>Eliminado</CBadge>;
                }else if(aux === '2'){
                    return <CBadge color='success' shape='rounded-pill'>Aprobada</CBadge>;
                }else if(aux === '3'){
                    return <CBadge color='warning' shape='rounded-pill'>Finalizada</CBadge>;
                }else{
                    return <CBadge textBgColor='primary'>En Proceso</CBadge>;
                }
                return aux;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Planta',
            selector: row => {
                const aux = row.planta;
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
        {
            name: 'No. OC',
            selector: row => {
                const aux = row.ordenCompra;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Usuario',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Fecha',
            selector: row => {
                const fecha = row.fecha;
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
            name: 'Mantenimiento',
            selector: row => {
                const aux = row.tipoMant;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Unidad',
            selector: row => {
                const aux = row.idVehiculo;
                const neco = "("+row.Grupo+")"+row.NoEconomico;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return neco;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Descripción',
            selector: row => {
                const aux = row.descMant;
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
            name: 'Descripción Problema',
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
            width:"600px",
            sortable:true,
            grow:1,
        },
    ];
    //------------
    useEffect(() => {
        //getProductosInt_(null);
    }, []);
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
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtOrdenes.filter(dtOrdenes => 
            dtOrdenes.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTOrdenes(valFiltrados);
            setExOc(valFiltrados);
        }else{
            gOC()
        }
    };
    const fDOrdenes = dtOrdenes.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.UserName.toLowerCase().includes(fText.toLowerCase()) || item.ordenCompra.includes(fText) || item.planta.includes(fText) || item.tipoMant.includes(fText);
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
    const ocFca = (fcaF) => {
        setFechaOC(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const newOC = () =>{
        setVOC(true)
        setNorden('');
        setFactura("");
        setDescripcion("");
        setDMan("-");
        setVehiculo_("-");
        setTipoMantenimiento("-");
        setPlantasF("-");
        setBtnTxt("Guardar")
        setVFile(true)
        setVImg(false)
    }
    const categoriasFiltradas = aDescripcion.filter(item => {
        switch(tipoMantenimiento){
            case "PLANTAS":
                return item.Categoria === 1;
            case "TR":
                return item.Categoria === 2;
            case "TB":
                return item.Categoria === 3;
            case "TX":
                return item.Categoria === 4;
            case "GN":
                return item.Categoria === 5;
            case "REHABILITACIÓN":
                return item.Categoria === 8;
            default:
                return false;
        }
        return true; // Si no se seleccionó "REHABILITACIÓN", muestra todo
    });
    const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
        <CFormInput {...props} ref={inputRef} />
    ))
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const handleTipoMantenimientoChange = (e) => {
        setTipoMantenimiento(e.target.value);
        getVehiculo(plantasSelF, e.target.value);
    };
    const handleDescMant = (e) => {
        setDMan(e.target.value);
    }
    const hVehiculo = (e) => {
        setVehiculo_(e.target.value);
    }
    const onRespuesta = (e) => {
        setResp(e.target.value);
    };
    //************************************************************************************************************************************************************************************* */
    const onSaveOC = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        var tipo = idOC == '0' ? '0':idOC == ''? '0':'1';
        // Crear un objeto FormData
        const formData = {
            id: idOC,
            planta: plantasSelF,
            fecha: fechaOC,
            nFactura: nFactura,
            descripcion: descripcion,
            tipoMant: tipoMantenimiento,
            idVehiculo: vehiculo,
            descMant: descMan,
            respuesta:respuesta,
            file: file,
        };
        saveOCompra(formData,tipo);
    }
    const saveOCompra = async (data, tipo) => {
        try{
            const ocList = await setOCompra(data,tipo);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            setVOC(false);
            gOC();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Orden Compra </h3>
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
                <CCol xs={6} md={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='primary' onClick={getOComprasBtn}> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='success' onClick={newOC} style={{'color':'white'}} > 
                        <CIcon icon={cilPlus} />
                            Agregar OC
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='danger' onClick={downloadCSV}>
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
                        columns={colOC}
                        data={fDOrdenes}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vOC}
                onClose={() => setVOC(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">OC</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={2}>
                            <CFormInput
                                type="text"
                                label="Número de Orden"
                                placeholder="N. Orden"
                                value={nOrden}
                                onChange={nOrdenCh}
                                disabled
                            />
                        </CCol>
                        <CCol xs={6} md={2}>
                            <Plantas  
                                mCambio={mCambioF}
                                plantasSel={plantasSelF}
                            />
                        </CCol>
                        <CCol xs={6} md={2}>
                            <label>Fecha</label>
                            <div className='mt-2'>
                                <DatePicker 
                                    id='fcaF'
                                    selected={fechaOC} 
                                    onChange={ocFca} 
                                    placeholderText='Selecciona Fecha' 
                                    dateFormat="yyyy/MM/dd" />
                            </div>
                        </CCol>
                        <CCol xs={6} md={2}>
                            <CFormInput
                                type="text"
                                label="Número Factura"
                                placeholder="Número de Factura"
                                value={nFactura}
                                onChange={nFacturaCh}
                                disabled
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={12} md={3}>
                            <label>Tipo de mantenimiento</label>
                            <CFormSelect size="lg" className="mb-3" aria-label="Interfaz"
                                value={tipoMantenimiento}
                                onChange={handleTipoMantenimientoChange}
                            >
                                <option>-</option>
                                <option value="PLANTAS">PLANTAS</option>
                                <option value="TR">TR</option>
                                <option value="TB">TB</option>
                                <option value="TX">TX</option>
                                <option value="GN">GN</option>
                                <option value="AU">AU</option>
                                <option value="PC">PC</option>
                                <option value="REHABILITACIÓN">REHABILITACIÓN</option>
                            </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label>Vehículo</label>
                            <CFormSelect size="lg" className="mb-3" aria-label="Descripción" value={vehiculo} onChange={hVehiculo}>
                            <option value='-'>-</option>
                            {cmbVehiculo.map((item, index) => (
                                <option key={index} value={item.IdRegistro}>({item.NoEconomico}) {item.Modelo} ({item.Placas})</option>
                            ))}
                            </CFormSelect>
                        </CCol>
                        <CCol xs={12} md={5}>
                            <label>Descripción</label>
                            <CFormSelect size="lg" className="mb-3" aria-label="Descripción" value={descMan} onChange={handleDescMant}>
                            <option value='-'>-</option>
                            {categoriasFiltradas.map((item, index) => (
                                <option key={index} value={item.descripcion}>{item.descripcion}</option>
                            ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={12} md={12}>
                            <CFormTextarea
                                className="mb-3"
                                placeholder="Descripción"
                                aria-label="Descripción"
                                label="Descripción"
                                value={descripcion}
                                onChange={onDescripcion}
                            ></CFormTextarea>
                        </CCol>
                    </CRow>
                    {shRespuesta && (
                        <CRow className='mt-2 mb-2'>
                            <CCol xs={12} md={12}>
                                <CFormTextarea
                                    className="mb-3"
                                    placeholder="Respuesta"
                                    aria-label="Res"
                                    label="Respuesta"
                                    value={respuesta}
                                    onChange={onRespuesta}
                                    disabled={shDisR}
                                ></CFormTextarea>
                            </CCol>
                        </CRow>
                    )}
                    <CRow className='mt-2 mb-2'>
                        {vFile && (
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="file"
                                id="frmFile"
                                label="Agregar Imagén"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </CCol>
                        )}
                        {vImg&& (
                            <CCol xs={6} md={3}>
                                <CImage rounded thumbnail src={urlImg} width={500} height={320} />
                            </CCol>
                        )}
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSaveOC} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
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
export default OCompra