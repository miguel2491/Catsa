import React, { useState, useEffect } from 'react';
import { CFormInput, CContainer, CRow, CCol } from '@coreui/react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'; // Si quieres vista en agenda
import interactionPlugin from '@fullcalendar/interaction'; // Para eventos interactivos
import esLocale from '@fullcalendar/core/locales/es';
import {getPedidos} from '../../../Utilidades/Funciones'
import Plantas from '../../base/parametros/Plantas'
const PedidosC = () => {
    const [plantasSel , setPlantas] = useState('');
    const [data, setData] = useState([]);
    const [events, setEvents] = useState([
        { title: 'Evento 1', date: '2024-12-02 13:00:00' },
        { title: 'Evento 2', date: '2024-12-05' }
    ]);

    const mCambio = async (event) => {
        const selectedPlanta = event.target.value;
        setPlantas(selectedPlanta)
        try{
            const pedidos = await getPedidos(selectedPlanta);
            const transformedEvents = pedidos.map(pedido => ({
                title: pedido.NoCliente+"-"+pedido.Cliente,
                date: pedido.FechaHoraPedido,
                color: pedido.activo === true ? 'blue' : pedido.Archivos === true ? 'grey':'red'
            }));
            setData(transformedEvents)
        }catch(error){
            console.error('Error al Obtener Pedidos')
            setData([])
        }
    };

    useEffect(() => {
        console.log(data);
    }, [data]);
    
    return (
        <>
        <CContainer>
            <CRow>
            <CCol xs={6} md={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
            </CRow>
            <CRow className='mt-4'>
                <div style={{background:'#FFF'}}>
                <h1>Pedidos</h1>
                    <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView='timeGridWeek'
                            locale={esLocale}
                            weekends={false}
                            events={data}
                            eventMinHeight={80}
                            eventOverlap={true}
                            headerToolbar={{
                                left: 'prev,next today', // Botones para navegar entre las fechas
                                center: 'title', // El título en el centro
                                right: 'dayGridMonth,timeGridWeek,timeGridDay', // Los botones para cambiar entre las vistas
                            }}
                        />
                </div>
            </CRow>
        </CContainer>
        </>
    );
};

export default PedidosC;
