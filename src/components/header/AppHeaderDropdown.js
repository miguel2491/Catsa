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
  cilFile,
  cilLockLocked,
  cilTask,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/logo.png'
import '../SideBar.css'
import Swal from 'sweetalert2'

const AppHeaderDropdown = () => {
  const cookies = new Cookies()
  const navigate = useNavigate()

  // Función para cerrar sesión
  function cerrarSesion() {
    cookies.remove('idUsuario')
    cookies.remove('menus')
    cookies.remove('roles')
    cookies.remove('SubMenus')
    cookies.remove('token')
    cookies.remove('Usuario')
    cookies.remove('plantas')
    navigate('/login')
  }

  // Función para resetear contraseña
  const ResetPass = () => {
    // 1) Obtenemos el UserId desde cookies (ajusta si lo guardas con otro nombre o en otro lugar)
    const userId = cookies.get('idUsuario') // Ajusta si la cookie se llama distinto

    Swal.fire({
      title: 'Cambiar contraseña',
      html: `
        <input
          type="password"
          id="newPassword"
          class="swal2-input"
          placeholder="Nueva contraseña"
        />
        <input
          type="password"
          id="confirmPassword"
          class="swal2-input"
          placeholder="Confirmar contraseña"
        />
      `,
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const newPassword = (document.getElementById('newPassword')).value
        const confirmPassword = (document.getElementById('confirmPassword')).value

        // Validaciones en el SweetAlert antes de enviar
        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Por favor, completa ambos campos')
          return false
        }
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden')
          return false
        }

        // Retorna la nueva contraseña para usarla luego en el .then
        return newPassword
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      // Si el usuario confirma la acción y se obtuvieron las contraseñas
      if (result.isConfirmed && result.value) {
        const newPassword = result.value

        // 2) Petición POST al endpoint para cambiar la contraseña
        return fetch('http://apicatsa.catsaconcretos.mx:2543/api/Login/ResetPass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserId: userId,
            Password: newPassword,
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              // Intentamos extraer texto del error para más detalles
              const errorText = await response.text()
              throw new Error(errorText || 'Error al cambiar la contraseña')
            }
            return response.json()
          })
          .then((data) => {
            // Aquí podrías usar "data" si tu API retorna algún valor adicional
            Swal.fire({
              title: '¡Éxito!',
              text: 'La contraseña se cambió correctamente. Por favor, inicia sesión de nuevo.',
              icon: 'success',
            }).then(() => {
              // 3) Forzamos al usuario a cerrar sesión
              cerrarSesion()
            })
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: `No se pudo cambiar la contraseña: ${error.message}`,
              icon: 'error',
            })
          })
      }
    })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" className="logo" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Configuraciones
        </CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Notificaciones
          <CBadge color="info" className="ms-2">
            2
          </CBadge>
        </CDropdownItem>
        <CDropdownItem onClick={ResetPass}>
          <CIcon icon={cilTask} className="me-2" />
          Cambiar contraseña
          <CBadge color="danger" className="ms-2">
            1
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
          Settings
        </CDropdownHeader>
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
