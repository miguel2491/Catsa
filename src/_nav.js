import React,{useEffect, useState} from 'react'
import Cookies from 'universal-cookie';
import CIcon from '@coreui/icons-react'
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
  cilGraph
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import axios from 'axios';
import {Rol} from './Utilidades/Roles'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
const nav_ = [];
const userIsAdmin = Rol('Administrador'); 
const userIsVentas = Rol('CyC'); 
const userIsProduccion = Rol('CyC');
const permisoIsAP = Rol('CyC');
const permisoIsPC = Rol('CyC');
const permisoIsII = Rol('CyC');
const permisoIsUMB = Rol('CyC');
//=============================================================================

const _nav = [
  ...(userIsVentas ? [
  {
    component: CNavTitle,
    name: 'Ventas',
  },
  {
<<<<<<< HEAD
    console.log(error);
  }finally{

  }
}

  const _nav = [
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
        },
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
    },
    {
      component: CNavTitle,
      name: 'Produccion',
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
    },
    {
      component: CNavTitle,
      name: 'Administración',
    },
    {
      component: CNavGroup,
      name: 'Usuarios',
      to: '/base',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Permisos',
          to: '/permisos/Permisos',
        }
      ],
    },
    {
      component: CNavGroup,
      name: 'Extras',
      to: '/utils',
      icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'PreCierres',
          to: '/utils/PreCierres',
        },
        {
          component: CNavItem,
          name: 'INTERFAZ INTELISIS',
          to: '/utils/InterfazIntelisis',
        },
        {
          component: CNavItem,
          name: 'Actualizar Producción',
          to: '/utils/UpdateProd',
        },
        {
          component: CNavItem,
          name: 'Actualizar MB',
          to: '/utils/UpdateMB',
        }
      ],
    },
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
        {
          component: CNavItem,
          name: 'Pedidos Ventas',
          to: '/reportes/PedidosVenta',
        },
        {
          component: CNavItem,
          name: 'Pedidos Por Metro',
          to: '/reportes/PedidosMetro',
        },
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
    },
  ]
=======
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
  ...(userIsVentas ? [
  {
    component: CNavTitle,
    name: 'Produccion',
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
  ...(userIsAdmin || userIsProduccion ? [
  {
    component: CNavTitle,
    name: 'Administración',
  },
  ...(permisoIsPC ? [{
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
      ...(permisoIsPC ? [
      {
        component: CNavItem,
        name: 'PreCierres',
        to: '/utils/PreCierres',
      }]:[]),
      ...(permisoIsII ? [{
        component: CNavItem,
        name: 'INTERFAZ INTELISIS',
        to: '/utils/InterfazIntelisis',
      }]:[]),
      ...(permisoIsAP ? [
      {
        component: CNavItem,
        name: 'Actualizar Producción',
        to: '/utils/UpdateProd',
      }]:[]),
      ...(permisoIsUMB ? [{
        component: CNavItem,
        name: 'Actualizar MB',
        to: '/utils/UpdateMB',
      }]:[])
    ],
  }]:[]),
  ...(userIsAdmin ? [
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
      {
        component: CNavItem,
        name: 'Pedidos Ventas',
        to: '/reportes/PedidosVenta',
      },
      {
        component: CNavItem,
        name: 'Reporte de Cotizaciones',
        to: '/reportes/RCotizaciones',
      },
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
]
>>>>>>> 5fc065c (Permisos)
export default _nav;
