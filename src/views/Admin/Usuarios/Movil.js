import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import '../../../estilos.css';
import { getUserMobil, delUsuarioMB } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilDelete, cilSearch, cilSend, cilTrash } from '@coreui/icons'
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
            const ocList = await getUserMobil();
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
    
    const sendMsj = (id, token) =>{
        Swal.fire({
        title: "Enviar Notificación",
        input: "text",
        inputLabel: "Mensaje a enviar",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Enviar",
        showLoaderOnConfirm: true,
        preConfirm: async (mensaje) => {
            try {
                const url = "http://apicatsa.catsaconcretos.mx:2543/api/Administracion/SendNotificacion";

                const body = {
                    DeviceId: token,  // <-- aquí pones tu token real
                    Title: "AVISO",
                    Body: mensaje
                };

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    const err = await response.json();
                    return Swal.showValidationMessage(`Error: ${JSON.stringify(err)}`);
                }

                return response.json();

            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error}`);
            }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Notificación enviada",
                    text: result.value.message
                });
            }
        });

    }
    
    const viewPC = (nc) =>{
        Swal.fire({
            title: "¿Deseas eliminar al usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
            denyButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Procesando Solicitud...',
                    didOpen: () => {
                        Swal.showLoading();
                        eliminarUsuario(nc);
                    }
                });
            }
        });
    }

    const eliminarUsuario = async(id) =>{
        try{
            const ocList = await delUsuarioMB(id);
            console.log(ocList)
            Swal.close();  
            Swal.fire("Correcto", "Usuario eliminado", "success");
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
            width:"150px",
            sortable:true,
            cell: (row) => (
                <div>
                    <CRow>
                        <CCol xs={6} md={6} lg={6}>
                            <CButton
                                style={{'color':'white'}}
                                color="primary"
                                onClick={() => sendMsj(row.id, row.token)}
                                size="sm"
                                className="me-2"
                                title="Notificar"
                            >
                            <CIcon icon={cilSend} />
                            </CButton>
                        </CCol>
                        <CCol xs={6} md={6} lg={6}>
                            <CButton
                                style={{'color':'white'}}
                                color="danger"
                                onClick={() => viewPC(row.id)}
                                size="sm"
                                className="me-2"
                                title="Eliminar"
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Usuario',
            selector: row => {
                const c = row.usuario;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable: true,
            width:"150px",
            grow:1,
        },
        {
            name: 'Ultima Modificación',
            width:"180px",
            selector: (row) => {
            var fecha = row.fecha_creacion
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_ +' '+hora_
            },
            sortable:true,
        },
        {
            name: 'Token',
            selector: row => {
                const c = row.token;
                if (typeof c === 'string') return c.trim() || '—';
                if (typeof c === 'object' && c !== null) return JSON.stringify(c);
                return '—';
            },
            sortable: true,
            width:"1100px",
            grow:1,
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
            item.usuario.includes(fText) 
        );
    },[dtUser]);
    //************************************************************************************************************************************************************************************* */
    return (
    <>
        <CContainer fluid>
            <h3>Usuarios Moviles </h3>
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
