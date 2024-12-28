import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//VENTAS
const LCotizaciones = React.lazy(() => import('./views/ventas/LCotizaciones'))
const LPreCotizaciones = React.lazy(() => import('./views/ventas/LPreCotizaciones'))
const Cotizador = React.lazy(() => import('./views/ventas/Cotizador'))
const RCartera = React.lazy(() => import('./views/ventas/Cartera'))
//PRODUCCION
const RCicat = React.lazy(() => import('./views/cicat/Resumen/Resumen'))
const RemiFal = React.lazy(() => import('./views/cicat/Remisiones/RemiFal'))
const OSimulador = React.lazy(() => import('./views/Operaciones/Simulador/Simulador'))
//LOGISTICA
const LPedidos = React.lazy(() => import('./views/logistica/LPedidos'))
const PLinea = React.lazy(() => import('./views/logistica/PLinea'))
const PedidosC = React.lazy(() => import('./views/logistica/Pedidos/PedidosC'))
//INTERFAZ
const IObras = React.lazy(() => import('./views/interfaz/Obras'))
const IConfiguracion = React.lazy(() => import('./views/interfaz/Configuracion'))
const IMovimiento = React.lazy(() => import('./views/interfaz/MovimientoI'))
//REPORTES
const CostosProductos = React.lazy(() => import('./views/reportes/CProductos'))
const RPedidosVenta = React.lazy(() => import('./views/reportes/PedidosVenta'))
const RCotizaciones = React.lazy(() => import('./views/reportes/RCotizaciones'))
const RBPedido = React.lazy(() => import('./views/reportes/RBPedido'))
const RComision = React.lazy(() => import('./views/reportes/RComision'))
const RProyeccion = React.lazy(() => import('./views/reportes/RProyeccion'))
// EXTRAS
const PreCierre = React.lazy(() => import('./views/utils/PreCierre'))
const InterfazInt = React.lazy(() => import('./views/utils/InterfazInt'))
const UpdateProd = React.lazy(() => import('./views/utils/UpdateProd'))
const UpdateMB = React.lazy(() => import('./views/utils/UpdateMB'))
const QR = React.lazy(() => import('./views/utils/QR'))

//==================================================================================================================================
// Base
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
//Forms
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const Charts = React.lazy(() => import('./views/charts/Charts'))
// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))

const routes = [
  //{ path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element:Dashboard },
  //VENTAS
  { path: '/ventas/LCotizacion', name: 'Cotizaciones', element:LCotizaciones },
  { path: '/ventas/LPreCotizacion', name: 'PreCotizaciones', element:LPreCotizaciones },
  { path: '/ventas/Cotizador', name: 'Cotizador', element:Cotizador },
  { path: '/reportes/RComision', name: 'Comisiones', element:RComision },
  { path: '/ventas/Cartera', name: 'Cartera', element:RCartera },
  { path: '/reportes/RProyeccion', name: 'Proyeccion', element:RProyeccion },
  //PRODUCCION
  { path: '/Cicat/Resumen', name: 'Resumen', element:RCicat },
  { path: '/Cicat/Remisiones', name: 'Remisiones', element:RemiFal },
  { path: '/Operaciones/Simulador', name: 'Simulador', element:OSimulador },
  //LOGISTICA
  { path: '/logistica/LPedidos', name: 'Pedidos', element:LPedidos },
  { path: '/logistica/PLinea', name: 'Pedidos Linea', element:PLinea },
  { path: '/logistica/Pedidos/PedidosC', name: 'PedidosC', element:PedidosC },
  // INTERFAZ
  { path: '/interfaz/Obras', name: 'IObras', element:IObras },
  { path: '/interfaz/Configuracion', name: 'IConfiguracion', element:IConfiguracion },
  { path: '/interfaz/MovimientoI', name: 'IMovimiento', element:IMovimiento },
  { path: '/reportes/CostosProductos', name: 'CostosProductos', element: CostosProductos },
  { path: '/reportes/RCotizaciones', name: 'RCotizaciones', element: RCotizaciones },
  { path: '/reportes/PedidosVenta', name: 'PedidosVenta', element: RPedidosVenta },
  { path: '/reportes/RBPedido', name: 'BuscarPedido', element: RBPedido },
  { path: '/utils/PreCierres', name: 'PreCierres', element: PreCierre },
  { path: '/utils/InterfazInt', name: 'InterfazInt', element: InterfazInt },
  { path: '/utils/UpdateProd', name: 'UpdateProd', element: UpdateProd },
  { path: '/utils/UpdateMB', name: 'UpdateMB', element: UpdateMB },  
  { path: '/utils/QR', name: 'QR', element: QR },
]

export default routes
