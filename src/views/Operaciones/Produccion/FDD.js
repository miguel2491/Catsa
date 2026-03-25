import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { getProdFDD, setRemisiones, fNumber } from '../../../Utilidades/Funciones';
import {
    CTab,
    CTabContent,
    CTabList,
    CTabPanel,
    CTabs,
    CFormSwitch,
    CFormInput,
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
import { cilCameraControl, cilLoopCircular, cilSend } from '@coreui/icons'
import Plantas from '../../base/parametros/Plantas'

const FDD = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [mMateriales, setmMateriales] = useState(false);
    const [shDv, setShDv] = useState(false);
    //Arrays
    const [dtProduccion, setDTPro] = useState([]);
    const [dtRem, setDTRem] = useState([]);
    const [dtEnt, setDTEnt] = useState([]);
    const [dtBitacora, setDTBitacora] = useState([]);
    const [dtProducto, setDTProducto] = useState([]);
    const [dtMaterial, setDTMaterial] = useState([]);
    //Buscador
    const [vBPlanta, setBPlanta] = useState('');
    const [vBRem, setBRem] = useState('');
    const [vBEnt, setBEnt] = useState('');
    const [vBitacora, setBitacora] = useState('');
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [fTextE, setFTextE] = useState('');
    const [fTextR, setFTextR] = useState('');
    const [fTextB, setFTextB] = useState('');
    const [fTextP, setFTextP] = useState('');
    
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };

    const cFechaI = (fecha) => {
        setShDv(false)
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
        //getBitacoraInt_(fecha.toLocaleDateString('en-US',opcionesFca))
        //getMovimientosInt_(fecha.toLocaleDateString('en-US',opcionesFca))
        //getProductosInt_(fecha.toLocaleDateString('en-US',opcionesFca))
        getProd_(plantasSel,fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        const pla = event.target.value; 
        setPlantas(pla);
        getProd_(pla,null);
    };
    const refresh = () =>{
        getProd_(plantasSel, vFechaI);
    }
    //Movimientos
    const colPro = [
        {
            name: 'Acción',
            width:"100px",
            sortable:true,
            cell: (row) => { 
                var fecha = row.Fecha
                if (fecha === null || fecha === undefined) {
                    fecha = "T";
                }
                else if (typeof fecha === 'object') {
                    fecha = "T";
                }
                const [fecha_, hora_] = fecha.split("T");   
                return(
                <div>
                <CRow>
                    { typeof row.KmFinal !== 'object' && typeof row.NoRemision !== 'object' && typeof row.HrsLlegada !== 'object' && 
                    typeof row.KmInicial !== 'object' && typeof row.OdoInicial !== 'object' && typeof row.OdoFinal !== 'object' && (
                        <CCol xs={6} md={6} lg={6}>
                        <CButton
                            color="primary"
                            onClick={() => sendRem(row.Planta, row.NoRemision, fecha_)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilSend} />
                        </CButton>
                        </CCol>
                    )}
                </CRow>
                </div>
                )
            },
        },
        {
            name: 'Fecha',
            selector: (row) => {
                var fecha = row.Fecha
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_
            },
            sortable:true,
            width:"120px",
        },
        {
            name: 'Remisión',
            selector: (row) => {
               var aux = row.NoRemision
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Producto',
            selector: (row) => {
               var aux = row.Producto
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"160px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad',
            selector: (row) => {
                var aux = row.Cantidad
                if (aux === null || aux === undefined) {
                return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux)
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'No. Obra',
            selector: (row) => {
                var aux = row.NoObra
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Camión',
            selector: (row) => {
                var aux = row.TR
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        // {
        //     name: 'Cod. Bomba',
        //     selector: row => row.FechaAfectacion,
        //     width:"180px",
        //     sortable:true,
        //     grow:1,
        // },
        {
            name: 'No. Cancel',
            selector: (row) => {
               var aux = row.NoCancel
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Retrabajo',
            selector: (row) => {
               var aux = row.Retrabajo
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Hr. Salida',
            selector: (row) => {
                var fecha = row.HrsSalida
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                }
                if (typeof fecha === 'object') {
                    return "Sin Fecha";
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_
            },
            width:"140px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Hr. Llegada',
            selector: (row) => {
                var fecha = row.HrsSalida
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                }
                if (typeof fecha === 'object') {
                    return "Sin Fecha";
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_
            },
            width:"140px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Km Inicial',
            selector: (row) => {
               var aux = row.KmInicial
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return fNumber(aux)
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Km. Final',
            selector: (row) => {
               var aux = row.KmFinal
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return fNumber(aux)
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Odo. Inicial',
            selector: (row) => {
               var aux = row.OdoInicial
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return fNumber(aux)
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Odo. Final',
            selector: (row) => {
               var aux = row.OdoFinal
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return fNumber(aux)
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Llegada Obra',
            selector: (row) => {
                var fecha = row.HrsLlegada
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                }
                if (typeof fecha === 'object') {
                    return "Sin Fecha";
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Salida Obra',
             selector: (row) => {
                var fecha = row.HrsSalida
                if (fecha === null || fecha === undefined) {
                    return "No disponible";
                }
                if (typeof fecha === 'object') {
                    return "Sin Fecha";
                }
                const [fecha_, hora_] = fecha.split("T");
                return hora_
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Motivo Retardo',
            selector: (row) => {
               var aux = row.MotivoRetardo
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'No. Pedido',
            selector: (row) => {
               var aux = row.Col8
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
    ];
    // Estilos condicionales para filas
    const rowStyles = [
        {
            // Aplica color verde si hay un valor numérico válido
            when: row => row.KmFinal !== null && row.KmFinal !== undefined && row.KmFinal !== '' && typeof row.KmFinal !== 'object',
            style: {
            backgroundColor: '#4EF092',
            color: '#000000',
            },
        },
        {
            // Aplica color rojo si está vacío, nulo o no válido
            when: row => row.KmFinal === null || row.KmFinal === undefined || row.KmFinal === '' || typeof row.KmFinal === 'object',
            style: {
            backgroundColor: '#CC392E',
            color: '#FFFFFF',
            },
        },
    ];
    // Entradas
    const colEntradas = [
        {
            name: 'Material',
            selector: (row) => {
               var aux = row.Material
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad',
            selector: (row) => {
                var aux = row.CantCarga
                if (aux === null || aux === undefined) {
                return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux)
            },
            sortable:true,
            width:"100px",
        },
        {
            name: 'Unidad',
            selector: (row) => {
               var aux = row.Unidad
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Proveedor',
            selector: (row) => {
               var aux = row.Proveedor
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return "-"
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Remisión',
            selector: (row) => {
               var aux = row.Remision
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Orden Compra',
            selector: (row) => {
               var aux = row.OrdenCompra
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Transportista',
            selector: (row) => {
               var aux = row.Transportista
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
    ];
    // Remision
    const colRem = [
        {
            name: 'No. Remisión',
            selector: row => row.FechaImportacion,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Producto',
            selector: row => row.Catalogo,
            sortable:true,
            width:"100px",
        },
        {
            name: 'Cantidad',
            selector: row => row.Cuenta,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Camión',
            selector: row => {
                const estatus = row.ListaMaterial;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Conductor',
            selector: row => {
                const estatus = row.Tipo;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Hra. Salida',
            selector: row => row.EstatusImportacion,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Hrs. Llegada',
            selector: row => {
                const estatus = row.EstatusDescripcion;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Llegada Obra',
            selector: row => row.FechaCambio,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Salida Obra',
            selector: row => row.Sucursal,
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Km. Inicial',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Km. Final',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Odo. Inicial',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Odo. Final',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Bomba',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'No. Trans',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Retrabajo',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'No. Cancel',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
    ];

    // Bitacora
    const colBita = [
        {
            name: 'Fecha Importación',
            selector: row => row.FechaImportacion,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Catalogo',
            selector: row => row.Catalogo,
            sortable:true,
            width:"100px",
        },
        {
            name: 'Cuenta',
            selector: row => row.Cuenta,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Lista Material',
            selector: row => {
                const estatus = row.ListaMaterial;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Tipo',
            selector: row => {
                const estatus = row.Tipo;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Estatus Importación',
            selector: row => row.EstatusImportacion,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Estatus Descripción',
            selector: row => {
                const estatus = row.EstatusDescripcion;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Fecha Cambio',
            selector: row => row.FechaCambio,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Sucursal',
            selector: row => row.Sucursal,
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cuenta Intelisis',
            selector: row => {
                const estatus = row.CuentaIntelisis;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Estatus inválido"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
    ];
    // Productos
    const colProductos = [
        {
            name: 'Acciones',
            width:"100px",
            cell: (row) => (
                <div>
                    <CButton
                        color="primary"
                        onClick={() => getMaterialesInt_(row.Articulo)}
                        size="sm"
                        className="me-2"
                        title="Detalle"
                    >
                        <CIcon icon={cilCameraControl} />
                    </CButton>
                </div>
            ),
        },
        {
            name: 'Articulo',
            selector: row => row.Articulo,
            sortable:true,
            width:"200px",
        },{
            name: 'Descripción',
            selector: row => row.Descripcion1,
            width:"500px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Grupo',
            selector: row => row.Grupo,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Categoria',
            selector: row => row.Categoria,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Estatus',
            selector: row => row.Estatus,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Usuario',
            selector: row => row.Usuario,
            width:"250px",
            sortable:true,
            grow:1,
        },
    ];
    //Materiales
    const colMateriales = [
        {
            name: 'Articulo',
            selector: row => row.Articulo,
            sortable:true,
            width:"200px",
        },{
            name: 'OrdenID',
            selector: row => row.OrdenID,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Material',
            selector: row => row.Material,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad',
            selector: row => row.Cantidad,
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Unidad',
            selector: row => row.Unidad,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Almacén',
            selector: row => row.Almacen,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Usuario',
            width:"180px",
            selector: row => {
                const estatus = row.Usuario;
                // Verifica si estatus es null, undefined o un objeto
                if (estatus === null || estatus === undefined) {
                  return "No disponible";
                }
                if (typeof estatus === 'object') {
                  return "Sin Usuario"; // O cualquier mensaje que prefieras
                }
                return estatus;
            },
        },
        {
            name: 'Sucursal',
            selector: row => row.Sucursal,
            width:"180px",
            sortable:true,
            grow:1,
        },
    ];
    //------------
    useEffect(() => {
        //getProd_(null);
        //getMovimientosInt_(null);
        //getProductosInt_(null);
    }, []);

    const getProd_ = async (planta,fec) => {
        setDTPro([])
        const fecha_ = fec == null ? vFechaI.toLocaleDateString('en-US',opcionesFca):fec;
        try {
            const res = await getProdFDD(planta, fecha_);
            const remisiones = Array.isArray(res.Remisiones) ? res.Remisiones : [];
            const Entradas = res.Inventario;
            const Remi = Entradas.filter(u =>
                u.Operacion.includes('R')
            );

            if (res) {
                setShDv(true)
                setDTPro(remisiones); 
                setDTEnt(Remi);
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }

    const refrescar = ()=>{
        setVisible(true);
        setLoading(true);
        setPercentage(0);
        const interval = setInterval(() => {
            setPercentage(prev => {
            if (prev < 90) return prev + 10;
            return prev;
            });
        }, 200);
        getBitacoraInt_(null);
        getMovimientosInt_(null);
        getProductosInt_(null);
        setTimeout(() => { 
            setLoading(false);
            setVisible(false); // Oculta el modal de carga
            setPercentage(100);
         },2000)
    }

    const getMovimientosInt_ = async (fec) => {
        const fecha_ = fec == null ? vFechaI.toLocaleDateString('en-US',opcionesFca):fec;
        try {
            const movs = await getMovimientos(fecha_);
            if (movs) {
                setDTMovimiento(movs); 
                
            } else {
                if(movs.length > 0){
                    Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
                }
                
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    
    const getProductosInt_ = async (fec) => {
        const fecha_ = fec == null ? vFechaI.toLocaleDateString('en-US',opcionesFca):fec;
        try {
            const producto = await getProductosI(fecha_);
            if (producto) {
                setDTProducto(producto); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const getMaterialesInt_ = async (Pro) => {
        try {
            const materiales = await getMaterialesI(Pro);
            if (materiales) {
                setmMateriales(true);
                setDTMaterial(materiales); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const sendRem = async (planta, remi, fca)=>{
        Swal.fire({
            title: "¿Deseas finalizar remisión ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Finalizar",
            denyButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Procesando Solicitud...',
                    didOpen: () => {
                        Swal.showLoading();
                        sendRemisiones(planta, remi, fca);
                    }
                });
            }
        });
    }

    const sendRemisiones = async(planta, remi, fca) =>{
        try {
            const result = await setRemisiones(planta, remi, fca);

            if (result) {
                Swal.fire("Correcto", "Remisiones Actualizadas correctamente", "success");
                getProd_(plantasSel, vFechaI)
            } else {
                Swal.fire("Error", "No se pudo actualizar la fecha", "error");
            }

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            Swal.close();
        }
    }
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        //setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const onFindBusquedaE = (e) => {
        setFText(e.target.value);
    };
    const onFindBusquedaRem = (e) => {
        setFTextR(e.target.value);
    };

    const onFindBusquedaBit = (e) => {
        setFTextB(e.target.value);
    };  
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtPlanta.filter(dtPlanta => 
            dtPlanta.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlanta(valFiltrados);
        }else{
            getPlantas_()
        }
    };
    const fBusquedaE = () => {
        if(vBRem.length != 0){
            const valFiltrados = dtPlanta.filter(dtPlanta => 
            dtPlanta.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlanta(valFiltrados);
        }else{
            getPlantas_()
        }
    };
    const fBusquedaRem = () => {
        if(vBEnt.length != 0){
            const valFiltrados = dtPlanta.filter(dtPlanta => 
            dtPlanta.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlanta(valFiltrados);
        }else{
            getPlantas_()
        }
    };

    const fBusquedaBita = () => {
        if(vBitacora.length != 0){
            const valFiltrados = dtBitacora.filter(dtBitacora => 
            dtBitacora.Sucursal.includes(vBitacora) // Filtra los clientes por el número de cliente
            );
            setDTBitacora(valFiltrados);
        }else{
            getBitacoraInt_()
        }
    };
    const fDPro = dtProduccion.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.Obra.includes(fText);
    });
    const fDRem = dtRem.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Planta.toLowerCase().includes(fText.toLowerCase());
    });
    const fDEnt = dtEnt.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Material.toLowerCase().includes(fText.toLowerCase());
    });

    const fDBitacora = dtBitacora.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Sucursal.toLowerCase().includes(fTextB.toLocaleLowerCase()) || item.Catalogo.includes(fTextB) || item.Cuenta.includes(fTextB) || item.ListaMaterial.includes(fTextB);
    });
    const fDProducto = dtProducto.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Articulo.includes(fTextP) || item.Catalogo.includes(fTextP);
    });
    const fDMaterial = dtMaterial.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Sucursal.toLowerCase().includes(fTextB.toLocaleLowerCase()) || item.Catalogo.includes(fTextB) || item.Cuenta.includes(fTextB) || item.ListaMaterial.includes(fTextB);
    });
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
        <h3>Fin de Día <CButton color='primary' onClick={refresh}><CIcon icon={cilLoopCircular} className="me-2" /></CButton></h3>
        <CRow className='mt-2 mb-2'>
            <CCol xs={12} md={2}>
                <Plantas  
                    mCambio={mCambio}
                    plantasSel={plantasSel}
                />
            </CCol>
            <CCol xs={12} md={2}>
                <FechaI 
                    vFechaI={vFechaI} 
                    cFechaI={cFechaI} 
                    className='form-control'
                />
            </CCol>
        </CRow>
        {shDv && (
            <CTabs activeItemKey="Pro">
                <CTabList variant='tabs' layout='justified'>
                    <CTab itemKey='Pro'>Producción</CTab>
                    <CTab itemKey='Ent'>Entradas</CTab>
                    <CTab itemKey='Rem'>Remisiones</CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel itemKey="Pro">
                        <CRow className='mt-4 mb-4'>
                            <CCol xs={12} md={3}>
                                <br />
                                <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                            </CCol>
                            <DataTable
                                columns={colPro}
                                data={fDPro}
                                pagination
                                persistTableHead
                                subHeader
                                conditionalRowStyles={rowStyles}
                            />
                        </CRow>
                    </CTabPanel>
                    <CTabPanel itemKey="Rem">
                        <CCol xs={3} md={3}>
                            <BuscadorDT value={vBPlanta} onChange={onFindBusquedaRem} onSearch={fBusquedaRem} />
                        </CCol>
                        <DataTable
                            columns={colRem}
                            data={fDRem}
                            pagination
                            persistTableHead
                            subHeader
                        />
                        <CModal
                            backdrop="static"
                            visible={mMateriales}
                            onClose={() => setmMateriales(false)}
                            className='c-modal'
                        >
                            <CModalHeader>
                            <CModalTitle id="StaticBackdropExampleLabel">Materiales por Producto</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <DataTable
                                    columns={colMateriales}
                                    data={fDMaterial}
                                    pagination
                                    persistTableHead
                                    subHeader
                                />
                            </CModalBody>
                            <CModalFooter>
                            </CModalFooter>
                        </CModal>
                    </CTabPanel>
                    <CTabPanel itemKey="Ent">
                        <CCol xs={3} md={3}>
                            <BuscadorDT value={fTextB} onChange={onFindBusquedaBit} onSearch={fBusquedaBita} />
                        </CCol>
                        <DataTable
                            columns={colEntradas}
                            data={fDEnt}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        )}
            <br />
        </CContainer>
    </>
    )
}
export default FDD
