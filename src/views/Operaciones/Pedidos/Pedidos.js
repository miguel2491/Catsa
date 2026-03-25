import React, {useEffect, useState, useRef} from 'react'
import '../../../estilos.css';
import Swal from "sweetalert2";
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import "./Stylepedidos.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { getPedidosList, getPedidosCanList, getPedidosIncidencia, getPedidosModificaciones, convertArrayOfObjectsToCSV, fNumber, 
    getPedidosMultimedia
} from '../../../Utilidades/Funciones';
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormTextarea,
  CTable, CTableHead, CTableRow, CTableHeaderCell,CTableBody,CTableDataCell,
  CTab, CTabContent, CTabList, CTabPanel, CTabs,
  CFormCheck,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBackspace,
  cilCut,
  cilCloudDownload,
  cilCloudUpload,
  cilCopy,
  cilFile,
  cilImage,
  cilLevelDown,
  cilLocationPin,
  cilPlus,
  cilSearch,
  cilSmilePlus,
  cilTrash,
  cilSave
} from '@coreui/icons'

import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import { Rol } from '../../../Utilidades/Roles'
import { format } from 'date-fns';

const Pedidos = () => {    
    const navigate = useNavigate();
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [posts, setPosts] = useState([]);
    //--------------- TABLES --------------------------------
    const [Contado , setContado] = useState(0.0);
    const [Credito , setCredito] = useState(0.0);
    const [Requerido , setRequerido] = useState(0.0);
    const [Disponible , setDisponible] = useState(0.0);
    const [Cemento , setCemento] = useState(0.0);
    const [Arena , setArena] = useState(0.0);
    const [Grava , setGrava] = useState(0.0);
    const [Programados , setProgramados] = useState(0.0);
    const [Eliminados , setEliminados] = useState(0.0);
    const [SinAdjuntos , setSinAdj] = useState(0.0);
    const [Totales , setTotales] = useState(0.0);
    const [TM3 , setTM3] = useState(0.0);
    const [TSBomba , setTSBomba] = useState(0.0);
    const [TCBomba , setTCBomba] = useState(0.0);
    const [PM3 , setPM3] = useState(0.0);
    const [PSBomba , setPSBomba] = useState(0.0);
    const [PCBomba , setPCBomba] = useState(0.0);
    //--------------- MODALS ---------------------------------
    const [mIncidencia, setMIncidencia] = useState(false);
    const [mModificaciones, setMModificaciones] = useState(false);
    const [mIdPedido, setMIdPedido] = useState(0);
    const [mMultimedia, setMMulti] = useState(false);
    const [tMultimedia, setTMultimedia] = useState(0);
    //------------------Shows---------------------------------
    const [shDiv, setShDiv] = useState(false);

    //Cliente
    const[n_cliente, setNClie] = useState("");
    const[n_obra, setNObra] = useState("");
    const[txtNombre, setTxtNombre] = useState("");
    const [comentarioInci, setComentarioInci] = useState("");
    //--DT Pedidos
    const [dtPedidos, setDTPedidos] = useState([]);
    const [dtPedidosSA, setDTPedidosSA] = useState([]);
    const [dtPedidosAll, setDTPedidosAll] = useState([]);
    const [dtPedidosCan, setDTPedidosCan] = useState([]);
    const [dtIncidencia, setDTIncidencia] = useState([]);
    const [dtModificaciones, setDTModificaciones] = useState([]);
    //EXTRAS
    const [dtNCliente, setDTNCliente] = useState([]);
    //--------------------------- Buscador --------------------------------------
    const [fTextSP, setFTextSP] = useState(''); 
    const [vBSP, setBSP] = useState('');
    const [fTextSA, setFTextSA] = useState(''); 
    const [vBSA, setBSA] = useState('');
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    // ROLES
    const userIsAdmin = Rol('Admin');
    useEffect(()=>{    
        if(plantasSel.length > 0)
        {
            btnBuscar();
        }
    },[]);
    //-----------------------------------------------------------------------------------
    const mCambio = (event) => {
        const pla = event.target.value; 
        setPlantas(pla);
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const toggleAutorizado = (idpedido, status) => {
        //     setDTCostos(prev =>
        //     prev.map(item =>
        //     item.Material === material
        //         ? { ...item, Flag_autorizado: status }
        //         : item
        //     )
        // );
    };
    //---------------------------- BOTONS --------------------------------------------
    const btnBuscar = async() =>{
        setShDiv(false);
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
            const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
            const pedido = await getPedidosList(plantasSel,auxFcaI, auxFcaF);
            const pedCan = await getPedidosCanList(plantasSel, auxFcaI, auxFcaF);
            const pedidosPro = pedido.filter(p => p.Archivos===true);
            Swal.close();  // Cerramos el loading
            let peli = 0;
            let pm3 = 0;
            let psb = 0;
            let pcb = 0;
            let ppro = 0;
            let psad = 0;
            if(pedCan)
            {
                pedCan.forEach((item, index) =>{
                    peli += parseFloat(item.M3);
                });
                setEliminados(peli.toFixed(2));
            }
            if(pedido)
            {
                pedido.forEach((item, index) => {
                    if(item.VistoBueno && item.activo)
                    {
                        pm3 += parseFloat(item.M3);
                    }
                    if(item.CodBomba == "" && item.Archivos && item.activo)
                    {
                        psb += parseFloat(item.M3);
                    }
                    if(item.CodBomba !== "" && item.Archivos && item.activo){
                        pcb += parseFloat(item.M3);
                    }
                    if(item.Archivos)
                    {
                        ppro += parseFloat(item.M3);
                    }
                    if(!item.Archivos)
                    {
                        psad += parseFloat(item.M3)
                    }
                })
                setPM3(pm3);
                setPCBomba(pcb);
                setPSBomba(psb);
                setProgramados(ppro.toFixed(2));
                setSinAdj(psad.toFixed(2));
            }
            if(pedidosPro){
                let tm3 = 0;
                let tsb = 0;
                let tcb = 0;
                let pco = 0;
                let pcr = 0;
                let pcem = 0;
                let pare = 0;
                let pgra = 0;
                
                let ptot = 0;
                pedidosPro.forEach((item, index) => {
                    tm3 += parseFloat(item.M3);
                    if(item.CodBomba !== ""){
                        tcb += parseFloat(item.M3);
                    }else{
                        tsb += parseFloat(item.M3);
                    }
                    if(item.Pago === "Contado" && item.activo)
                    {
                        pco += parseFloat(item.Total);
                    }else if(item.Pago !== "Contado" && item.activo){
                        pcr += parseFloat(item.Total);
                    }
                    
                    if(!item.Archivos)
                    {
                        psad += parseFloat(item.M3);
                    }
                    pcem += parseFloat(item.Cemento);
                    pare += parseFloat(item.Arena);
                    pgra += parseFloat(item.Grava);
                });

                setTM3(tm3);
                setTSBomba(tsb);
                setTCBomba(tcb);
                setContado(pco.toFixed(2));
                setCredito(pcr.toFixed(2));
                const totalm = ppro + psad + peli;
                setTotales(totalm.toFixed(2));
                setCemento(pcem.toFixed(2));
                setArena(pare.toFixed(2));
                setGrava(pgra.toFixed(2));
                setShDiv(true)
                setDTPedidos(Array.isArray(pedidosPro) ? pedidosPro : []);
                const sapedidos = pedido.filter(p => p.Archivos===false);
                setDTPedidosSA(Array.isArray(sapedidos) ? sapedidos : []);
                setDTPedidosAll(Array.isArray(pedido) ? pedido : []);
                setDTPedidosCan(Array.isArray(pedCan) ? pedCan : []);
            }
        } catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }    
    }
    //=================================================================================
    const cPedido = async(idPedido) => {
        Swal.fire({
            title: '¿Deseas copiar Pedido?',
            icon: "warning",
            html: `
                <input type="text" id="Volumen" class="swal2-input" placeholder="Introduce Volumen">
                <input type="text" id="M3_Viaje" class="swal2-input" placeholder="Introduce M3 Viaje">
                <input type="date" id="Fecha" class="swal2-input txtFecha" placeholder="Fecha">
                <input type="time" id="Hra" class="swal2-input txtFecha" placeholder="Hora">
                <input type="text" id="IdCotizacion" class="swal2-input txtCotizacion" placeholder="Número de Cotización">
            `,
            showCancelButton: true,
            confirmButtonText: 'Copiar',
            focusConfirm: false,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            // Si el usuario confirma la acción y se obtuvieron las contraseñas
            if (result.isConfirmed && result.value) {
            const newPassword = result.value
    
            // 2) Petición POST al endpoint para cambiar la contraseña
            return fetch('https://apicatsa.catsaconcretos.mx:2543/api/Login/ResetPass', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                UserId: userId,
                Password: newPassword,
                }),
            })
                .then(async (response) => {
                if (!response.ok) {
                    // Intentamos extraer texto del error para más detalles
                    const errorText = await response.text()
                    throw new Error(errorText || 'Error al cambiar la contraseña')
                }
                return response.json()
                })
                .then((data) => {
                // Aquí podrías usar "data" si tu API retorna algún valor adicional
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La contraseña se cambió correctamente. Por favor, inicia sesión de nuevo.',
                    icon: 'success',
                }).then(() => {
                    // 3) Forzamos al usuario a cerrar sesión
                    cerrarSesion()
                })
                })
                .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: `No se pudo cambiar la contraseña: ${error.message}`,
                    icon: 'error',
                })
                })
            }
        })
    }
    const rAjuste = async(idPedido) => {
        Swal.fire({
            title: "¿Deseas realizar ajuste?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ajustar",
            denyButtonText: "Cancelar",
            html: `
                <input type="text" id="ajusteInput" class="swal2-input" placeholder="Introduce el valor del ajuste">
            `, 
        }).then((result) => {
            // Si el usuario confirma la acción y se obtuvieron las contraseñas
            if (result.isConfirmed && result.value) {
            const newPassword = result.value
    
            // 2) Petición POST al endpoint para cambiar la contraseña
            return fetch('https://apicatsa.catsaconcretos.mx:2543/api/Login/ResetPass', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                UserId: userId,
                Password: newPassword,
                }),
            })
                .then(async (response) => {
                if (!response.ok) {
                    // Intentamos extraer texto del error para más detalles
                    const errorText = await response.text()
                    throw new Error(errorText || 'Error al cambiar la contraseña')
                }
                return response.json()
                })
                .then((data) => {
                // Aquí podrías usar "data" si tu API retorna algún valor adicional
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La contraseña se cambió correctamente. Por favor, inicia sesión de nuevo.',
                    icon: 'success',
                }).then(() => {
                    // 3) Forzamos al usuario a cerrar sesión
                    cerrarSesion()
                })
                })
                .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: `No se pudo cambiar la contraseña: ${error.message}`,
                    icon: 'error',
                })
                })
            }
        })
    }
    const delDoc = async(idPedido) => {
        Swal.fire({
            title: '¿Deseas quitar el Doc Adjunto?',
            icon: "warning",
            html: `
                -
            `,
            showCancelButton: true,
            confirmButtonText: 'Quitar',
            focusConfirm: false,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            // Si el usuario confirma la acción y se obtuvieron las contraseñas
            if (result.isConfirmed && result.value) {
            const newPassword = result.value
    
            // 2) Petición POST al endpoint para cambiar la contraseña
            return fetch('https://apicatsa.catsaconcretos.mx:2543/api/Login/ResetPass', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                UserId: userId,
                Password: newPassword,
                }),
            })
                .then(async (response) => {
                if (!response.ok) {
                    // Intentamos extraer texto del error para más detalles
                    const errorText = await response.text()
                    throw new Error(errorText || 'Error al cambiar la contraseña')
                }
                return response.json()
                })
                .then((data) => {
                // Aquí podrías usar "data" si tu API retorna algún valor adicional
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La contraseña se cambió correctamente. Por favor, inicia sesión de nuevo.',
                    icon: 'success',
                }).then(() => {
                    // 3) Forzamos al usuario a cerrar sesión
                    cerrarSesion()
                })
                })
                .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: `No se pudo cambiar la contraseña: ${error.message}`,
                    icon: 'error',
                })
                })
            }
        })
    }
    const delPedido = async(idPedido) => {
        Swal.fire({
            title: '¿Deseas eliminar el Pedido?',
            icon: "warning",
            html: `
                -
            `,
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            focusConfirm: false,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            // Si el usuario confirma la acción y se obtuvieron las contraseñas
            if (result.isConfirmed && result.value) {
            const newPassword = result.value
    
            // 2) Petición POST al endpoint para cambiar la contraseña
            return fetch('https://apicatsa.catsaconcretos.mx:2543/api/Login/ResetPass', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                UserId: userId,
                Password: newPassword,
                }),
            })
                .then(async (response) => {
                if (!response.ok) {
                    // Intentamos extraer texto del error para más detalles
                    const errorText = await response.text()
                    throw new Error(errorText || 'Error al cambiar la contraseña')
                }
                return response.json()
                })
                .then((data) => {
                // Aquí podrías usar "data" si tu API retorna algún valor adicional
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La contraseña se cambió correctamente. Por favor, inicia sesión de nuevo.',
                    icon: 'success',
                }).then(() => {
                    // 3) Forzamos al usuario a cerrar sesión
                    cerrarSesion()
                })
                })
                .catch((error) => {
                Swal.fire({
                    title: 'Error',
                    text: `No se pudo cambiar la contraseña: ${error.message}`,
                    icon: 'error',
                })
                })
            }
        })
    }
    // ============================= MODALS =============================================
    const mPIncidencia = async(idPedido) =>{
        setMIncidencia(true);
        setMIdPedido(idPedido);
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const pedIncidencia = await getPedidosIncidencia(idPedido);
            setDTIncidencia(pedIncidencia);
            Swal.close();
        }
        catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } 
    }
    const mPModificacion = async(idPedido) =>{
        setMModificaciones(true);
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const pedModificaciones = await getPedidosModificaciones(idPedido);
            setDTModificaciones(pedModificaciones);
            Swal.close();
        }
        catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } 
    }
    const mVistaPrevia = async(idPedido) =>{
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const data = await getPedidosMultimedia(idPedido);
            Swal.close();
            var archi = data.base64;
            //setMMulti(true);
            //setTMultimedia(0);
            var previewHtml = "";
            if (archi.startsWith("data:image")) {
                // Si es una imagen
                previewHtml = `<h4>Vista previa de la imagen:</h4>
                <img src="${archi}" alt="Vista previa de la imagen" style="max-width: 100%; height: auto;">`;
            } else if (archi.startsWith("data:application/pdf")) {
                // Si es un PDF
                previewHtml = `<h4>Vista previa del PDF:</h4>
                <iframe src="${archi}" width="100%" height="500px"></iframe>`;
            } else {
                alert("El archivo no es compatible para mostrar una vista previa.");
                return;
            }
            Swal.fire({
                title: 'Vista Previa',
                html: previewHtml,
                showCloseButton: true,
                confirmButtonText: 'Cerrar',
                width: '80%',
                heightAuto: true,
            });
        }
        catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } 
    }
    //=================================================================================
    const saveComentario = async() => {
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const pedComentario = await setPedidoComentario(mIdPedido, comentarioInci);
            Swal.close();
        }
        catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } 
    }
    //--------------------------- COLS -----------------------------------------------
    const colPedido = [
        {
            name: 'Acciones',
            selector: row => row.id,
            width:"220px",
            cell: (row) => (
                <div>
                    <CRow>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="danger"
                            onClick={() => delPedido(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Borrar"
                        >
                            <CIcon icon={cilTrash} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="warning"
                            onClick={() => delDoc(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Quitar Doc"
                        >
                            <CIcon icon={cilCut} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="success"
                            onClick={() => rAjuste(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Realizar Ajuste"
                        >
                            <CIcon icon={cilLevelDown} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="info"
                            onClick={() => cPedido(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Copiar Pedido"
                        >
                            <CIcon icon={cilCopy} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="primary"
                            onClick={() => mPIncidencia(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Ver Incidencia"
                        >
                            <CIcon icon={cilSmilePlus} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="secondary"
                            onClick={() => mPModificacion(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Ver Modificaciones"
                        >
                            <CIcon icon={cilPlus} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="warning"
                            onClick={() => window.open("https://www.google.com/maps?q="+row.UTM,"_blank")}
                            size="sm"
                            className="me-2"
                            title="Ver Coordenadas"
                        >
                            <CIcon icon={cilLocationPin} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'PROGRAMAR',
            sortable:true,
            selector: row => row.IdPedido,
            width:"120px",
            cell:(row) => (
                <div>
                    <CRow>
                        <CCol xs={3} md={3} lg={3}>
                            <CFormCheck id={`cbVBueno${row.IdPedido}`} className='mt-4' style={{'width':'30px','height':'25px'}} checked={row.activo} onChange={(e) => toggleAutorizado(row.IdPedido, e.target.checked)} />
                        </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'VISTO BUENO',
            selector: row => row.IdPedido,
            sortable:true,
            width:"120px",
            cell:(row) => (
                <div>
                    <CRow>
                        <CCol xs={3} md={3} lg={3}>
                            <CFormCheck id={`cbVBueno${row.IdPedido}`} className='mt-4' style={{'width':'30px','height':'25px'}} checked={row.VistoBueno} onChange={(e) => toggleAutorizado(row.IdPedido, e.target.checked)} />
                        </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'No. PEDIDO',
            selector: row =>{ 
                let Pedido = row.IdPedido;
                if(Pedido === null || Pedido === undefined)
                {
                    Pedido = "-";
                }
                if(typeof Pedido === 'object')
                {
                    Pedido = "-";
                }
                return <CBadge color="secondary">{Pedido}</CBadge>
            },
            width:"120px",
            sortable:true,
        },
        {
            name: 'PLANTA',
            selector: row => row.PlantaEnvio,
            sortable:true,
            width:"120px",
        },
        {
            name: 'ASESOR',
            selector: row => {
                var Asesor = row.Asesor
                if (Asesor === null || Asesor === undefined) {
                    Asesor = "-";
                }
                if (typeof Asesor === 'object') {
                    Asesor = "-"; // O cualquier mensaje que prefieras
                }
                return Asesor;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'CLIENTE',
            selector: row => {
                var ncliente = row.NoCliente
                if (ncliente === null || ncliente === undefined) {
                    ncliente =  "-";
                }
                if (typeof ncliente === 'object') {
                    ncliente = "-"; // O cualquier mensaje que prefieras
                }
                var cliente = row.Cliente
                if (cliente === null || cliente === undefined) {
                    cliente =  "-";
                }
                if (typeof cliente === 'object') {
                    cliente = "-"; // O cualquier mensaje que prefieras
                }
                return ncliente+"/"+cliente;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'OBRA',
            selector: row => {
                let NoObra = row.NoObra;
                if (NoObra === null || NoObra === undefined) {
                return "No disponible";
                }
                if (typeof NoObra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                const Obra = row.Obra;
                if (Obra === null || Obra === undefined) {
                return "No disponible";
                }
                if (typeof Obra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                return NoObra+"/"+Obra;
            },
            sortable:true,
            width:"350px",
        },    
        {
            name: 'DIRECCIÓN',
            selector: row => {
                const direccion = row.Direccion
                if (direccion === null || direccion === undefined) {
                    return "No disponible";
                }
                if (typeof direccion === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return direccion;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'PRODUCTO',
            selector: row => {
                const Producto = row.Producto
                if (Producto === null || Producto === undefined) {
                    return "No disponible";
                }
                if (typeof Producto === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return Producto;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'M3',
            selector: row => {
                const cantidad = row.M3
                if (cantidad === null || cantidad === undefined) {
                return "No disponible";
                }
                if (typeof cantidad === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return cantidad;
            },
            sortable:true,
            width:"80px",
        },
        {
            name: 'BOMBA',
            selector: row => {
                const bomba = row.CodBomba
                if (bomba === null || bomba === undefined) {
                return "No disponible";
                }
                if (typeof bomba === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return bomba;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'FECHA ENTREGA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'HRA LLEGADA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'HR SALIDA',
            selector: row => {
                const hrsSalida = row.hrSalida
                if (hrsSalida === null || hrsSalida === undefined) {
                return "No disponible";
                }
                if (typeof hrsSalida === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return hrsSalida;
            },
            sortable:true,
            width:"160px",
        },
        {
            name: 'T. RECORRIDO',
            selector: row => {
                const trecorrido = row.Recorrido
                if (trecorrido === null || trecorrido === undefined) {
                return "No disponible";
                }
                if (typeof trecorrido === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trecorrido;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'TIEMPO REAL',
            selector: row => {
                const trealAprox = row.TiempoReal
                if (trealAprox === null || trealAprox === undefined) {
                return "No disponible";
                }
                if (typeof trealAprox === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trealAprox;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'ESPACIADO',
            selector: row => {
                const espaciado = row.Espaciado
                if (espaciado === null || espaciado === undefined) {
                return "No disponible";
                }
                if (typeof espaciado === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return espaciado;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'ESTATUS',
            selector: row => {
                const autorizo = row.Recibe
                if (autorizo === null || autorizo === undefined) {
                return "No disponible";
                }
                if (typeof autorizo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return autorizo;
            },
            sortable:true,
            width:"100px",
        },
        {
            name: 'PRECIO PRODUCTO',
            selector: row => {
                const PrecioProducto = row.PrecioProducto
                if (PrecioProducto === null || PrecioProducto === undefined) {
                return 0;
                }
                if (typeof PrecioProducto === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return "$ "+fNumber(PrecioProducto);
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'PRECIO BOMBEO',
            selector: row => {
                const precioB = row.PrecioBomba
                if (precioB === null || precioB === undefined) {
                return 0;
                }
                if (typeof precioB === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return "$ "+fNumber(precioB);
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'PRECIO EXTRA',
            selector: row => {
                const pExtra = row.PrecioExtra
                if (pExtra === null || pExtra === undefined) {
                return 0;
                }
                if (typeof pExtra === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return "$ "+fNumber(pExtra);
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'IMPORTE TOTAL A PAGAR',
            selector: row => {
                const itotal = row.Total
                if (itotal === null || itotal === undefined) {
                return 0;
                }
                if (typeof itotal === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return "$ "+fNumber(itotal);
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'SALDO ANTICIPO',
            selector: row => {
                const sAnticipo = row.SaldoAnticipo
                if (sAnticipo === null || sAnticipo === undefined) {
                return 0;
                }
                if (typeof sAnticipo === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return "$ "+fNumber(sAnticipo);
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'MARGEN BRUTO REAL',
            selector: row => {
                const mBrutoReal = row.PrecioProducto
                if (mBrutoReal === null || mBrutoReal === undefined) {
                return 0;
                }
                if (typeof mBrutoReal === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(mBrutoReal);
            },
            sortable:true,
            width:"160px",
        },
        {
            name: 'FORMA PAGO',
            selector: row => {
                const fPago = row.Pago
                if (fPago === null || fPago === undefined) {
                return "No disponible";
                }
                if (typeof fPago === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return fPago;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'OBSERVACIONES',
            selector: row => {
                const observaciones = row.Observaciones ?? "No disponible";

                return (
                <textarea
                    style={{ width: "100%", resize: "vertical" }}
                    value={observaciones}
                    onChange={e => handleObservacionesChange(row.IdPedido, e.target.value)}
                />
                );
            },
            sortable:true,
            width:"400px",
        },
        {
            name: 'CREO',
            selector: row => {
                const creo = row.UsuarioCreo
                if (creo === null || creo === undefined) {
                return "No disponible";
                }
                if (typeof creo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return creo;
            },
            sortable:true,
            width:"120px",
        },
        {
            name: 'ACTUALIZO',
            selector: row => {
                const autorizo = row.UsuarioActualizo
                if (autorizo === null || autorizo === undefined) {
                return "No disponible";
                }
                if (typeof autorizo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return autorizo;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'DOCUMENTOS',
            selector: row => row.IdPedido,
            sortable:true,
            width:"200px",
            cell:(row) => (
                <div>
                    <CRow>
                        {!row.Archivos ? (
                        <CCol xs={6} md={6} lg={6}>
                            <CButton
                                color="primary"
                                onClick={() => mBorrarP(row.IdPedido)}
                                size="sm"
                                className="me-2"
                                title="Subir Archivo"
                            >
                                <CIcon icon={cilCloudUpload} style={{'color':'white'}} />
                            </CButton>
                        </CCol>
                        ):(
                        <CCol xs={6} md={6} lg={6}>
                            <CButton
                                color="warning"
                                onClick={() => mVistaPrevia(row.IdPedido)}
                                size="sm"
                                className="me-2"
                                title="Vista Previa"
                            >
                                <CIcon icon={cilImage} style={{'color':'white'}} />
                            </CButton>
                        </CCol>
                        )}
                    </CRow>
                </div>
            ),
        },
        {
            name: 'ACTUALIZO VB',
            selector: row => {
                const autorizo = row.UsuarioCyC
                if (autorizo === null || autorizo === undefined) {
                return "No disponible";
                }
                if (typeof autorizo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return autorizo;
            },
            sortable:true,
            width:"150px",
        },
    ];
    const colPedidoSA = [
        {
            name: 'Acciones',
            selector: row => row.id,
            width:"250px",
            cell: (row) => (
                <div>
                    <CRow>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="danger"
                            onClick={() => mBorrarP(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Borrar"
                        >
                            <CIcon icon={cilTrash} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="warning"
                            onClick={() => mBorrarP(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Programar"
                        >
                            <CIcon icon={cilFile} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="primary"
                            onClick={() => mBorrarP(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Regresar"
                        >
                            <CIcon icon={cilBackspace} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    <CCol xs={2} md={2} lg={2}>
                        <CButton
                            color="success"
                            onClick={() => mBorrarP(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Adjuntar Archivo"
                        >
                            <CIcon icon={cilCloudUpload} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'No. PEDIDO',
            selector: row =>{ 
                let Pedido = row.IdPedido;
                if(Pedido === null || Pedido === undefined)
                {
                    Pedido = "-";
                }
                if(typeof Pedido === 'object')
                {
                    Pedido = "-";
                }
                return <CBadge color="secondary">{Pedido}</CBadge>
            },
            width:"120px",
            sortable:true,
        },
        {
            name: 'PLANTA',
            selector: row => row.PlantaEnvio,
            sortable:true,
            width:"120px",
        },
        {
            name: 'ASESOR',
            selector: row => {
                var Asesor = row.Asesor
                if (Asesor === null || Asesor === undefined) {
                    Asesor = "-";
                }
                if (typeof Asesor === 'object') {
                    Asesor = "-"; // O cualquier mensaje que prefieras
                }
                return Asesor;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'CLIENTE',
            selector: row => {
                var ncliente = row.NoCliente
                if (ncliente === null || ncliente === undefined) {
                    ncliente =  "-";
                }
                if (typeof ncliente === 'object') {
                    ncliente = "-"; // O cualquier mensaje que prefieras
                }
                var cliente = row.Cliente
                if (cliente === null || cliente === undefined) {
                    cliente =  "-";
                }
                if (typeof cliente === 'object') {
                    cliente = "-"; // O cualquier mensaje que prefieras
                }
                return ncliente+"/"+cliente;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'OBRA',
            selector: row => {
                const NoObra = row.NoObra;
                if (NoObra === null || NoObra === undefined) {
                return "No disponible";
                }
                if (typeof NoObra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                const Obra = row.Obra;
                if (Obra === null || Obra === undefined) {
                return "No disponible";
                }
                if (typeof Obra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                return NoObra+"/"+Obra;
            },
            sortable:true,
            width:"350px",
        },    
        {
            name: 'DIRECCIÓN',
            selector: row => {
                const direccion = row.Direccion
                if (direccion === null || direccion === undefined) {
                    return "No disponible";
                }
                if (typeof direccion === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return direccion;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'PRODUCTO',
            selector: row => {
                const Producto = row.Producto
                if (Producto === null || Producto === undefined) {
                    return "No disponible";
                }
                if (typeof Producto === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return Producto;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'M3',
            selector: row => {
                const cantidad = row.M3
                if (cantidad === null || cantidad === undefined) {
                return "No disponible";
                }
                if (typeof cantidad === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return cantidad;
            },
            sortable:true,
            width:"80px",
        },
        {
            name: 'FECHA ENTREGA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'HRA LLEGADA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'HR SALIDA',
            selector: row => {
                const hrsSalida = row.hrSalida
                if (hrsSalida === null || hrsSalida === undefined) {
                return "No disponible";
                }
                if (typeof hrsSalida === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return hrsSalida;
            },
            sortable:true,
            width:"160px",
        },
        {
            name: 'T. RECORRIDO',
            selector: row => {
                const trecorrido = row.Recorrido
                if (trecorrido === null || trecorrido === undefined) {
                return "No disponible";
                }
                if (typeof trecorrido === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trecorrido;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'TIEMPO REAL',
            selector: row => {
                const trealAprox = row.TiempoReal
                if (trealAprox === null || trealAprox === undefined) {
                return "No disponible";
                }
                if (typeof trealAprox === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trealAprox;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'ESPACIADO',
            selector: row => {
                const espaciado = row.Espaciado
                if (espaciado === null || espaciado === undefined) {
                return "No disponible";
                }
                if (typeof espaciado === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return espaciado;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'PRECIO PRODUCTO',
            selector: row => {
                const PrecioProducto = row.PrecioProducto
                if (PrecioProducto === null || PrecioProducto === undefined) {
                return "No disponible";
                }
                if (typeof PrecioProducto === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return PrecioProducto;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'PRECIO BOMBEO',
            selector: row => {
                const precioB = row.PrecioBomba
                if (precioB === null || precioB === undefined) {
                return "No disponible";
                }
                if (typeof precioB === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return precioB;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'PRECIO EXTRA',
            selector: row => {
                const pExtra = row.PrecioExtra
                if (pExtra === null || pExtra === undefined) {
                return "No disponible";
                }
                if (typeof pExtra === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return pExtra;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'IMPORTE TOTAL A PAGAR',
            selector: row => {
                const itotal = row.Total
                if (itotal === null || itotal === undefined) {
                return "No disponible";
                }
                if (typeof itotal === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return itotal;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'SALDO ANTICIPO',
            selector: row => {
                const sAnticipo = row.SaldoAnticipo
                if (sAnticipo === null || sAnticipo === undefined) {
                return "No disponible";
                }
                if (typeof sAnticipo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return sAnticipo;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'MARGEN BRUTO REAL',
            selector: row => {
                const mBrutoReal = row.PrecioProducto
                if (mBrutoReal === null || mBrutoReal === undefined) {
                return "No disponible";
                }
                if (typeof mBrutoReal === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return mBrutoReal;
            },
            sortable:true,
            width:"160px",
        },
        {
            name: 'FORMA PAGO',
            selector: row => {
                const fPago = row.Pago
                if (fPago === null || fPago === undefined) {
                return "No disponible";
                }
                if (typeof fPago === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return fPago;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'CREO',
            selector: row => {
                const creo = row.UsuarioCreo
                if (creo === null || creo === undefined) {
                return "No disponible";
                }
                if (typeof creo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return creo;
            },
            sortable:true,
            width:"120px",
        },
        {
            name: 'ACTUALIZO',
            selector: row => {
                const autorizo = row.UsuarioActualizo
                if (autorizo === null || autorizo === undefined) {
                return "No disponible";
                }
                if (typeof autorizo === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return autorizo;
            },
            sortable:true,
            width:"150px",
        },
    ];
    const colPedidosAll = [
        {
            name: 'No. PEDIDO',
            selector: row =>{ 
                let Pedido = row.IdPedido;
                if(Pedido === null || Pedido === undefined)
                {
                    Pedido = "-";
                }
                if(typeof Pedido === 'object')
                {
                    Pedido = "-";
                }
                return <CBadge color="secondary">{Pedido}</CBadge>
            },
            width:"120px",
            sortable:true,
        },
        {
            name: 'PLANTA',
            selector: row => row.PlantaEnvio,
            sortable:true,
            width:"120px",
        },
        {
            name: 'ASESOR',
            selector: row => {
                var Asesor = row.Asesor
                if (Asesor === null || Asesor === undefined) {
                    Asesor = "-";
                }
                if (typeof Asesor === 'object') {
                    Asesor = "-"; // O cualquier mensaje que prefieras
                }
                return Asesor;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'CLIENTE',
            selector: row => {
                var ncliente = row.NoCliente
                if (ncliente === null || ncliente === undefined) {
                    ncliente =  "-";
                }
                if (typeof ncliente === 'object') {
                    ncliente = "-"; // O cualquier mensaje que prefieras
                }
                var cliente = row.Cliente
                if (cliente === null || cliente === undefined) {
                    cliente =  "-";
                }
                if (typeof cliente === 'object') {
                    cliente = "-"; // O cualquier mensaje que prefieras
                }
                return ncliente+"/"+cliente;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'OBRA',
            selector: row => {
                const NoObra = row.NoObra;
                if (NoObra === null || NoObra === undefined) {
                return "No disponible";
                }
                if (typeof NoObra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                const Obra = row.Obra;
                if (Obra === null || Obra === undefined) {
                return "No disponible";
                }
                if (typeof Obra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                return NoObra+"/"+Obra;
            },
            sortable:true,
            width:"350px",
        },    
        {
            name: 'DIRECCIÓN',
            selector: row => {
                const direccion = row.Direccion
                if (direccion === null || direccion === undefined) {
                    return "No disponible";
                }
                if (typeof direccion === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return direccion;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'PRODUCTO',
            selector: row => {
                const Producto = row.Producto
                if (Producto === null || Producto === undefined) {
                    return "No disponible";
                }
                if (typeof Producto === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return Producto;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'M3',
            selector: row => {
                const cantidad = row.M3
                if (cantidad === null || cantidad === undefined) {
                return "No disponible";
                }
                if (typeof cantidad === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return cantidad;
            },
            sortable:true,
            width:"80px",
        },
        {
            name: 'Bomba',
            selector: row => {
                const cantidad = row.CodBomba;
                if (cantidad === null || cantidad === undefined) {
                return "No disponible";
                }
                if (typeof cantidad === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return cantidad;
            },
            sortable:true,
            width:"80px",
        },
        {
            name: 'FECHA ENTREGA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'HRA LLEGADA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'HR SALIDA',
            selector: row => {
                const hrsSalida = row.hrSalida
                if (hrsSalida === null || hrsSalida === undefined) {
                return "No disponible";
                }
                if (typeof hrsSalida === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return hrsSalida;
            },
            sortable:true,
            width:"160px",
        },
        {
            name: 'T. RECORRIDO',
            selector: row => {
                const trecorrido = row.Recorrido
                if (trecorrido === null || trecorrido === undefined) {
                return "No disponible";
                }
                if (typeof trecorrido === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trecorrido;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'TIEMPO REAL',
            selector: row => {
                const trealAprox = row.TiempoReal
                if (trealAprox === null || trealAprox === undefined) {
                return "No disponible";
                }
                if (typeof trealAprox === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trealAprox;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'ESPACIADO',
            selector: row => {
                const espaciado = row.Espaciado
                if (espaciado === null || espaciado === undefined) {
                return "No disponible";
                }
                if (typeof espaciado === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return espaciado;
            },
            sortable:true,
            width:"150px",
        },
    ];
    const colPedidosCan = [
        {
            name: 'No. PEDIDO',
            selector: row =>{ 
                let Pedido = row.IdPedido;
                if(Pedido === null || Pedido === undefined)
                {
                    Pedido = "-";
                }
                if(typeof Pedido === 'object')
                {
                    Pedido = "-";
                }
                return <CBadge color="secondary">{Pedido}</CBadge>
            },
            width:"120px",
            sortable:true,
        },
        {
            name: 'PLANTA',
            selector: row => row.PlantaEnvio,
            sortable:true,
            width:"120px",
        },
        {
            name: 'ASESOR',
            selector: row => {
                var Asesor = row.Asesor
                if (Asesor === null || Asesor === undefined) {
                    Asesor = "-";
                }
                if (typeof Asesor === 'object') {
                    Asesor = "-"; // O cualquier mensaje que prefieras
                }
                return Asesor;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'CLIENTE',
            selector: row => {
                var ncliente = row.NoCliente
                if (ncliente === null || ncliente === undefined) {
                    ncliente =  "-";
                }
                if (typeof ncliente === 'object') {
                    ncliente = "-"; // O cualquier mensaje que prefieras
                }
                var cliente = row.Cliente
                if (cliente === null || cliente === undefined) {
                    cliente =  "-";
                }
                if (typeof cliente === 'object') {
                    cliente = "-"; // O cualquier mensaje que prefieras
                }
                return ncliente+"/"+cliente;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'OBRA',
            selector: row => {
                const NoObra = row.NoObra;
                if (NoObra === null || NoObra === undefined) {
                return "No disponible";
                }
                if (typeof NoObra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                const Obra = row.Obra;
                if (Obra === null || Obra === undefined) {
                return "No disponible";
                }
                if (typeof Obra === 'object') {
                return "Sin Estado"; // O cualquier mensaje que prefieras
                }
                return NoObra+"/"+Obra;
            },
            sortable:true,
            width:"350px",
        },    
        {
            name: 'DIRECCIÓN',
            selector: row => {
                const direccion = row.Direccion
                if (direccion === null || direccion === undefined) {
                    return "No disponible";
                }
                if (typeof direccion === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return direccion;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'PRODUCTO',
            selector: row => {
                const Producto = row.Producto
                if (Producto === null || Producto === undefined) {
                    return "No disponible";
                }
                if (typeof Producto === 'object') {
                    return "-"; // O cualquier mensaje que prefieras
                }
                return Producto;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'M3',
            selector: row => {
                const cantidad = row.M3
                if (cantidad === null || cantidad === undefined) {
                return "No disponible";
                }
                if (typeof cantidad === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return cantidad;
            },
            sortable:true,
            width:"80px",
        },
        {
            name: 'Bomba',
            selector: row => {
                const cantidad = row.CodBomba;
                if (cantidad === null || cantidad === undefined) {
                return "No disponible";
                }
                if (typeof cantidad === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return cantidad;
            },
            sortable:true,
            width:"80px",
        },
        {
            name: 'FECHA ENTREGA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'HRA LLEGADA',
            selector: row => {
                const fecha = row.FechaHoraPedido;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'HR SALIDA',
            selector: row => {
                const hrsSalida = row.hrSalida
                if (hrsSalida === null || hrsSalida === undefined) {
                return "No disponible";
                }
                if (typeof hrsSalida === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return hrsSalida;
            },
            sortable:true,
            width:"160px",
        },
        {
            name: 'T. RECORRIDO',
            selector: row => {
                const trecorrido = row.Recorrido
                if (trecorrido === null || trecorrido === undefined) {
                return "No disponible";
                }
                if (typeof trecorrido === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trecorrido;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'TIEMPO REAL',
            selector: row => {
                const trealAprox = row.TiempoReal
                if (trealAprox === null || trealAprox === undefined) {
                return "No disponible";
                }
                if (typeof trealAprox === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return trealAprox;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'ESPACIADO',
            selector: row => {
                const espaciado = row.Espaciado
                if (espaciado === null || espaciado === undefined) {
                return "No disponible";
                }
                if (typeof espaciado === 'object') {
                return "-"; // O cualquier mensaje que prefieras
                }
                return espaciado;
            },
            sortable:true,
            width:"150px",
        },
    ];
    const colIncidencia = [
        {
            name: ' ',
            selector: row =>{ 
                var idPedido = row.IdPedido;
                if(idPedido === null || idPedido === undefined)
                {
                    idPedido = "-";
                }
                if(typeof idPedido === 'object')
                {
                    idPedido = "-";
                }
                return <CBadge color="secondary">{idPedido}</CBadge>
            },
            width:"120px",
            sortable:true,
        },
        {
            name: 'Responsable',
            selector: row => {
                var Responsable = row.Responsable
                if (Responsable === null || Responsable === undefined) {
                    Responsable = "-";
                }
                if (typeof Responsable === 'object') {
                    Responsable = "-"; // O cualquier mensaje que prefieras
                }
                return Responsable;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'Descripción',
            selector: row => {
                var Incidencia = row.Incidencia
                if (Incidencia === null || Incidencia === undefined) {
                    Incidencia = "-";
                }
                if (typeof Incidencia === 'object') {
                    Incidencia = "-"; // O cualquier mensaje que prefieras
                }
                return Incidencia;
            },
            sortable:true,
            width:"350px",
        },
        {
            name: 'Usuario',
            selector: row => {
                var Usuario = row.Usuario
                if (Usuario === null || Usuario === undefined) {
                    Usuario =  "-";
                }
                if (typeof Usuario === 'object') {
                    Usuario = "-"; // O cualquier mensaje que prefieras
                }
                return Usuario;
            },
            sortable:true,
            width:"250px",
        },
        {
            name: 'Fecha Modificación',
            selector: row => {
                const fecha = row.FechaModifico;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"180px",
        },
    ];
    const colModificaciones = [
        {
            name: 'Planta',
            selector: row =>{ 
                let Planta = row.Planta;
                if(Planta === null || Planta === undefined)
                {
                    Planta = "-";
                }
                if(typeof Planta === 'object')
                {
                    Planta = "-";
                }
                return <CBadge color="secondary">{Planta}</CBadge>
            },
            width:"120px",
            sortable:true,
        },
        {
            name: 'Campo',
            selector: row =>{ 
                let kampo_ = row.Campo;
                if(kampo_ === null || kampo_ === undefined)
                {
                    kampo_ = "-";
                }
                if(typeof kampo_ === 'object')
                {
                    kampo_ = "-";
                }
                return kampo_;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'Valor Anterior',
            selector: row => {
                var ValorAnterior = row.ValorAnterior
                if (ValorAnterior === null || ValorAnterior === undefined) {
                    ValorAnterior = "-";
                }
                if (typeof ValorAnterior === 'object') {
                    ValorAnterior = "-"; // O cualquier mensaje que prefieras
                }
                return ValorAnterior;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'Valor Nuevo',
            selector: row => {
                var ValorNuevo = row.ValorNuevo
                if (ValorNuevo === null || ValorNuevo === undefined) {
                    ValorNuevo =  "-";
                }
                if (typeof ValorNuevo === 'object') {
                    ValorNuevo = "-"; // O cualquier mensaje que prefieras
                }
                return ValorNuevo;
            },
            sortable:true,
            width:"200px",
        },
        {
            name: 'Fecha',
            selector: row => {
                const fecha = row.Fecha;
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'Usuario',
            selector: row => {
                var Usuario = row.Usuario
                if (Usuario === null || Usuario === undefined) {
                    Usuario =  "-";
                }
                if (typeof Usuario === 'object') {
                    Usuario = "-"; // O cualquier mensaje que prefieras
                }
                return Usuario;
            },
            sortable:true,
            width:"180px",
        },
        {
            name: 'Comentario',
            selector: row => {
                var Comentario = row.Comentario
                if (Comentario === null || Comentario === undefined) {
                    Comentario =  "-";
                }
                if (typeof Comentario === 'object') {
                    Comentario = "-"; // O cualquier mensaje que prefieras
                }
                return Comentario;
            },
            sortable:true,
            width:"180px",
        },
    ];
    //--------------------------- FUNCTION ACCIONES -----------------------------------------------
    const mBorrarP = async(IdPedido) =>{
        console.log(IdPedido)
    }
    //--------------------------------------------------------------------------------
    // Buscador
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda SP
    const onFindBusquedaSP = (e) => {
        setBSP(e.target.value);
        setFTextSP(e.target.value);
    };
    const fBusquedaSP = () => {
        if(vBSP.length != 0){
            const valFiltrados = dtPedidosAll.filter(dtPedidosAll => 
            dtPedidosAll.IdPedido.includes(vBSP) // Filtra los clientes por el número de cliente
            );
            setDTPedidosAll(valFiltrados);
        }
    };
    const fPedidoSP = dtPedidosAll.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.IdPedido.toString().includes(fTextSP) || item.Asesor.toLowerCase().includes(fTextSP.toLowerCase()) || 
        item.Cliente.toLowerCase().includes(fTextSP.toLowerCase()) || item.Obra.includes(fTextSP.toLowerCase()) || item.NoObra.toString().includes(fTextSP) || 
        item.NoCliente.includes(fTextSP.toLowerCase());
    });
    //BUSCAR SA
    const onFindBusquedaSA = (e) => {
        setBSA(e.target.value);
        setFTextSA(e.target.value);
    };
    const fBusquedaSA = () => {
        if(vBSA.length != 0){
            const valFiltrados = dtPedidosSA.filter(dtPedidosSA => 
                dtPedidosSA.IdPedido.includes(vBSA) // Filtra los clientes por el número de cliente
            );
            setDTPedidosSA(valFiltrados);
        }else{
            btnBuscar()
        }
    };
    const fPedidoSA = dtPedidosSA.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.IdPedido.toString().includes(fTextSA) || item.Asesor.toLowerCase().includes(fTextSA.toLowerCase()) || item.Cliente.toLowerCase().includes(fTextSA.toLowerCase()) ||
        item.Obra.toLowerCase().includes(fTextSA.toLowerCase()) || item.NoObra.toString().includes(fTextSA) || item.NoCliente.toLowerCase().includes(fTextSA.toLowerCase());
    });
    //BUSCAR PEDIDOS
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtPedidos.filter(dtPedidos => 
            dtPedidos.IdPedido.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPedidos(valFiltrados);
        }else{
            btnBuscar()
        }
    };
    const fPedido = dtPedidos.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.IdPedido.toString().includes(fText) || item.Asesor.toLowerCase().includes(fText.toLowerCase()) || item.Cliente.toLowerCase().includes(fText.toLowerCase()) || 
        item.Obra.toLowerCase().includes(fText.toLowerCase()) || item.NoObra.toString().includes(fText) || item.NoCliente.toString().includes(fText);
    });
    //************************* HANDLE*************************************************************** */
    const hn_cli = (e) =>{
        setNClie(e.target.value)
    };
    const hn_obra = (e) =>{
        setNObra(e.target.value)
    };

    const handleObservacionesChange = async(idPedido, newValue) => {
        setDTPedidos(prevData =>
           prevData.map(row =>
            row.IdPedido === idPedido
            ? {...row, Observaciones: newValue }
            : row
           ) 
        );
        try{
            const pedidoObs = await setPedidoComentario(idPedido, newValue, plantasSel);

        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //******************************************************** */
    // Descargar CSV
    const downloadCSV = () => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(FileDT);
        if (csv == null) return;
        const filename = 'HistoricoCli_'+plantasSelF+'.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Pedidos</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={3} md={3}>
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol xs={2} md={2}>
            <FechaI 
                vFechaI={vFechaI} 
                cFechaI={cFechaI} 
                className='form-control'
            />
        </CCol>
        <CCol xs={2} md={2}>
            <FechaF 
                vFcaF={vFechaF} 
                mFcaF={mFcaF}
                className='form-control'
            />
        </CCol>
        <CCol xs={5} md={5} className='mt-4'>
            <CButton color='info' style={{color:"white",marginRight:"10px"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
            <CButton color='primary' onClick={() => navigate('/Operaciones/Pedidos/LevantarPedido')}> 
                <CIcon icon={cilPlus} />
                {' '}New
            </CButton>
        </CCol>        
      </CRow>
      {/* {shDiv && ( )} */}
        <>
        <CRow className='mt-4 mb-4' id="divTb">
            {shDiv && (
                <CTabs activeItemKey="lp" >
                    <CTabList variant="tabs">
                        <CTab itemKey="lp">Lista de Pedido</CTab>
                        {/* <CTab itemKey="programa">Programa</CTab> */}
                        <CTab itemKey="eliminados">Eliminados</CTab>
                        <CTab itemKey="SinAdjuntos">Sin Adjuntos</CTab>
                        <CTab itemKey="SoloPedidos">Solo Pedidos</CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel className="p-3" itemKey="lp">
                            <CRow>
                                <CCol xs={3} md={3}>
                                    <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                                </CCol>
                                <CCol xs={3} md={3} className='mt-4'>
                                    <CButton color='warning' style={{"color":"white"}} onClick={downloadCSV}>
                                        <CIcon icon={cilCloudDownload} className="me-2" />
                                        Exportar
                                    </CButton>
                                </CCol>
                            </CRow>
                            <CRow className='mt-2'>
                                <div style={{ overflowX: "auto" }}>
                                    <CTable responsive="lg" striped>
                                        <CTableHead>
                                            {/* Primera fila: encabezados generales */}
                                            <CTableRow>
                                            <CTableHeaderCell rowSpan={2}> </CTableHeaderCell>
                                            <CTableHeaderCell rowSpan={2}>m3</CTableHeaderCell>
                                            <CTableHeaderCell rowSpan={2}>Sin Bombeo</CTableHeaderCell>
                                            <CTableHeaderCell rowSpan={2}>Con Bombeo</CTableHeaderCell>
                                            
                                            {/* Agrupaciones con colSpan */}
                                            <CTableHeaderCell colSpan={2}>$ Programados</CTableHeaderCell>
                                            <CTableHeaderCell colSpan={2}>Camiones</CTableHeaderCell>
                                            <CTableHeaderCell colSpan={3}>Materiales programados</CTableHeaderCell>
                                            <CTableHeaderCell colSpan={4}>Total Metros</CTableHeaderCell>
                                            </CTableRow>

                                            {/* Segunda fila: subcolumnas */}
                                            <CTableRow>
                                            <CTableHeaderCell>Contado</CTableHeaderCell>
                                            <CTableHeaderCell>Crédito</CTableHeaderCell>

                                            <CTableHeaderCell>Requeridos</CTableHeaderCell>
                                            <CTableHeaderCell>Disponibles</CTableHeaderCell>

                                            <CTableHeaderCell>Cemento</CTableHeaderCell>
                                            <CTableHeaderCell>Arena</CTableHeaderCell>
                                            <CTableHeaderCell>Grava</CTableHeaderCell>

                                            <CTableHeaderCell>Programados</CTableHeaderCell>
                                            <CTableHeaderCell>Eliminados</CTableHeaderCell>
                                            <CTableHeaderCell>Sin Adjuntos</CTableHeaderCell>
                                            <CTableHeaderCell>Totales</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {/* Fila de totales */}
                                            <CTableRow>
                                            <CTableHeaderCell scope="row">TOTALES</CTableHeaderCell>
                                                <CTableDataCell>{TM3}</CTableDataCell>
                                                <CTableDataCell>{TSBomba}</CTableDataCell>
                                                <CTableDataCell>{TCBomba}</CTableDataCell>

                                                <CTableDataCell>{/* Contado */}</CTableDataCell>
                                                <CTableDataCell>{/* Crédito */}</CTableDataCell>

                                                <CTableDataCell>{/* Requeridos */}</CTableDataCell>
                                                <CTableDataCell>{/* Disponibles */}</CTableDataCell>

                                                <CTableDataCell>{/* Cemento */}</CTableDataCell>
                                                <CTableDataCell>{/* Arena */}</CTableDataCell>
                                                <CTableDataCell>{/* Grava */}</CTableDataCell>

                                                <CTableDataCell>{/* Programados */}</CTableDataCell>
                                                <CTableDataCell>{/* Eliminados */}</CTableDataCell>
                                                <CTableDataCell>{/* Sin Adjuntos */}</CTableDataCell>
                                                <CTableDataCell>{/* Totales */}</CTableDataCell>
                                            </CTableRow>

                                            {/* Fila de programados */}
                                            <CTableRow>
                                            <CTableHeaderCell scope="row">PROGRAMADOS</CTableHeaderCell>
                                                <CTableDataCell>{PM3}</CTableDataCell>
                                                <CTableDataCell>{PSBomba}</CTableDataCell>
                                                <CTableDataCell>{PCBomba}</CTableDataCell>

                                                <CTableDataCell>${fNumber(Contado)}</CTableDataCell>
                                                <CTableDataCell>${fNumber(Credito)}</CTableDataCell>

                                                <CTableDataCell>{Requerido}</CTableDataCell>
                                                <CTableDataCell>{Disponible}</CTableDataCell>

                                                <CTableDataCell>{fNumber(Cemento)}</CTableDataCell>
                                                <CTableDataCell>{fNumber(Arena)}</CTableDataCell>
                                                <CTableDataCell>{fNumber(Grava)}</CTableDataCell>

                                                <CTableDataCell>{fNumber(Programados)}</CTableDataCell>
                                                <CTableDataCell>{fNumber(Eliminados)}</CTableDataCell>
                                                <CTableDataCell>{fNumber(SinAdjuntos)}</CTableDataCell>
                                                <CTableDataCell>{fNumber(Totales)}</CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </CRow>
                            <DataTable
                                columns={colPedido}
                                data={fPedido}
                                pagination
                                persistTableHead
                                subHeader
                            />
                        </CTabPanel>
                        {/* <CTabPanel className="p-3" itemKey="programa"></CTabPanel> */}
                        <CTabPanel className="p-3" itemKey="eliminados">
                            <DataTable
                                columns={colPedidosCan}
                                data={dtPedidosCan}
                                pagination
                                persistTableHead
                                subHeader
                            />
                        </CTabPanel>
                        <CTabPanel className="p-3" itemKey="SinAdjuntos">
                             <CRow>
                                <CCol xs={3} md={3}>
                                    <BuscadorDT value={vBSA} onChange={onFindBusquedaSA} onSearch={fBusquedaSA} />
                                </CCol>
                                <CCol xs={3} md={3} className='mt-4'>
                                    <CButton color='warning' style={{"color":"white"}} onClick={downloadCSV}>
                                        <CIcon icon={cilCloudDownload} className="me-2" />
                                        Exportar
                                    </CButton>
                                </CCol>
                            </CRow>
                            <DataTable
                                columns={colPedidoSA}
                                data={fPedidoSA}
                                pagination
                                persistTableHead
                                subHeader
                            />
                        </CTabPanel>
                        <CTabPanel className="p-3" itemKey="SoloPedidos">
                             <CRow>
                                <CCol xs={3} md={3}>
                                    <BuscadorDT value={vBSP} onChange={onFindBusquedaSP} onSearch={fBusquedaSP} />
                                </CCol>
                                <CCol xs={3} md={3} className='mt-4'>
                                    <CButton color='warning' style={{"color":"white"}} onClick={downloadCSV}>
                                        <CIcon icon={cilCloudDownload} className="me-2" />
                                        Exportar
                                    </CButton>
                                </CCol>
                            </CRow>
                            <DataTable
                                columns={colPedidosAll}
                                data={fPedidoSP}
                                pagination
                                persistTableHead
                                subHeader
                            />
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            )}
        </CRow>       
        </>      
        {/* Modal Incidencia */}
        <CModal
            size='xl'
            backdrop="static"
            visible={mIncidencia}
            onClose={() => setMIncidencia(false)}
        >
            <CModalHeader>
                <CModalTitle>Registro de Incidencias</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className='mt-2 mb-2'>
                    <CCol xs={12}>
                        <DataTable
                            columns={colIncidencia}
                            data={dtIncidencia}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    </CCol>            
                </CRow>
                <CRow className='mt-4 mb-2'>
                    <CCol xs={6} md={6}>
                        <CFormTextarea
                            className="mb-3"
                            placeholder="Comentario Incidencias"
                            aria-label="Comentario Incidencias"
                            value={comentarioInci}
                            onChange={(e)=>setComentarioInci(e.target.value)}
                        ></CFormTextarea>
                    </CCol>  
                    <CCol xs={6} md={3}>
                        <CButton color='primary' onClick={saveComentario}> 
                        <CIcon icon={cilSave} />
                        {' '}Guardar
                        </CButton>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setMIncidencia(false)}>
                    Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
        {/* Modal Modificaciones */}
        <CModal
        size='xl'
        backdrop="static"
        visible={mModificaciones}
        onClose={() => setMModificaciones(false)}
        >
            <CModalHeader>
                <CModalTitle>Registro de Modificaciones</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className='mt-2 mb-2'>
                    <DataTable
                        columns={colModificaciones}
                        data={dtModificaciones}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setMModificaciones(false)}>
                Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
        {/* Modal Multimedia */}
        <CModal
        size='xl'
        backdrop="static"
        visible={mMultimedia}
        onClose={() => setMMulti(false)}
        >
            <CModalHeader>
                <CModalTitle>Documento Adjunto</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {tMultimedia == 0 ? (
                    <CRow className='mt-2 mb-2'>
                    
                    </CRow>
                ):(
                    <CRow className='mt-2 mb-2'>
                    
                    </CRow>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setMModificaciones(false)}>
                Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
    </CContainer>
    </>
  )
}

export default Pedidos
