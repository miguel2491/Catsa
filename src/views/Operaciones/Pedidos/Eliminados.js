import React,{useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2'
import 'leaflet/dist/leaflet.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import DataTable from 'react-data-table-component'

import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CBadge
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilEnvelopeLetter, cilLoopCircular, cilPen, cilPlus, cilSearch, cilSync, cilTrash, cilX } from '@coreui/icons';
import {getPedidoEl, setRecuperarPE, sAvisoPC} from '../../../Utilidades/Funciones'
import FechaI from '../../base/parametros/FechaInicio'
import FechaF from '../../base/parametros/FechaFinal'
import { format } from 'date-fns';
import BuscadorDT from '../../base/parametros/BuscadorDT'

const PEliminados = () => {
    //-----------------------------------------------------------------------------------
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    //-----------------------------------------------------------------------------------
    const [vFechaI, setFechaIni] = useState(null);
    const [vFcaF, setFechaFin] = useState(null);
    const [dtPE, setDTPE] = useState([]);
    const [dtEL, setDTEL] = useState([]);
    //******************************************************************************* */
    const handleInputChange = (e) => {
        setCotVenc(e.target.value); // Actualiza el estado con el nuevo valor del input
    };
    //******************************************************************************* */
    //Constantes Formulario
    const [nCoti, setCotVenc] = useState('');
    const [shDiv, setShDiv] = useState(false);
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    //******************************************************************************* */
    const Recuperar = async(idP) =>{
        Swal.fire({
            title: "¿Deseas Recuperar pedido "+idP+" ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Recuperar",
            denyButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Procesando Solicitud...',
                    didOpen: () => {
                        Swal.showLoading();
                        recuperarPed(idP);
                    }
                });
            }
        });
    }

    const recuperarPed = async (id) => {
        try {
            const result = await setRecuperarPE(id);

            if (result) {
                Swal.fire("Correcto", "Fecha actualizada correctamente", "success");
                getEliminado()
                nCoti('');
            } else {
                Swal.fire("Error", "No se pudo actualizar la fecha", "error");
            }

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo obtener la información", "error");
        } finally {
            Swal.close();
        }
    };

    const getEliminado = async () =>{
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFcaF, 'yyyy/MM/dd');
        try {
            const data = await getPedidoEl(auxFcaI, auxFcaF);
            const valFiltrados = data.filter(data => 
                data.Planta !== 'BMD1' 
            );
            const valDeleted = data.filter(data => 
                data.Planta !== 'BMD1' && data.statusEliminado == 'DEMO' // Filtra los clientes por el número de cliente
            );
            //setFText('DEMO')
            if (data) {
                setShDiv(true)
                setDTPE(valFiltrados);
                setDTEL(valDeleted);
            } else {
                Swal.fire("No se encontraron datos", "El número de cotización no es válido", "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
        } 
    }
    //******************************************************************************* */
    const colPE = [
        {
            name: 'ACCION',
            width:"100px",
            sortable:true,
            cell: (row) => {
                
                return (
                <div>
                    <CRow>
                        <CCol xs={2} md={2} lg={2}>
                        <CButton
                            style={{ color: 'white' }}
                            color="warning"
                            onClick={() => Recuperar(row.IdPedido)}
                            size="sm"
                            className="me-2"
                            title="Recuperar"
                        >
                            <CIcon icon={cilSync} />
                        </CButton>
                        </CCol>
                    </CRow>
                </div>
                );
            },
        },
        {
            name: 'ELIMINADO',
            sortable: true,
            width: '120px',
            selector: row => {
                const aux = row.statusEliminado
                if (aux === null || aux === undefined) {
                    return 'No disponible'
                }
                if (typeof aux === 'object') {
                    return <CBadge color='warning' textBgColor='warning'>---</CBadge>;
                }
                return <CBadge color='primary' textBgColor='primary'>{aux}</CBadge>;
            },
        },
        {
            name: 'ID',
            sortable: true,
            width: '100px',
            selector: row => {
                const aux = row.IdPedido;
                    return <CBadge color='primary' textBgColor='primary'>{aux}</CBadge>;
            },
        },
        {
            name: 'PROGRAMADO',
            sortable: true,
            width: '100px',
            selector: row => {
                const aux = row.activo;
                if (aux) {
                    return <CBadge color='primary' textBgColor='primary'><CIcon icon={cilCheck}></CIcon></CBadge>;
                }else {
                    return <CBadge color='danger' shape='rounded-pill'><CIcon icon={cilX}></CIcon></CBadge>;
                }
            },
        },
        {
            name: 'VB',
            sortable: true,
            width: '100px',
            selector: row => {
                const aux = row.VistoBueno;
                if (aux) {
                    return <CBadge color='primary' textBgColor='primary'><CIcon icon={cilCheck}></CIcon></CBadge>;
                }else {
                    return <CBadge color='danger' shape='rounded-pill'><CIcon icon={cilX}></CIcon></CBadge>;
                }
                return aux;
            },
        },
        {
            name: 'PLANTA',
            selector: (row) => row.Planta,
            sortable: true,
            width: '120px',
        },
        {
            name: 'CLIENTE',
            sortable: true,
            selector: (row) => {
                const vendedor = row.Cliente
                if (vendedor === null || vendedor === undefined) {
                    return 'No disponible'
                }
                if (typeof vendedor === 'object') {
                    return '-' // O cualquier mensaje que prefieras
                }
                return vendedor
            },
            width: '200px',
        },
        {
            name: 'OBRA',
            selector: (row) => {
                const obra_ = row.NoObra
                if (obra_ === null || obra_ === undefined) {
                return 'No disponible'
                }
                if (typeof obra_ === 'object') {
                return '-' // O cualquier mensaje que prefieras
                }
                return obra_
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'ASESOR',
            selector: (row) => {
                const obra_ = row.UsuarioCreo
                if (obra_ === null || obra_ === undefined) {
                return 'No disponible'
                }
                if (typeof obra_ === 'object') {
                return '-' // O cualquier mensaje que prefieras
                }
                return obra_
            },
            sortable: true,
            width: '150px',
        },
        {
            name: 'PRODUCTO',
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
            sortable: true,
            width: '200px',
        },
        {
            name: 'M3',
            selector: (row) => {
               var aux = row.M3Viaje
                if (aux === null || aux === undefined) {
                return "----";
                }
                if (typeof aux === 'object') {
                return "--"; // O cualquier mensaje que prefieras
                }
                return aux
            },
            
            sortable: true,
            width: '150px',
        },
        {
            name: 'FECHA HORA PEDIDO',
            selector: (row) => {
            var fecha = row.FechaHoraPedido
                if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha"; // O cualquier mensaje que prefieras
                }
                const [fecha_, hora_] = fecha.split("T");
                return fecha_ +' '+hora_
            },
            sortable: true,
            width: '200px',
        },
    ];
    //******************************************************************************* */
    useEffect(() => {
        
    },);
    //******************************************************************************* */
    const sendAviso = async () =>{
        Swal.fire({
            title: 'Enviando...',
            text: '...Enviando Avisos...',
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const result = await sAvisoPC(dtEL);
            Swal.fire("Correcto", "Avisos Enviados", "success");
        } catch (error) {
            Swal.close()
            Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
        } 
    }
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    // Función de búsqueda
    const onFindBusqueda = (e) => {
      setBPlanta(e.target.value)
      setFText(e.target.value)
    }
    const fBusqueda = () => {
      if (vBPlanta.length != 0) {
        const valFiltrados = dtPE.filter(
          (dtPE) => dtPE.Planta.includes(vBPlanta) || dtPE.IdPedido.includes(vBPlanta) || dtPE.Cliente.includes(vBPlanta) || dtPE.NoObra.includes(vBPlanta) || dtPE.UsuarioCreo.includes(vBPlanta),
        )
        //setDTVolClieAux(valFiltrados)
      } else {
        getEliminado()
      }
    }
    const fPE = dtPE.filter((item) => {
      return item.Planta.toString().includes(fText.toUpperCase()) || String(item.IdPedido).includes(fText) || String(item.Cliente).includes(fText) || String(item.NoObra).includes(fText) 
      || item.UsuarioCreo.toString().includes(fText)
    })
    //==============================================================================================================
  return (
    <>
      <CContainer fluid>
        <h1>Pedidos Eliminados</h1>
        <CRow>
            <CCol xs={12} md={2}>
                <FechaI 
                    vFechaI={vFechaI} 
                    cFechaI={cFechaI} 
                />
            </CCol>
            <CCol xs={12} md={2}>
                <FechaF 
                    vFcaF={vFcaF} 
                    mFcaF={mFcaF}
                />
            </CCol>
            <CCol xs={12} md={2} style={{'margin-top':'30px'}}>
                <CButton color='primary' onClick={getEliminado}>
                    <CIcon icon={cilSearch} className="me-2" />
                    Realizar
                </CButton>
            </CCol>
            <CCol xs={12} md={3} className='mt-2'>
                <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
            </CCol>
            <CCol xs={12} md={2} style={{'margin-top':'30px'}}>
                <CButton color='warning' onClick={sendAviso} style={{'color':'white'}}>
                    <CIcon icon={cilEnvelopeLetter} className="me-2" />
                    Avisar
                </CButton>
            </CCol>
        </CRow>
        {shDiv && (
        <CRow className='mt-4'>
            <DataTable
                columns={colPE}
                data={fPE}
                pagination
                persistTableHead
                subHeader
              />
        </CRow>
        )}
      </CContainer>
    </>
  )
}

export default PEliminados
