import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { downloadCV } from '../../../Utilidades/Funciones';
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
import { cilCloudDownload, cilSave, cilSearch } from '@coreui/icons'
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
    const [nOrden, setNorden] = useState("");
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
    const viewPC = (id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Reedirigiendo...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                navigate('/Operaciones/Pedidos/DCancelados');
            }
        });
    }
    
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colPC = [
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
                            color="warning"
                            onClick={() => viewPC(row.id)}
                            size="sm"
                            className="me-2"
                            title="Cancelar"
                        >
                            <CIcon icon={cilSave} />
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
            name: 'Fecha Cancelación',
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
            name: 'No. Remisión',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Pedido Programa',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'No CLiente',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Cliente',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'No Obra',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Obra',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Producto',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Costo',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Precio Concreto',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Cantidad',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Tiempo Carga',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Fecha Creación',
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
    ];
    const colRCH = [
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
                            color="warning"
                            onClick={() => addOC(row.id)}
                            size="sm"
                            className="me-2"
                            title="Cancelar"
                        >
                            <CIcon icon={cilSave} />
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
            name: 'Fecha Cancelación',
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
            name: 'Remisión',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Id Ticket',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Área',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Motivo',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Descripción',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Solicitante',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Estatus',
            selector: row => row.UserName,
            sortable:true,
            width:"150px",
        },
        {
            name: 'Fecha Creación',
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
        return item.UserName.toLowerCase().includes(fText.toLowerCase()) || item.ordenCompra.includes(fText) || item.planta.includes(fText) || item.tipoMant.includes(fText);
    });
    const fRch = dtRch.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.UserName.toLowerCase().includes(fText.toLowerCase()) || item.ordenCompra.includes(fText) || item.planta.includes(fText) || item.tipoMant.includes(fText);
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
                <CCol xs={6} md={2} lg={2} className='mt-3'>
                    <CButton color='primary' onClick={getOComprasBtn}> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} className='mt-3'>
                    <CButton color='danger' onClick={viewPC}>
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
            <br />
        </CContainer>
    </>
    )
}
export default Cancelados