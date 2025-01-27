import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Cookies from 'universal-cookie';
import { Navigate, useNavigate } from "react-router-dom";
import avatar8 from './../../assets/images/avatars/logo.png'
import '../SideBar.css'
import Swal from "sweetalert2";

const AppHeaderDropdown = () => {
  const cookies = new Cookies();
const navigate = useNavigate();

function cerrarSesion(){
  cookies.remove('idUsuario');
  cookies.remove('menus');
  cookies.remove('roles');
  cookies.remove('SubMenus');
  cookies.remove('token');
  cookies.remove('Usuario');
  cookies.remove('plantas');
  navigate('/login');
}
    const ResetPass = () =>{
        Swal.fire({
            title: "Cambio de contraseña",
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Ingresar",
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
              try {
                const response = await addNFac(id, login);
          
                // Comprobamos si la respuesta es true o false
                if (response) { 
                  // Si la respuesta es true, mostramos un mensaje de éxito
                  Swal.fire({
                    title: "Factura Ingresada",
                    text: "La factura fue ingresada correctamente.",
                    icon: 'success'
                  });
                  gOC();
                } else {
                  // Si la respuesta es false, mostramos un mensaje de error
                  Swal.fire({
                    title: "Error",
                    text: "No se pudo ingresar la factura.",
                    icon: 'error'
                  });
                }
                
                return response;  // Devolvemos la respuesta para continuar con el flujo de la promesa
          
              } catch (error) {
                // En caso de error, mostramos un mensaje de fallo
                Swal.fire({
                  title: "Error",
                  text: `Request failed: ${error}`,
                  icon: 'error'
                });
                throw error;  // Rechazamos la promesa si hay error
              }
            },
            allowOutsideClick: () => !Swal.isLoading(),  // Impide hacer clic fuera si está cargando
          }).then((result) => {
            if (result.isConfirmed) {
              // Acción cuando el usuario confirma
              Swal.fire({
                title: "Factura Ingresada",
                text: "La factura fue procesada correctamente.",
                icon: 'success'
              });
            }
          });             
    };


    
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" className='logo' />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Configuraciones</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Notificaciones
          <CBadge color="info" className="ms-2">
            2
          </CBadge>
        </CDropdownItem>
        <CDropdownItem onClick={ResetPass}>
          <CIcon icon={cilTask} className="me-2" />
          Cambiar Pass
          <CBadge color="danger" className="ms-2">
            1
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={cerrarSesion}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
