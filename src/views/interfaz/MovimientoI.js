import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import FechaI from '../base/parametros/FechaInicio';
import '../../estilos.css';
import BuscadorDT from '../base/parametros/BuscadorDT'
import { getMovimientos, getBitacoraI, getProductosI, getMaterialesI } from '../../Utilidades/Funciones';
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
import '../../estilos.css';
import {CIcon} from '@coreui/icons-react'
import { cilCameraControl, cilLoopCircular } from '@coreui/icons'

const MovmientoI = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [mMateriales, setmMateriales] = useState(false);
    const [vPlantaM, setVPlanta] = useState(false);
    //Arrays
    const [dtMovimiento, setDTMovimiento] = useState([]);
    const [dtBitacora, setDTBitacora] = useState([]);
    const [dtProducto, setDTProducto] = useState([]);
    const [dtMaterial, setDTMaterial] = useState([]);
    //Buscador
    const [vBPlanta, setBPlanta] = useState('');
    const [vBitacora, setBitacora] = useState('');
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [fTextB, setFTextB] = useState('');
    const [fTextP, setFTextP] = useState('');
    
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
        getBitacoraInt_(fecha.toLocaleDateString('en-US',opcionesFca))
        getMovimientosInt_(fecha.toLocaleDateString('en-US',opcionesFca))
        getProductosInt_(fecha.toLocaleDateString('en-US',opcionesFca))
    };
    //Movimientos
    const colMov = [
        {
            name: 'Modulo',
            selector: row => row.Modulo,
            sortable:true,
            width:"80px",
        },
        {
            name: 'Planta',
            selector: row => row.Planta,
            width:"180px",
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
            width:"600px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Observaciones',
            selector: row => row.Observaciones,
            width:"500px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Estatus Importación',
            selector: row => row.EstatusImportacion,
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Fecha Afectación',
            selector: row => row.FechaAfectacion,
            width:"180px",
            sortable:true,
            grow:1,
        },
    ];
    // Estilos condicionales para filas
    const rowStyles = [
        {
        when: row => !row.Activa, // Si Activa es false
        style: {
            backgroundColor: '#48CA84', // Color de fondo rojo claro
            color: '#721c24', // Color de texto rojo oscuro
        },
        },
        {
        when: row => row.Activa, // Si Activa es true
        style: {
            backgroundColor: '#FFFEF6', // Color de fondo verde claro
            color: '#155724', // Color de texto verde oscuro
        },
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
        getBitacoraInt_(null);
        getMovimientosInt_(null);
        getProductosInt_(null);
    }, []);

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
    const getBitacoraInt_ = async (fec) => {
        const fecha_ = fec == null ? vFechaI.toLocaleDateString('en-US',opcionesFca):fec;
        try {
            const bitacora = await getBitacoraI(fecha_);
            if (bitacora) {
                setDTBitacora(bitacora); 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
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
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        //setBPlanta(e.target.value);
        setFText(e.target.value);
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
    const fDPlanta = dtMovimiento.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Modulo.toLowerCase().includes(fText.toLowerCase()) || item.EstatusImportacion.includes(fText);
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

            <h3>Interfaz Movimientos Intelisis <CButton color='primary' onClick={refrescar}><CIcon icon={cilLoopCircular} className="me-2" /></CButton></h3>
            <CRow className='mt-2 mb-2'>
                <FechaI 
                    vFechaI={vFechaI} 
                    cFechaI={cFechaI} 
                    className='form-control'
                />
            </CRow>
            <CTabs activeItemKey="Bit">
                <CTabList variant='tabs' layout='justified'>
                    <CTab itemKey='Bit'>Bitacora</CTab>
                    <CTab itemKey='Mov'>Movimiento</CTab>
                    <CTab itemKey='Pro'>Productos</CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel itemKey="Mov">
                        <CRow className='mt-4 mb-4'>
                            <CCol xs={3} md={3}>
                                <br />
                                <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                            </CCol>
                            <DataTable
                                columns={colMov}
                                data={fDPlanta}
                                pagination
                                persistTableHead
                                subHeader
                                conditionalRowStyles={rowStyles}
                            />
                        </CRow>
                    </CTabPanel>
                    <CTabPanel itemKey="Bit">
                        <CCol xs={3} md={3}>
                            <BuscadorDT value={fTextB} onChange={onFindBusquedaBit} onSearch={fBusquedaBita} />
                        </CCol>
                        <DataTable
                            columns={colBita}
                            data={fDBitacora}
                            pagination
                            persistTableHead
                            subHeader
                        />
                    </CTabPanel>
                    <CTabPanel itemKey="Pro">
                        <CCol xs={3} md={3}>
                            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                        </CCol>
                        <DataTable
                            columns={colProductos}
                            data={fDProducto}
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
                    
                </CTabContent>
            </CTabs>
            <br />
        </CContainer>
    </>
    )
}
export default MovmientoI