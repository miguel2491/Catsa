import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { Rol } from '../Utilidades/Roles' // Asegúrate de tener este archivo
import {
  cilCursor,
  cilFilter,
  cilCalendarCheck,
  cilWallet,
  cilUser,
  cilCalculator,
  cilCalendar,
  cilCheck,
  cilGlobeAlt,
  cilGraph,
  cilSearch,
  cilCode,
  cilStar,
  cilClipboard,
  cilCog,
  cilBusAlt,
  cilGarage,
  cilDollar,
  cilBan,
  cilBarChart,
  cilFile,
  cilCash,
  cilTrash,
  cilCart,
  cilApps,
  cilAirplay,
  cilBank,
  cilIndentIncrease,
  cilPlaylistAdd,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const cookies = new Cookies()

const NavContext = createContext()

const NavProvider = ({ children }) => {
  const [roles, setRoles] = useState([])
  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    // Obtener roles del cookie y actualizar el estado
    const userRoles = cookies.get('roles') || []
    setRoles(userRoles)

    // Actualizar la navegación según los roles
    let nav = []
    const userIsAdminTI = Rol('AdminTI')
    const userIsAdmin = Rol('Admin')
    const userIsVentas = Rol('AdminCICAT')
    const userIsOperacion = Rol('Operaciones')
    const userIsMantenimiento = Rol('Mantenimiento')
    const userIsGerenteP = Rol('GerentePlanta')
    const userIsFinanzas = Rol('Finanzas')
    const userIsAuxGer = Rol('AuxiliarGerencial')
    const userIsDirector = Rol('Direccion')


    const userIsJP = Rol('JefePlanta')
    nav = [
      ...(userIsVentas || userIsAdminTI || userIsDirector || userIsFinanzas || userIsAdmin || userIsOperacion 
        ? [
            {
              component: CNavTitle,
              name: 'Ventas',
            },
            ...(userIsVentas || userIsDirector || userIsAdminTI
              ? [
                  {
                    component: CNavGroup,
                    name: 'Cotizaciones',
                    to: '/theme/admin',
                    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
                    items: [
                      {
                        component: CNavItem,
                        name: 'Cotizador',
                        to: '/ventas/Cotizador/0',
                        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
                      },
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
                    ],
                  },
                ]
              : []),
            ...(userIsVentas || userIsAdmin || userIsDirector  || userIsAdminTI || userIsOperacion
              ? [
                  {
                    component: CNavGroup,
                    name: 'Pedidos',
                    to: '/theme/admin',
                    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
                    items: [
                      ...(userIsAdminTI
                        ? [
                            {
                              component: CNavItem,
                              name: 'Ver Pedidos',
                              to: '/logistica/LPedidos',
                              icon: <CIcon icon={cilCheck} customClassName="nav-icon" />,
                            },
                          ]
                        : []),
                      ...(userIsVentas ||
                      userIsAdmin ||
                      userIsAdminTI ||
                      userIsGerenteP ||
                      userIsFinanzas ||
                      userIsDirector
                        ? [
                            {
                              component: CNavItem,
                              name: 'Calendario',
                              to: '/logistica/Pedidos/PedidosC',
                              icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
                            },
                          ]
                          : []),
                          ...(
                            userIsAdminTI
                              ? [
                            {
                              component: CNavItem,
                              name: 'Timer Pedidos',
                              to: '/logistica/Pedidos/TimeLinePedidos',
                              icon: <CIcon icon={cilBan} customClassName="nav-icon" />,
                            },
                          ]
                        : []),
                      ...(userIsAdminTI
                        ? [
                            {
                              component: CNavItem,
                              name: 'Pedidos en línea',
                              to: '/logistica/PLinea',
                              icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
                            },
                          ]
                        : []),
                    ],
                  },
                ]
              : []),
            ...(userIsVentas || userIsAdminTI || userIsDirector || userIsFinanzas
              ? [
                  {
                    component: CNavGroup,
                    name: 'Reporte Ventas',
                    to: '/theme/admin',
                    icon: <CIcon icon={cilFilter} customClassName="nav-icon" />,
                    items: [
                      {
                        component: CNavItem,
                        name: 'Comisiones',
                        to: '/reportes/RComision',
                        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
                      },
                      {
                        component: CNavItem,
                        name: 'Proyección',
                        to: '/reportes/RProyeccion',
                        icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
                      }, //]:[]),
                      {
                        component: CNavItem,
                        name: 'Cartera',
                        to: '/ventas/Cartera',
                        icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
                      },
                    ],
                  },
                ]
              : []),
              ...(userIsVentas || userIsAdminTI || userIsDirector
                ? [
                    {
                      component: CNavGroup,
                      name: 'Objetivos Comerciales',
                      to: '/theme/admin',
                      icon: <CIcon icon={cilIndentIncrease} customClassName="nav-icon" />,
                      items: [
                        {
                          component: CNavItem,
                          name: 'Agregar Objetivo Comercial',
                          to: '/ventas/ObjCom',
                          icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
                        },
                        {
                          component: CNavItem,
                          name: 'Reporte Objetivo Comercial',
                          to: '/reportes/RepObjCom',
                          icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
                        },
                      ],
                    },
                  ]
                : []),  
          ]
        : []),
      ...(userIsAdmin || userIsOperacion || userIsGerenteP || userIsJP || userIsAdminTI || userIsAuxGer
        ? [
            {
              component: CNavTitle,
              name: 'Operaciones',
            },
            ...(userIsAdmin || userIsOperacion || userIsGerenteP || userIsJP || userIsAdminTI || userIsAuxGer
              ? [
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
                    },
                    ...(userIsOperacion || userIsAdmin || userIsGerenteP
                      ? [
                        {
                          component: CNavItem,
                          name: 'Remisión Faltante',
                          to: '/Cicat/Remisiones',
                          icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />
                        },
                      ]:[]),
                    ...(userIsAdminTI  
                    ?[
                      {
                        component: CNavItem,
                        name: 'Simulador',
                        to: '/Operaciones/Simulador',
                        icon: <CIcon icon={cilGraph} customClassName="nav-icon" />
                      },
                    ]:[])
                  ],
                },
              ]
            :[]),
            ...(userIsOperacion || userIsAdmin || userIsGerenteP || userIsJP || userIsAdminTI
              ? [
                {
                  component: CNavGroup,
                  name: 'Mantenimiento',
                  to: '/Mantenimiento',
                  icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
                  items: [
                    ...(userIsOperacion || userIsAdmin || userIsGerenteP || userIsJP
                      ? [
                        {
                          component: CNavItem,
                          name: 'Orden Compra',
                          to: '/Operaciones/Mantenimiento/OrdenCompra',
                          icon: <CIcon icon={cilGarage} customClassName="nav-icon" />,
                        },
                      ]:[]),
                    ...(userIsOperacion || userIsAdmin || userIsGerenteP
                    ? [
                      {
                        component: CNavItem,
                        name: 'Reporte Orden Compra',
                        to: '/Operaciones/Mantenimiento/ReporteOC',
                        icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
                      },
                    ]:[]),
                  ],
                },
              ]
            :[]),
            ...(userIsOperacion || userIsAdmin || userIsAdminTI || userIsAuxGer
              ? [
                {
                  component: CNavGroup,
                  name: 'Pedidos',
                  to: '/Pedidos',
                  icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
                  items: [
                    ...(userIsOperacion || userIsAdmin || userIsGerenteP || userIsJP || userIsAuxGer
                      ? [
                        {
                          component: CNavItem,
                          name: 'Pedidos Cancelados',
                          to: '/Operaciones/Pedidos/Cancelados',
                          icon: <CIcon icon={cilBan} customClassName="nav-icon" />
                        },
                      ]:[]),
                  ],
                },
              ]
              :[]),
          ]
        : []),
        ...(userIsAdminTI
          ? [
              {
                component: CNavTitle,
                name: 'Calidad',
              },
              {
                component: CNavGroup,
                name: 'Sistema Gestión',
                to: '/Gestion',
                icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
                items: [
                  {
                    component: CNavItem,
                    name: 'CICAT Resumen',
                    to: '/Cicat/Resumen',
                  },
                ],
              },
              ...(userIsAdminTI
              ? [
                  {
                    component: CNavItem,
                    name: 'Costos PV',
                    to: '/Calidad/CostosPV',
                    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
                  },
                  {
                    component: CNavItem,
                    name: 'Formulaciones',
                    to: '/Calidad/Formulaciones',
                    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
                  },
              ]:[]),
            ]
          : []),
      ...(userIsAdmin || userIsOperacion || userIsAdminTI || userIsAuxGer
        ? [
            {
              component: CNavTitle,
              name: 'Administración',
            },
            ...(userIsAdminTI
              ? [
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
                      },
                      {
                        component: CNavItem,
                        name: 'Incidencias',
                        to: '/Admin/Usuarios',
                        icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
                      },
                    ],
                  },
                ]
              : []),
            {
              component: CNavGroup,
              name: 'Extras',
              to: '/utils',
              icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
              items: [
                ...(userIsAdmin || userIsOperacion || userIsGerenteP || userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'PreCierres',
                        to: '/utils/PreCierres',
                      },
                    ]
                  : []),
                ...(userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'INTERFAZ INTELISIS',
                        to: '/utils/InterfazIntelisis',
                      },
                    ]
                  : []),
                ...(userIsAdmin || userIsOperacion || userIsGerenteP || userIsAdminTI || userIsAuxGer
                  ? [
                      {
                        component: CNavItem,
                        name: 'Actualizar Producción',
                        to: '/utils/UpdateProd',
                      },
                    ]
                  : []),
                ...(userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'Actualizar MB',
                        to: '/utils/UpdateMB',
                      },
                    ]
                  : []),
                ...(userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'QR',
                        to: '/utils/QR',
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userIsAdminTI
        ? [
            {
              component: CNavGroup,
              name: 'Interfaz CB',
              to: '/interfaz',
              icon: <CIcon icon={cilCode} customClassName="nav-icon" />,
              items: [
                ...(userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'Principal',
                        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
                        to: '/interfaz/Obras',
                      },
                      {
                        component: CNavItem,
                        name: 'Configuraciones',
                        icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
                        to: '/interfaz/Configuracion',
                      },
                    ]
                  : []),
              ],
            },
            {
              component: CNavGroup,
              name: 'Interfaz Intelisis',
              to: '/interfaz',
              icon: <CIcon icon={cilCode} customClassName="nav-icon" />,
              items: [
                ...(userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'Movimientos',
                        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
                        to: '/interfaz/MovimientoI',
                      },
                    ]
                  : []),
              ],
            },
            {
              component: CNavGroup,
              name: 'Catalogos',
              to: '/catalogos',
              icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
              items: [
                ...(userIsAdminTI
                  ? [
                      {
                        component: CNavItem,
                        name: 'Categorias Obj Com',
                        icon: <CIcon icon={cilAirplay} customClassName="nav-icon" />,
                        to: '/Admin/Catalogos/Categorias',
                      },{
                        component: CNavItem,
                        name: 'Plantas Obj Com',
                        icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
                        to: '/Admin/Catalogos/PlaObjCom',
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(userIsAdminTI || userIsDirector || userIsAdmin || userIsGerenteP
        ? [
            {
              component: CNavTitle,
              name: 'REPORTES',
            },
            ...(userIsAdminTI || userIsAdmin || userIsDirector || userIsOperacion
              ? [
                {
                  component: CNavGroup,
                  name: 'Logistica',
                  to: '/Logistica',
                  icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
                  items: [
                    ...(userIsAdminTI
                      ? [
                          {
                            component: CNavItem,
                            name: 'Pedidos Ventas',
                            to: '/reportes/PedidosVenta',
                          },
                        ]
                      : []),
                    ...(userIsAdmin || userIsAdminTI
                      ? [
                          {
                            component: CNavItem,
                            name: 'Reporte de Cotizaciones',
                            to: '/reportes/RCotizaciones',
                          },
                        ]
                      : []),
                    ...(userIsAdmin || userIsOperacion || userIsAdminTI || userIsDirector
                      ? [
                          {
                            component: CNavItem,
                            icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
                            name: 'Buscar Pedidos',
                            to: '/reportes/RBPedido',
                          },
                        ]
                      : []),
                  ],
                },
            ]:[]),            
            ...(userIsAdminTI
                  ? [
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
            :[]),
            ...(userIsAdminTI || userIsAdmin
              ? [
            {
              component: CNavGroup,
              name: 'Ventas',
              to: '/Ventas',
              icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
              items: [
                {
                  component: CNavItem,
                  name: 'Cotizaciones',
                  to: '/reportes/RCotizacionesP',
                  icon:<CIcon icon={cilCash} customClassName="nav-icon" />,
                },
                {
                  component: CNavItem,
                  name: 'Ventas por Productos',
                  to: '/reportes/RProductosV',
                  icon:<CIcon icon={cilCart} customClassName="nav-icon" />,
                },
              ],
            },
          ]
          :[]),
          ]
        : []),
    ]

    setNavigation(nav)
  }, []) // Solo se ejecuta cuando el componente se monta

  return <NavContext.Provider value={{ roles, navigation }}>{children}</NavContext.Provider>
}

export { NavContext, NavProvider }
