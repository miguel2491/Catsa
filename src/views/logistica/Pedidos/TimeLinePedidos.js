import React,{useEffect,useRef} from 'react'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {CIcon} from '@coreui/icons-react'
import { cil3d, cilAccountLogout, cilSearch } from '@coreui/icons'
import '../../../estilos.css';
import Swal from "sweetalert2";

const TimeLinePedidos = ({value}) => {
    const hasRun = useRef(false);
//****************************************************************** */
useEffect(() => {
if (!hasRun.current && value) {  // Solo se ejecuta si no ha sido ejecutado antes
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
            // Llamamos la función
            getHistorial_(value);
        }
      });
    // Marcamos que el efecto ya se ejecutó
    hasRun.current = true;
  }
}, []);  // Solo se ejecuta si 'value' cambia

//****************************************************************** */
const getHistorial_ = (id) => {
    console.log("===>" + id);
    Swal.close();
};
//****************************************************************** */

//****************************************************************** */
return (
        <VerticalTimeline>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2011 - present"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<CIcon icon={cil3d} className="me-2" />}
                >
                <h3 className="vertical-timeline-element-title">Software Engineer</h3>
                <h4 className="vertical-timeline-element-subtitle">Company XYZ</h4>
                <p>
                    Responsible for developing and maintaining software solutions.
                </p>
            </VerticalTimelineElement>

            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2008 - 2011"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<CIcon icon={cilAccountLogout} className="me-2" />}
                >
                <h3 className="vertical-timeline-element-title">Bachelor's Degree in Computer Science</h3>
                <h4 className="vertical-timeline-element-subtitle">University ABC</h4>
                <p>
                    Graduated with honors in the field of Computer Science.
                </p>
            </VerticalTimelineElement>

            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2011 - present"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<CIcon icon={cil3d} className="me-2" />}
                >
                <h3 className="vertical-timeline-element-title">Software Engineer</h3>
                <h4 className="vertical-timeline-element-subtitle">Company XYZ</h4>
                <p>
                    Responsible for developing and maintaining software solutions.
                </p>
            </VerticalTimelineElement>

            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                date="2008 - 2011"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<CIcon icon={cilAccountLogout} className="me-2" />}
                >
                <h3 className="vertical-timeline-element-title">Bachelor's Degree in Computer Science</h3>
                <h4 className="vertical-timeline-element-subtitle">University ABC</h4>
                <p>
                    Graduated with honors in the field of Computer Science.
                </p>
            </VerticalTimelineElement>
            {/* Puedes añadir más elementos según sea necesario */}
        </VerticalTimeline>
    );
};
//-------------------------------------------------------------------------------------------------------------------------------------
export default TimeLinePedidos