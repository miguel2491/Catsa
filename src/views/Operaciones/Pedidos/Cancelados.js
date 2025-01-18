import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { downloadCV, getPCancelados } from '../../../Utilidades/Funciones';
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
import { useNavigate } from "react-router-dom";
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSave, cilSearch, cilColorBorder, cilXCircle } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import DatePicker,{registerLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"
import "react-datepicker/dist/react-datepicker.css"
const Cancelados = () => {
    const navigate = useNavigate();
    //************************************************************************************************************************************************************************** */
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const [tipoGn, setTipoGn] = useState('-');
    const [tipoSt, setTipoSt] = useState('-');
    const [shTR, setshTR] = useState(false);
    const [shTG, setshTG] = useState(true);
    const [shCmbStatus, setshCmbStatus] = useState(false);
    const [shDTPC, setshDTPC] = useState(false);
    const [shBtnBuscar, setshBtnBuscar] = useState(false);
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtPCan, setDTCan] = useState([]);
    const [dtRch, setDTRch] = useState([]);
    // FROMS
    const [idOC, setIdOC] = useState("0");
    //************************************************************************************************************************************************************************** */    
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
    //************************************************************************************************************************************************************************** */
    //************************************************************************************************************************************************************************** */
    const getPCanBtn = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gPC();
            }
        });
    }
    const gPC = async () => {
        var planta = plantasSel;
        if(plantasSel == undefined || plantasSel.length == 0 || plantasSel === ""){
            if(userIsJP && !userIsOperacion)
            {
                Swal.close();
                Swal.fire("Error", "Debes seleccionar alguna planta", "error");
                return false;
            }else {
                setPlantas('-')
                planta = '-'
            }
        }
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        try{
            if(tipoGn == "G"){
                const ocList = await getPCancelados(planta, auxFcaI, auxFcaF, tipoGn, tipoSt);
                if(ocList){
                    setDTCan(ocList);
                }
            }else{
                const ocList = await getPCancelados(planta, auxFcaI, auxFcaF, tipoGn, tipoSt);
                console.log(ocList)
                if(ocList){
                    setDTRch(ocList)
                }
            }
            setshDTPC(true)
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            setshDTPC(false)
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const viewPC = (id,tipo) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Reedirigiendo...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                navigate('/Operaciones/Pedidos/DCancelados/'+id+'/'+tipo);
            }
        });
    }
    
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colPC = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"100px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsOperacion || userIsJP) && (
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            style={{'color':'white'}}
                            color="warning"
                            onClick={() => viewPC(row.IdTicket, 'PC')}
                            size="sm"
                            className="me-2"
                            title="Cancelar"
                        >
                            <CIcon icon={cilXCircle} />
                        </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
            ),
        },
        {
            name: 'No. Orden',
            selector: row => {
                const aux = row.NoOrden;
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
            name: 'Planta',
            selector: row => {
                const aux = row.Planta;
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
            name: 'Fecha Cancelación',
            selector: row => {
                const fecha = row.FechaCreacion;
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
            name: 'No. Remisión',
            selector: row => row.NoRemision,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Pedido Programa',
            selector: row => row.PedidoPrograma,
            sortable:true,
            width:"150px",
        },
        {
            name: 'No CLiente',
            selector: row => row.NoCliente,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Cliente',
            selector: row => row.Cliente,
            sortable:true,
            width:"150px",
        },
        {
            name: 'No Obra',
            selector: row => row.NoObra,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Obra',
            selector: row => row.Obra,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Producto',
            selector: row => row.Producto,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Costo',
            selector: row => row.CostoMP,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Precio Concreto',
            selector: row => row.PrecioConcreto,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Cantidad',
            selector: row => row.Cantidad,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Tiempo Carga',
            selector: row => row.TiempoCarga,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Fecha Creación',
            selector: row => row.FechaCreacion,
            width:"100px",
            sortable:true,
            grow:1,
        },
    ];
    const colRCH = [
        {
            name: 'Acción',
            selector: row => row.id_cancelados,
            width:"80px",
            cell: (row) => (
                <div>
                    <CRow>
                    {(userIsOperacion || userIsJP) && row.estatus === '1' && (
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            style={{'color':'white'}}
                            color="warning"
                            onClick={() => viewPC(row.id_cancelados,'RH')}
                            size="sm"
                            className="me-2"
                            title="Editar"
                        >
                            <CIcon icon={cilColorBorder} />
                        </CButton>
                        </CCol>
                    )}
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Planta',
            selector: row => {
                const aux = row.clave_planta;
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
            name: 'Fecha Cancelación',
            selector: row => {
                const fecha = row.created_at;
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
            width:"120px",
        },
        {
            name: 'Remisión',
            selector: row => row.r_origen+'-->'+row.r_destino,
            sortable:true,
            width:"200px",
        },
        {
            name: 'Id Ticket',
            selector: row => row.id_ticket,
            sortable:true,
            width:"300px",
        },
        {
            name: 'Área',
            selector: row => row.area,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Motivo',
            selector: row => {
                const aux = row.motivo;
                switch(aux){
                    case "1":
                        return "RECHAZADO/ARREGLADO";
                    case "2":
                        return "RECHAZADO/RE DIRECCIONADO";
                    case "3":
                        return "RECHAZADO/TIRADO";
                    default:
                        return "RECHAZADO/RETORNADA";
                }
            },
            sortable:true,
            width:"300px",
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            sortable:true,
            width:"500px",
        },
        {
            name: 'Solicitante',
            selector: row => {
                const aux = row.usuarioCreo;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            sortable:true,
            width:"150px",
        },
        {
            name: 'Estatus',
            selector: row => {
                const aux = row.estatus;
                switch(aux){
                    case "1":
                        return <CBadge textBgColor='primary'>En Proceso</CBadge>;
                    case "2":
                        return <CBadge textBgColor='warning'>Finalizada</CBadge>;
                    default:
                        return false;
                }
            },
            sortable:true,
            width:"150px",
        },
    ];
    //------------
    useEffect(() => {
        //getProductosInt_(null);
    }, []);

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
    const fPCan = dtPCan.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Cliente.toLowerCase().includes(fText.toLowerCase()) || String(item.NoOrden).includes(fText) || item.Planta.includes(fText) || item.Producto.includes(fText) || 
        item.NoObra.includes(fText) || item.PedidoPrograma.includes(fText) || item.NoCliente.includes(fText);
    });
    const fRch = dtRch.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.clave_planta.includes(fText) || item.id_ticket.includes(fText) || item.area.includes(fText);
    });
    //************************************************************************************************************************************************************************** */
    const nOrdenCh = (e) =>{
        setNorden(e.target.value);
    }
    const newOC = () =>{
        setVOC(true)
    }
    // Maneja el cambio en el select de tipo de mantenimiento
    const handleTipoGn = (e) => {
        setTipoGn(e.target.value);
        setshBtnBuscar(true);
        if(e.target.value == "-")
        {
            setshBtnBuscar(false)
        }
        if(e.target.value == "G" || e.target.value == "-"){
            setshTR(false);
            setshTG(true);
            setshCmbStatus(false);
        }else{
            setshTR(true);
            setshTG(false);
            setshCmbStatus(true);
        }
    };
    const handleTipoSt = (e) => {
        setTipoSt(e.target.value);
    };
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
    //************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Pedidos Cancelados </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2}>
                    <label>Tipo</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={tipoGn}
                        onChange={handleTipoGn}
                    >
                        <option value="-">-</option>
                        <option value="G">General</option>
                        <option value="R">Rechazadas</option>
                    </CFormSelect>
                </CCol>
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
                {shCmbStatus && (
                <CCol xs={6} md={2}>
                    <label>Estatus</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={tipoSt}
                        onChange={handleTipoSt}
                    >
                        <option value="-">- Todos -</option>
                        <option value="A">Activo</option>
                        <option value="E">En Espera</option>
                        <option value="R">Rechazados</option>
                    </CFormSelect>
                </CCol>
                )}
                {shBtnBuscar && (
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='primary' onClick={getPCanBtn}> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                )}
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='danger' onClick={viewPC}>
                        <CIcon icon={cilCloudDownload} className="me-2" />
                        Exportar
                    </CButton>
                </CCol>
            </CRow>
            { shDTPC && (
                <CRow className='mt-2 mb-2'>
                    <CCol xs={12} md={12}>
                        <CCol xs={3} md={3}>
                            <br />
                            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                        </CCol>
                    </CCol>
                    {shTG && (
                    <CCol xs={12} md={12}>
                        <DataTable
                            columns={colPC}
                            data={fPCan}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    </CCol>
                    )}
                    {shTR && (
                    <CCol xs={12} md={12}>
                        <DataTable
                            columns={colRCH}
                            data={fRch}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    </CCol>
                    )}
                </CRow>
            )}
            <br />
        </CContainer>
    </>
    )
}
export default Cancelados