import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import '../../../estilos.css';
import { getLiberarUsers, convertArrayOfObjectsToCSV } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilDelete, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import DatePicker,{registerLocale, setDefaultLocale} from 'react-datepicker';
import {es} from 'date-fns/locale/es';
registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css"
const currentDate = new Date();
const LibUser = () => {
    //************************************************************************************************************************************************************************** */
    const [plantasSelF , setPlantasF] = useState('');
    const [vOC, setVOC] = useState(false);
    // ROLES
    //Arrays
    const [dtUser, setDTUser] = useState([]);
    //Buscador
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        getUser();
    }, []);
    //************************************************************************************************************************************************************************************** */
    const getUser = () =>{
        setDTUser([]);
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gUs();
            }
        });
    }
    const gUs = async () => {
        try{
            const ocList = await getLiberarUsers('-','0');
            if(ocList)
            {
                console.log(ocList)
                setDTUser(ocList);
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
      
    const viewPC = (nc) =>{
        Swal.fire({
            title: "¿Deseas Liberar al usuario "+nc+" ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Liberar",
            denyButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Procesando Solicitud...',
                    didOpen: () => {
                        Swal.showLoading();
                        liberarUser(nc);
                    }
                });
            }
        });
    }

    const liberarUser = async(id) =>{
        try{
            const ocList = await getLiberarUsers(id,'1');
            console.log(ocList)
            Swal.close();  
            Swal.fire("Correcto", "Usuario Liberado", "success");
            getUser();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    
    // Columnas
    const colUser = [
        {
            name: 'Acciones',
            width:"100px",
            sortable:true,
            cell: (row) => (
                <div>
                    <CRow>
                        <CCol xs={6} md={2} lg={2}>
                        <CButton
                            style={{'color':'white'}}
                            color="danger"
                            onClick={() => viewPC(row.UsuarioPC)}
                            size="sm"
                            className="me-2"
                            title="Liberar"
                        >
                            <CIcon icon={cilTrash} />
                        </CButton>
                        </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Usuario Intelisis',
            selector: row => {
                const c = row.Usuario;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable: true,
            width:"200px",
            grow:1,
        },
        {
            name: 'Usuario ProCatsa',
            selector: row => {
                const c = row.UsuarioPC;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable: true,
            width:"200px",
            grow:1,
        },
        {
            name: 'Estación',
            width:"100px",
            selector: row => row.Estacion,
            sortable:true,
        },
        {
            name: 'ID',
            width:"300px",
            selector: row => row.EstacionFirma,
            sortable:true,
        },
        {
            name: 'Última Actualización',
            width:"180px",
            selector: row => row.UltimaActualizacion,
            sortable:true,
        },
        {
            name: 'Empresa',
            width:"100px",
            selector: row => row.Empresa,
            sortable:true,
        },
        {
            name: 'Sucursal',
            width:"150px",
            selector: row => row.Sucursal,
            sortable:true,
        },
    ];
    //************************************************************************************************************************************************************************** */
    // Búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {

    };
    
    const fDUser = dtUser.filter(item => {
        return (
            item.Usuario.includes(fText) 
        );
    },[dtUser]);
    //************************************************************************************************************************************************************************************* */
    return (
    <>
        <CContainer fluid>
            <h3>Liberar Usuario </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={2} md={2}>
                    <CButton color='primary' className='mt-4' onClick={getUser}> 
                        <CIcon icon={cilSearch} />
                        {' '}Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={6}>
                    <CCol xs={8} md={8}>
                        <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                    </CCol>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                    <DataTable
                        columns={colUser}
                        data={fDUser}
                        pagination
                        persistTableHead
                        subHeader
                    />
                </CCol>
            </CRow>
        </CContainer>
    </>
    )
}
export default LibUser