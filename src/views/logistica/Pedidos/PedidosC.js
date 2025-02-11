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
  const [plantasSel, setPlantas] = useState('');
  const [data, setData] = useState([]);
  const [visibleRange, setVisibleRange] = useState(null);

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
        title: pedido.NoCliente + "-" + pedido.Cliente+" ("+pedido.M3Viaje+"m3)",
        date: pedido.FechaHoraPedido,
        color: pedido.activo === true ? 'blue' : pedido.Archivos === true ? 'grey' : 'red',
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
