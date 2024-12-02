import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Rol } from '../Utilidades/Roles'; // Asegúrate de tener este archivo
import {
    cilCursor,
    cilDrop,
    cilCalendarCheck,
    cilWallet,
    cilUser,
    cilCalculator,
    cilCalendar,
    cilCheck,
    cilGlobeAlt,
    cilGraph,
    cilSearch
  } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const cookies = new Cookies();

const NavContext = createContext();

const NavProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    // Obtener roles del cookie y actualizar el estado
    const userRoles = cookies.get('roles') || [];
    setRoles(userRoles);

    // Actualizar la navegación según los roles
    let nav = [];
    const userIsAdmin = Rol('Admin');
    const userIsVentas = Rol('AdminCICAT');
    const userIsOperacion = Rol('Operaciones');
    const userIsGerenteP = Rol('GerentePlanta');

    nav = [
        ...((userIsVentas || userIsAdmin) ? [
            {
              component: CNavTitle,
              name: 'Ventas',
            },
            {
              component: CNavGroup,
              name: 'Cotizaciones',
              to: '/theme/admin',
              icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
              items:[
                {
                  component: CNavItem,
                  name: 'Lista Cotizaciones',
                  to: '/ventas/LCotizacion',
                  icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
                },
                {
                  component: CNavItem,
                  name: 'Lista PreCotizaciones',
                  to: '/ventas/LPreCotizacion',
                  icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
                },//]:[]),
                {
                  component: CNavItem,
                  name: 'Cotizador',
                  to: '/ventas/Cotizador',
                  icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
                }
              ]
            },
            {
              component: CNavGroup,
              name: 'Pedidos',
              to: '/theme/admin',
              icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
              items:[
                {
                  component: CNavItem,
                  name: 'Ver Pedidos',
                  to: '/logistica/LPedidos',
                  icon: <CIcon icon={cilCheck} customClassName="nav-icon" />,
                },
                {
                  component: CNavItem,
                  name: 'Pedidos en línea',
                  to: '/logistica/PLinea',
                  icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
                }
              ]
            }]:[]),
            ...((userIsAdmin || userIsOperacion || userIsGerenteP) ? [
            {
              component: CNavTitle,
              name: 'Operaciones',
            },
            {
              component: CNavGroup,
              name: 'Inventarios',
              to: '/Inventario',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              items: [
                {
                  component: CNavItem,
                  name: 'CICAT Resumen',
                  to: '/Cicat/Resumen',
                }
              ],
            }]:[]),
            ...((userIsAdmin || userIsOperacion || userIsGerenteP) ? [
            {
              component: CNavTitle,
              name: 'Administración',
            },
            ...(userIsAdmin ? [{
              component: CNavGroup,
              name: 'Usuarios',
              to: '/base',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              items: [
                {
                  component: CNavItem,
                  name: 'Permisos',
                  to: '/icons/coreui-icons',
                }
              ],
            }]:[]),
            {
              component: CNavGroup,
              name: 'Extras',
              to: '/utils',
              icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
              items: [
                ...((userIsAdmin || userIsOperacion || userIsGerenteP) ? [
                {
                  component: CNavItem,
                  name: 'PreCierres',
                  to: '/utils/PreCierres',
                }]:[]),
                ...(userIsAdmin ? [{
                  component: CNavItem,
                  name: 'INTERFAZ INTELISIS',
                  to: '/utils/InterfazIntelisis',
                }]:[]),
                ...((userIsAdmin || userIsOperacion || userIsGerenteP) ? [
                {
                  component: CNavItem,
                  name: 'Actualizar Producción',
                  to: '/utils/UpdateProd',
                }]:[]),
                ...(userIsAdmin ? [{
                  component: CNavItem,
                  name: 'Actualizar MB',
                  to: '/utils/UpdateMB',
                }]:[]),
                ...(userIsAdmin ? [{
                  component: CNavItem,
                  name: 'QR',
                  to: '/utils/QR',
                }]:[])
              ],
            }]:[]),
            ...((userIsAdmin || userIsOperacion) ? [
            {
              component: CNavTitle,
              name: 'REPORTES',
            },
            {
              component: CNavGroup,
              name: 'Logistica',
              to: '/Logistica',
              icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
              items: [
                ...((userIsAdmin) ? [
                {
                  component: CNavItem,
                  name: 'Pedidos Ventas',
                  to: '/reportes/PedidosVenta',
                }]:[]),
                ...((userIsAdmin || userIsOperacion) ? [
                {
                  component: CNavItem,
                  name: 'Reporte de Cotizaciones',
                  to: '/reportes/RCotizaciones',
                }]:[]),
                ...((userIsAdmin || userIsOperacion) ? [
                {
                    component: CNavItem,
                    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
                    name: 'Buscar Pedidos',
                    to: '/reportes/RBPedido',
                }]:[]),
              ],
            },
            {
              component: CNavGroup,
              name: 'Calidad',
              to: '/Calidad',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
              items: [
                {
                  component: CNavItem,
                  name: 'Costos Productos',
                  to: '/reportes/CostosProductos',
                },
              ],
            }]:[]),
    ];

    setNavigation(nav);
  }, []); // Solo se ejecuta cuando el componente se monta

  return (
    <NavContext.Provider value={{ roles, navigation }}>
      {children}
    </NavContext.Provider>
  );
};

export { NavContext, NavProvider };
