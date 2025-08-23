import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom';
import { getNotificaciones } from '../Utilidades/Funciones';
import {
  CBadge,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilHeadphones,
  cilHome,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown, AppBell } from './header/index'
import App from '../views/permisos/Permisos';

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const cookies = new Cookies();
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false)
  const [notifications, setNotificaciones] = useState([])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  useEffect(() => {
    const getNotif = async()=>{
      const res = await getNotificaciones();
      if(res)
      {
       setNotificaciones(res) 
      }
    }
    getNotif()
  },[])

  const navDash = () => {
    navigate('/dashboard');
  }
  const navHelp = () => {
    navigate('/help');
  }

  const toggleList = () => setShowList(!showList)

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <div className="h-300 text-opacity-75">Bienvenido: <b>{cookies.get('Usuario')}</b></div>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink title='Ayuda'>
              <CIcon icon={cilHeadphones} onClick={navHelp} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
        <CDropdown className="position-relative">
        <CDropdownToggle color="link" className="position-relative p-0 border-0">
          <CIcon icon={cilBell} size="lg" />
          {notifications.length > 0 && (
            <CBadge
              color="info"
              shape="rounded-pill"
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                fontSize: '0.6rem',
              }}
            >
              {notifications.length}
            </CBadge>
          )}
        </CDropdownToggle>

        <CDropdownMenu
          className="pt-0"
          placement="bottom-end"
          style={{
            minWidth: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
            fontSize: '0.9rem',
          }}
        >
          <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
            {notifications.length > 0 ? (
              notifications.map((noti, index) => (
                <li
                  key={index}
                  style={{
                    padding: '5px 0',
                    borderBottom:
                      index < notifications.length - 1 ? '1px solid #eee' : 'none',
                  }}
                >
                  {noti.accion}
                </li>
              ))
            ) : (
              <li style={{ padding: '5px 0' }}>No hay notificaciones</li>
            )}
          </ul>
        </CDropdownMenu>
      </CDropdown>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
