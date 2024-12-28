import React, { useState } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
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
    CFormInput,
    CInputGroup 
} from '@coreui/react';
import '../../estilos.css';
import Mes from '../base/parametros/Mes'
import Periodo from '../base/parametros/Periodo'
import { CIcon } from '@coreui/icons-react';
import { cilXCircle, cilSearch, cilX, cilCloudDownload,cilCameraControl, cilCheckCircle } from '@coreui/icons';
import { getComisionesR, getDetalleComR } from '../../Utilidades/Funciones';
import Swal from 'sweetalert2';
import {FormatoFca, Fnum} from '../../Utilidades/Tools'

const RComision = () => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [periodoSel , setPeriodo] = useState('');
    const [mesSel , setMes] = useState('');
    const [visible, setVisible] = useState(false);// Modal Cargando
    const [visibleD, setVisibleD] = useState(false);// Modal Detalle
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [data, setData] = useState([]); // Estado para almacenar los datos de la tabla
    const [dDetalle, setDataD] = useState([]); // Estado para almacenar los datos de Detalle
    const mPeriodo = (event) => {
        setPeriodo(event.target.value);
    };
    const mMes = (event) => {
        setMes(event.target.value);
    };
    
    const getComisiones = async () => {
        setLoading(true);
        setVisible(true); // Muestra el modal de carga

        try {
            const comisiones = await getComisionesR(mesSel, periodoSel);
            if (comisiones) {
                setData(comisiones); 
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

    // Lógica de filtro
    const onFilter = (e) => {
        setFText(e.target.value); // Actualiza el texto del filtro
    };

    // Filtrar datos en función del texto de búsqueda
    const filteredData = data.filter(item => {
        return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.UsuarioCreo.includes(fText);
    });

    const getDetalle = async(row) =>
    {
        setLoading(true);
        setVisible(true); // Muestra el modal de carga
        try {
            const dcomisiones = await getDetalleComR(mesSel, periodoSel, row);
            if (dcomisiones) {
                setVisibleD(true)
                console.log(dcomisiones);
                setDataD(dcomisiones);
                 
            } else {
                Swal.fire("Error", "Ocurrió un error, vuelve a intentar", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            setLoading(false);
            setVisible(false); // Oculta el modal de carga
        }
    }

    // Definición de columnas de la tabla
    const columns = [
        {
            name: 'Acciones',
            selector: row => row.UsuarioCreo,
            width:"80px",
            cell: (row) => (
                <div>
                    <CButton
                        color="primary"
                        onClick={() => getDetalle(row.UsuarioCreo)}
                        size="sm"
                        className="me-2"
                        title="Detalle"
                    >
                        <CIcon icon={cilCameraControl} />
                    </CButton>
                </div>
            ),
        },{
            name: 'Planta',
            selector: row => row.Planta,
            width:"80px",
        },{
            name: 'Asesor',
            selector: row => row.UsuarioCreo,
            sortable: true,
            grow: 1,
            width:"150px",
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },
        },
        {
            name: 'Cantidad',
            width:"150px",
            selector: row => row.Cantidad,
        },
        {
            name: 'MBDIR',
            width:"150px",
            selector: row => row.MBDIR,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.MBDIR === 'Cumple' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
        {
            name: 'P1MIN',
            width:"150px",
            selector: row => row.P1MIN,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.P1MIN === 'CUMPLE' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
        {
            name: 'P1MAX',
            width:"150px",
            selector: row => row.P1MAX,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.P1MAX === 'CUMPLE' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
        {
            name: 'P2MIN',
            width:"150px",
            selector: row => row.P2MIN,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.P2MIN === 'CUMPLE' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
        {
            name: 'P2MAX',
            width:"150px",
            selector: row => row.P2MAX,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.P2MAX === 'CUMPLE' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
        {
            name: 'P3MIN',
            width:"150px",
            selector: row => row.P3MIN,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.P3MIN === 'CUMPLE' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
        {
            name: 'P3MAX',
            width:"150px",
            selector: row => row.P3MAX,
            cell: (row) => (
                // Si el valor de row.MBDIR es 'CUMPLE', mostramos un ícono de check
                row.P3MAX === 'CUMPLE' ? (
                    <div>
                        <CIcon icon={cilCheckCircle} style={{ color: 'green', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>Cumple</span>
                    </div>    
                ) : (
                    <div>
                        <CIcon icon={cilX} style={{ color: 'red', fontSize: '20px' }} />
                        <span style={{ marginLeft: '8px' }}>No Cumple</span>
                    </div>
                    
                )
            ),
        },
    ];
    const columnsD = [
        {
            name: 'Planta',
            selector: row => row.Planta,
            width:"80px",
        },{
            name: 'Fecha',
            selector: row => FormatoFca(row.Fecha),
            width:"200px",
        },{
            name: 'NoRemision',
            selector: row => row.NoRemision,
            sortable: true,
            grow: 1,
            width:"100px",
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },
        },
        {
            name: 'Producto',
            width:"180px",
            selector: row => row.Producto,
        },{
            name: 'Cantidad',
            selector: row => row.Cantidad,
            width:"80px",
        },{
            name: 'Precio Producto',
            selector: row => Fnum(row.PrecioProducto),
            width:"120px",
        },{
            name: 'No Obra',
            selector: row => row.NoObra,
            width:"120px",
        },{
            name: 'No Orden',
            selector: row => row.NoOrden,
            width:"120px",
        },{
            name: 'Cliente',
            selector: row => row.Cliente,
            width:"300px",
        }
    ];
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
    const downloadCSVModal = (e) => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(dDetalle);
        if (csv == null) return;
    
        const filename = 'ComisionAsesorDetalle.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };

    return (
        <CContainer fluid>
            <h2 style={{ textAlign: 'center' }}>Comisiones</h2>
            <CRow className='mb-2'>
                <CCol xs={6} md={2} lg={2}>
                    <Mes mMes={mMes} mesSel={mesSel} />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <Periodo mPeriodo={mPeriodo} periodoSel={periodoSel} />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CButton color='primary' className='mt-3' onClick={getComisiones}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CInputGroup className="mb-3 mt-3">
                        <CFormInput 
                            id='search'
                            type='text'
                            placeholder='Buscar'
                            aria-label='Buscar...'
                            value={fText}
                            onChange={onFilter}  
                        />
                        <CButton type="button" color="primary" id="button-addon1">Buscar</CButton>
                    </CInputGroup>
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CButton color='success' className='mt-2' onClick={downloadCSV}>
                        <CIcon icon={cilCloudDownload} className='me-2' />
                        Descargar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mb-1 mt-2'>
                <DataTable
                    columns={columns}
                    data={filteredData}  // Usamos los datos filtrados
                    pagination
                    persistTableHead
                    subHeader
                />
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
            <CModal
                backdrop="static"
                visible={visibleD}
                onClose={() => setVisibleD(false)}
                aria-labelledby="StaticBackdropExampleLabel"
                id='mComisiones'
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel">DETALLES</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CButton color='danger' onClick={downloadCSVModal}>
                        <CIcon icon={cilCloudDownload} className="me-2" />
                        Exportar
                    </CButton>
                    <DataTable
                        columns={columnsD}
                        data={dDetalle}  // Usamos los datos filtrados
                        pagination
                        persistTableHead
                        subHeader
                    />
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

export default RComision;
