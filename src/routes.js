import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Helper = React.lazy(() => import('./views/dashboard/Help'))
//=========================================> VENTAS <===================================
const LCotizaciones = React.lazy(() => import('./views/ventas/LCotizaciones'))
const LPreCotizaciones = React.lazy(() => import('./views/ventas/LPreCotizaciones'))
const Cotizador = React.lazy(() => import('./views/ventas/Cotizador'))
const RCartera = React.lazy(() => import('./views/ventas/Cartera'))
//=========================================> OPERACIONES <===============================
const RCicat = React.lazy(() => import('./views/cicat/Resumen/Resumen'))
const RemiFal = React.lazy(() => import('./views/cicat/Remisiones/RemiFal'))
const OSimulador = React.lazy(() => import('./views/Operaciones/Simulador/Simulador'))
const OCompraMan = React.lazy(() => import('./views/Operaciones/Mantenimiento/OrdenCompra/OCompra'))
const ReportesOC = React.lazy(() => import('./views/Operaciones/Mantenimiento/OrdenCompra/ReporteOC'))
const PCancelados = React.lazy(() => import('./views/Operaciones/Pedidos/Cancelados'))
const PCanceladosD = React.lazy(() => import('./views/Operaciones/Pedidos/DCancelados'))
//=========================================> LOGISTICA <================================
const LPedidos = React.lazy(() => import('./views/logistica/LPedidos'))
const PLinea = React.lazy(() => import('./views/logistica/PLinea'))
const PedidosC = React.lazy(() => import('./views/logistica/Pedidos/PedidosC'))
const TimePedidos = React.lazy(() => import('./views/logistica/Pedidos/TimeLinePedidos'))
//=========================================> INTERFAZ <=================================
const IObras = React.lazy(() => import('./views/interfaz/Obras'))
const IConfiguracion = React.lazy(() => import('./views/interfaz/Configuracion'))
const IMovimiento = React.lazy(() => import('./views/interfaz/MovimientoI'))
//=========================================> REPORTES <=================================
const CostosProductos = React.lazy(() => import('./views/reportes/CProductos'))
const RPedidosVenta = React.lazy(() => import('./views/reportes/PedidosVenta'))
const RCotizaciones = React.lazy(() => import('./views/reportes/RCotizaciones'))
const RCotizacionesP = React.lazy(() => import('./views/reportes/RCotizacionesP'))
const RBPedido = React.lazy(() => import('./views/reportes/RBPedido'))
const RComision = React.lazy(() => import('./views/reportes/RComision'))
const RProyeccion = React.lazy(() => import('./views/reportes/RProyeccion'))
const RProductosV = React.lazy(() => import('./views/reportes/RProductosV'))
//=========================================> Calidad <===================================
const CostosPV = React.lazy(() => import('./views/Calidad/CostosPV'))
const Formulaciones = React.lazy(() => import('./views/Calidad/Formulaciones'))
//=========================================> EXTRAS <===================================
const PreCierre = React.lazy(() => import('./views/utils/PreCierre'))
const InterfazInt = React.lazy(() => import('./views/utils/InterfazInt'))
const UpdateProd = React.lazy(() => import('./views/utils/UpdateProd'))
const UpdateMB = React.lazy(() => import('./views/utils/UpdateMB'))
const QR = React.lazy(() => import('./views/utils/QR'))
const Permisos = React.lazy(() => import('./views/permisos/Permisos'))
const Incidencias = React.lazy(() => import('./views/Admin/Usuarios/Usuarios'))
//==================================================================================================================================

const routes = [
  //{ path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element:Dashboard },
  { path: '/help', name: 'Help', element:Helper },
  //------------------------------> VENTAS <----------------------------------------------
  { path: '/ventas/LCotizacion', name: 'Cotizaciones', element:LCotizaciones },
  { path: '/ventas/LPreCotizacion', name: 'PreCotizaciones', element:LPreCotizaciones },
  { path: '/ventas/Cotizador/:id', name: 'Cotizador', element:Cotizador },
  { path: '/reportes/RComision', name: 'Comisiones', element:RComision },
  { path: '/ventas/Cartera', name: 'Cartera', element:RCartera },
  //------------------------------> OPERACIONES <------------------------------------------
  { path: '/Cicat/Resumen', name: 'Resumen', element:RCicat },
  { path: '/Cicat/Remisiones', name: 'Remisiones', element:RemiFal },
  { path: '/Operaciones/Simulador', name: 'Simulador', element:OSimulador },
  { path: '/Operaciones/Pedidos/Cancelados', name: 'Pedidos', element:PCancelados },
  { path: '/Operaciones/Pedidos/DCancelados/:id/:tipo/:idTicket', name: 'PedidosD', element:PCanceladosD },
  { path: '/Operaciones/Mantenimiento/ReporteOC', name: 'ReportesOC', element:ReportesOC },
  //------------------------------> MANTENIMIENTO <----------------------------------------
  { path: '/Operaciones/Mantenimiento/OrdenCompra', name: 'OCompra', element:OCompraMan },
  //------------------------------> LOGISTICA <--------------------------------------------
  { path: '/logistica/LPedidos', name: 'Pedidos', element:LPedidos },
  { path: '/logistica/PLinea', name: 'Pedidos Linea', element:PLinea },
  { path: '/logistica/Pedidos/PedidosC', name: 'PedidosC', element:PedidosC },
  { path: '/logistica/Pedidos/TimeLinePedidos', name: 'TimePedidos', element:TimePedidos },
  //--------------------------------------------> INTERFAZ <-------------------------------
  { path: '/interfaz/Obras', name: 'IObras', element:IObras },
  { path: '/interfaz/Configuracion', name: 'IConfiguracion', element:IConfiguracion },
  { path: '/interfaz/MovimientoI', name: 'IMovimiento', element:IMovimiento },
  { path: '/reportes/CostosProductos', name: 'CostosProductos', element: CostosProductos },
  { path: '/reportes/RCotizaciones', name: 'RCotizaciones', element: RCotizaciones },
  { path: '/reportes/RCotizacionesP', name: 'RCotizacionesP', element: RCotizacionesP },
  { path: '/reportes/PedidosVenta', name: 'PedidosVenta', element: RPedidosVenta },
  { path: '/reportes/RBPedido', name: 'BuscarPedido', element: RBPedido },
  { path: '/utils/PreCierres', name: 'PreCierres', element: PreCierre },
  { path: '/utils/InterfazInt', name: 'InterfazInt', element: InterfazInt },
  { path: '/utils/UpdateProd', name: 'UpdateProd', element: UpdateProd },
  { path: '/utils/UpdateMB', name: 'UpdateMB', element: UpdateMB },  
  { path: '/utils/QR', name: 'QR', element: QR },
  { path: '/permisos/Permisos', name: 'Permisos', element: Permisos},
  { path: '/Calidad/CostosPV', name: 'Calidad', element: CostosPV},
  { path: '/Calidad/Formulaciones', name: 'Calidad', element: Formulaciones},
  //--------------------------------------------> EXTRAS <-------------------------------
  { path: '/Admin/Usuarios', name: 'Incidencias', element: Incidencias},
  //--------------------------------------------> REPORTES <-------------------------------
  { path: '/reportes/RProyeccion', name: 'Proyeccion', element:RProyeccion },
  { path: '/reportes/RProductosV', name: 'RProductosV', element:RProductosV },
]

export default routes
