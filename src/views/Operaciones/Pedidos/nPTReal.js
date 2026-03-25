import {useState, useEffect} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import Swal from "sweetalert2";
import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Si quieres vista en agenda
import interactionPlugin from '@fullcalendar/interaction'; // Para eventos interactivos
import esLocale from '@fullcalendar/core/locales/es';
import { useNavigate } from "react-router-dom";
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
} from '@coreui/icons'
import { findLogin, getPedidosD, getPedidosS, getPedidosPS, getPedidosM } from '../../../Utilidades/Funciones';
import { Rol } from '../../../Utilidades/Roles'
import Calendario from '../../logistica/Pedidos/PedidosC'
import Plantas from '../../base/parametros/Plantas';

const currentDate = new Date();

const nPTReal = () => {
    const navigate = useNavigate();
    const userIsA = true;
    const userIsAdminTI = Rol('AdminTI')
    const userIsAdmin = Rol('Admin')
    const userIsCVentas = Rol('CoordinadorVentas')
    const userIsOperacion = Rol('Operaciones')
    const userIsMantenimiento = Rol('Mantenimiento')
    const userIsFinanzas = Rol('Finanzas')
    const userIsDirector = Rol('Direccion')
    //*************************************************************************************************************************** */
    const [data, setData] = useState([]);
    const [visibleRange, setVisibleRange] = useState(null);
    //*************************************************************************************************************************** */
    useEffect(() => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Lunes de la semana actual
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Sábado de la semana actual

        setVisibleRange({
        start: startOfWeek.toISOString().split('T')[0], // Formato YYYY-MM-DD
        end: endOfWeek.toISOString().split('T')[0],
        });
    }, [data]);
    //*************************************************************************************************************************** */
    const infoC = (c)=>{
        const event = c.event;
        const { idPedido, asesor, cliente, noCliente, cantidadM3, m3viaje, fecha, archivo, activo } = event._def.extendedProps;
        let arch = archivo == true ? 'Aprobado y Con Pago':' ';
        let fca = fecha.split("T");
        let status = activo == true ? 'Programado':'Sin Programar'; 
        let estatus = arch + " "+status;
        Swal.fire({
          title: "<strong>Información</strong>",
          icon: "info",
          html: `
            <p>Pedido <b>`+idPedido+`</b></p>`+
            `<p>Cliente <b>`+noCliente+` `+cliente+`</b></p>`+
            `<p>Asesor <b>`+asesor+`</b></p>`+
            `<p>Cantidad <b>`+cantidadM3+`</b></p>`+
            `<p>Fecha <b>`+fca[0]+`</b></p>`+
            `<p>Estatus <b>`+estatus+`</b></p>`
            ,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Ok
          `,
          confirmButtonAriaLabel: "Thumbs up, great!",
        });
    };
    //*************************************************************************************************************************** */
  return (
    <>
    <CRow>
        <CCol xs={6} md={2}>
        <Plantas mCambio={mCambio} plantasSel={plantasSel} />
        </CCol>
    </CRow>
    <CRow className="mt-4">
        <div style={{ background: '#FFF' }}>
        <h1>Pedidos</h1>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            weekends={true}
            events={data}
            eventMinHeight={120}
            eventOverlap={true}
            eventClick={infoC}
            headerToolbar={{
            left: 'prev,next today', // Botones para navegar entre las fechas
            center: 'title', // El título en el centro
            right: 'dayGridMonth,timeGridWeek,timeGridDay', // Los botones para cambiar entre las vistas
            }}
            visibleRange={visibleRange}
            weekStartsOn={1}
            dayHeaders={true}
        />
        </div>
    </CRow>
    </>
  )
}

export default nPTReal


