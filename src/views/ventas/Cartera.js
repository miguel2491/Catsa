import React, { useState, useEffect } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import DataTable from 'react-data-table-component';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CInputGroup,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormInput,
    CModalFooter
} from '@coreui/react';
import '../../estilos.css';
import Asesores from '../base/parametros/Asesores'
import { CIcon } from '@coreui/icons-react';
import { cilSearch, cilCloudDownload } from '@coreui/icons';
import { getClientesAsesor } from '../../Utilidades/Funciones';
import Swal from 'sweetalert2';

const RCartera = () => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);// Modal Cargando
    const [data, setData] = useState([]); // Estado para almacenar los datos de la tabla
    const [selectedAsesor, setSelectedAsesor] = useState('');
    const [asesorSel , setAsesor] = useState('');
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    
    //Estilo
    const [isDetalle, setIsDetalle] = useState(false);    
    
    
    const mAsesor = (event) => {
        setAsesor(event.target.value);
    };
    // Lógica de filtro
    const onFilter = (e) => {
        setFText(e.target.value); // Actualiza el texto del filtro
    };
    // Filtrar datos en función del texto de búsqueda
    const filteredData = data.filter(item => {
        return item.NoCliente.toLowerCase().includes(fText.toLowerCase()) || item.Nombre.includes(fText) || item.RFC.includes(fText);
    });
    const getAsesores = async () => {
        setLoading(true);
        setVisible(true); // Muestra el modal de carga
        try {
            const clientes = await getClientesAsesor(asesorSel);
            if (clientes) {
                const objClientes = clientes;
                console.log(objClientes);
                setData(objClientes);
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
    // Definición de columnas de la tabla
    const columns = [
        {
            name: 'NoCliente',
            selector: row => row.NoCliente,
            width:"100px",
        },{
            name: 'RFC',
            selector: row => row.RFC,
            sortable: true,
            grow: 1,
            width:"150px",
        },
        ,{
            name: 'Nombre',
            selector: row => row.Nombre,
            sortable: true,
            grow: 1,
            width:"400px",
        },
        ,{
            name: 'Dirección',
            sortable: true,
            grow: 1,
            width:"400px",
            selector: row => {
                const direccion = `${row.Estado},${row.Municipio},${row.Colonia},${row.Calle},${row.Numero},CP.${row.CodigoPostal}`;
                return direccion
            },
        },
        ,{
            name: 'Teléfono',
            selector: row => {return `${row.Telefono && typeof row.Telefono === 'object' ? '-' : row.Telefono}`},
            sortable: true,
            grow: 1,
            width:"200px",
        },
        {
            name: 'Condición de Pago',
            selector: row => {return `${row.CondicionPago && typeof row.CondicionPago === 'object' ? '-' : row.CondicionPago}`},
            sortable: true,
            grow: 1,
            width:"200px",
        },
        {
            name: 'Email',
            selector: row => {return `${row.Email && typeof row.Email === 'object' ? '-' : row.Email}`},
            sortable: true,
            grow: 1,
            width:"200px",
        },
        {
            name: 'Fecha Alta',
            selector: row => {return `${row.FechaCreacion && typeof row.FechaCreacion === 'object' ? '-' : row.FechaCreacion}`},
            sortable: true,
            grow: 1,
            width:"200px",
        },
    ];
    const getDetalle = async(row) =>
        {
            setLoading(true);
            setVisible(true); // Muestra el modal de carga
            try {
                
            } catch (error) {
                Swal.fire("Error", "No se pudo obtener la información", "error");
            } finally {
                setLoading(false);
                setVisible(false); // Oculta el modal de carga
            }
    }
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
    
        const filename = 'D_CARTERA.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    return (
        <CContainer fluid>
            <h2 style={{ textAlign: 'left' }}>Cartera de Clientes</h2>
            <CRow className='mb-2'>
                <CCol xs={6} md={4}>
                    <Asesores  
                        mAsesor={mAsesor}
                        asesoresSel={asesorSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CButton color='primary' className='mt-3' onClick={getAsesores}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2}>
                    <CButton color='success' className='mt-2' onClick={downloadCSV}>
                        <CIcon icon={cilCloudDownload} className='me-2' />
                        Descargar
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
        </CContainer>
    );
};

export default RCartera;
