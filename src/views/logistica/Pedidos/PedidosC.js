import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { CFormInput, CContainer, CRow, CCol } from '@coreui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Si quieres vista en agenda
import interactionPlugin from '@fullcalendar/interaction'; // Para eventos interactivos
import esLocale from '@fullcalendar/core/locales/es';
import { getPedidos } from '../../../Utilidades/Funciones';
import Plantas from '../../base/parametros/Plantas';
import '../../../estilos.css';
const PedidosC = () => {
  //----------- CONSTANTES --------------------------------
  const [plantasSel, setPlantas] = useState('');
  const [data, setData] = useState([]);
  const [visibleRange, setVisibleRange] = useState(null);
  //----------- PRINCIPALES --------------------------------
  const mCambio = async (event) => {
    const selectedPlanta = event.target.value;
    setPlantas(selectedPlanta);
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
        Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try {
      Swal.close();
      const pedidos = await getPedidos(selectedPlanta);
      console.log(pedidos)
      const transformedEvents = pedidos.map((pedido) => ({
        title: pedido.Cliente+" ("+pedido.CantidadM3+"m3)"+" "+pedido.Asesor,
        date: pedido.FechaHoraPedido,
        color: pedido.activo === true ? 'blue' : pedido.Archivos === true ? 'grey' : 'red',
        idPedido:pedido.IdPedido,
        archivo:pedido.Archivos,
        asesor:pedido.Asesor,
        cliente:pedido.Cliente,
        cantidadM3:pedido.CantidadM3,
        fecha:pedido.FechaHoraPedido,
        m3viaje:pedido.M3Viaje,
        noCliente:pedido.NoCliente,
        activo:pedido.activo
      }));
      setData(transformedEvents);
    } catch (error) {
      Swal.close();
      console.error('Error al Obtener Pedidos');
      setData([]);
    }
  };
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Lunes de la semana actual
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Sábado de la semana actual

    setVisibleRange({
      start: startOfWeek.toISOString().split('T')[0], // Formato YYYY-MM-DD
      end: endOfWeek.toISOString().split('T')[0],
    });
  }, [data]);
  //----------- FUNCIONES --------------------------------100501143
  const infoC = (c)=>{
    const event = c.event;
    const { idPedido, asesor, cliente, noCliente, cantidadM3, m3viaje, fecha, archivo, activo } = event._def.extendedProps;
    let arch = archivo == true ? 'Aprobado y Con Pago':' ';
    let fca = fecha.split("T");
    let status = activo == true ? 'Programado':'Sin Programar'; 
    let estatus = arch + " "+status;
    console.log(event._def.extendedProps)
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
  //----------- ---------- --------------------------------
  return (
    <>
      <CContainer>
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
      </CContainer>
    </>
  );
};

export default PedidosC;
