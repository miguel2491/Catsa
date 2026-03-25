import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Helper = React.lazy(() => import('./views/dashboard/Help'))
//==================================================> ****** <===============================================
const nVivo = React.lazy(() => import('./views/Operaciones/Pedidos/nVivo'))
const nPTReal = React.lazy(() => import('./views/Operaciones/Pedidos/nPTReal'))
//=========================================> VENTAS <========================================================
const LCotizaciones = React.lazy(() => import('./views/ventas/LCotizaciones'))
const LPreCotizaciones = React.lazy(() => import('./views/ventas/PreCotizaciones/LPreCotizaciones'))
const CVencimiento = React.lazy(() => import('./views/ventas/CVencimiento'))
const Cotizador = React.lazy(() => import('./views/ventas/Cotizador'))
const RCartera = React.lazy(() => import('./views/ventas/Cartera'))
const AddObjCom = React.lazy(() => import('./views/ventas/ObjCom/AddObjCom'))
const PrecProm = React.lazy(() => import('./views/ventas/PreProm/precioPromedio'))
const HisClie = React.lazy(() => import('./views/ventas/HisClie/hisClie'))
const VolClie = React.lazy(() => import('./views/ventas/VolClie'))
const Clientes = React.lazy(() => import('./views/ventas/Clientes/clientes'))
const Obras = React.lazy(() => import('./views/ventas/Obras/obras'))
const LevObras = React.lazy(() => import('./views/ventas/Obras/LevObras'))
const Facturas = React.lazy(() => import('./views/ventas/Facturas/Facturas'))
//=========================================> OPERACIONES <====================================================
const RCicat = React.lazy(() => import('./views/cicat/Resumen/Resumen'))
const RemiFal = React.lazy(() => import('./views/cicat/Remisiones/RemiFal'))
const InvRes = React.lazy(() => import('./views/cicat/Resumen/ResInv'))
const Excesos = React.lazy(() => import('./views/cicat/Remisiones/Exceso'))
const OSimulador = React.lazy(() => import('./views/Operaciones/Simulador/Simulador'))
const OCompraMan = React.lazy(() => import('./views/Operaciones/Mantenimiento/OrdenCompra/OCompra'))
const ReportesOC = React.lazy(() => import('./views/Operaciones/Mantenimiento/OrdenCompra/ReporteOC'))
const PCancelados = React.lazy(() => import('./views/Operaciones/Pedidos/Cancelados'))
const PCanceladosD = React.lazy(() => import('./views/Operaciones/Pedidos/DCancelados'))
const RPCancelados = React.lazy(() => import('./views/Operaciones/Pedidos/RPCancelados'))
const ListPedidos = React.lazy(() => import('./views/Operaciones/Pedidos/Pedidos'))
const Pedido = React.lazy(() => import('./views/Operaciones/Pedidos/LevantarPedido'))
const PedidosEliminados = React.lazy(() => import('./views/Operaciones/Pedidos/Eliminados'))
const PedidosMorosos = React.lazy(() => import('./views/Operaciones/Pedidos/Morosos'))
const InvAlmacen = React.lazy(() => import('./views/Operaciones/Inventarios/Almacen'))
const CommandIntelisis = React.lazy(() => import('./views/Operaciones/Inventarios/CommandIntelisis'))
const Cierres = React.lazy(() => import('./views/Operaciones/Cierres/Cierres'))

//=========================================> PRODUCCIÓN <=======================================================
const FDD = React.lazy(() => import('./views/Operaciones/Produccion/FDD'))
//=========================================> LOGISTICA <========================================================
const LPedidos = React.lazy(() => import('./views/logistica/LPedidos'))
const PLinea = React.lazy(() => import('./views/logistica/PLinea'))
const PedidosC = React.lazy(() => import('./views/logistica/Pedidos/PedidosC'))
const TimePedidos = React.lazy(() => import('./views/logistica/Pedidos/TimeLinePedidos'))
//=========================================> INTERFAZ <==========================================================
const IObras = React.lazy(() => import('./views/interfaz/Obras'))
const IConfiguracion = React.lazy(() => import('./views/interfaz/Configuracion'))
const IMovimiento = React.lazy(() => import('./views/interfaz/MovimientoI'))
const OPDuplicados = React.lazy(() => import('./views/interfaz/OPDuplicados'))
//=========================================> REPORTES <==========================================================
const CostosProductos = React.lazy(() => import('./views/reportes/CProductos'))
const RPedidosVenta = React.lazy(() => import('./views/reportes/PedidosVenta'))
const RCotizaciones = React.lazy(() => import('./views/reportes/RCotizaciones'))
const RCotizacionesP = React.lazy(() => import('./views/reportes/RCotizacionesP'))
const RBPedido = React.lazy(() => import('./views/reportes/RBPedido'))
const RComision = React.lazy(() => import('./views/reportes/RComision'))
const RProyeccion = React.lazy(() => import('./views/reportes/RProyeccion'))
const RProductosV = React.lazy(() => import('./views/reportes/RProductosV'))
const RObjCom = React.lazy(() => import('./views/reportes/ObjCom'))
const RBombas = React.lazy(() => import('./views/reportes/RBombas'))
//=========================================> Calidad <============================================================
const CostosPV = React.lazy(() => import('./views/Calidad/CostosPV'))
const Formulaciones = React.lazy(() => import('./views/Calidad/Formulaciones'))
const CLote = React.lazy(() => import('./views/Calidad/CLote'))
//=========================================> EXTRAS <=============================================================
const PreCierre = React.lazy(() => import('./views/utils/PreCierre'))
const InterfazInt = React.lazy(() => import('./views/utils/InterfazInt'))
const UpdateProd = React.lazy(() => import('./views/utils/UpdateProd'))
const UpdateMB = React.lazy(() => import('./views/utils/UpdateMB'))
const QR = React.lazy(() => import('./views/utils/QR'))
const Permisos = React.lazy(() => import('./views/permisos/Permisos'))
const Incidencias = React.lazy(() => import('./views/Admin/Usuarios/Usuarios'))
const CatObjCom = React.lazy(() => import('./views/Admin/ObjCom/Categoria'))
const PlaObjCom = React.lazy(() => import('./views/Admin/ObjCom/PlantaObjCom'))
const ECostos = React.lazy(() => import('./views/Admin/Costos/costos'))
const CTRef = React.lazy(() => import('./views/Admin/Costos/CRef'))
const LibUsuario = React.lazy(() => import('./views/Admin/Usuarios/LibUsuario'))
const Equipos = React.lazy(() => import('./views/Admin/Equipos/Equipos'))
const BEquipo = React.lazy(() => import('./views/Admin/Equipos/BitacoraEquipo'))
const UMovil = React.lazy(() => import('./views/Admin/Usuarios/Movil'))
const Nomina = React.lazy(() => import('./views/Admin/Nominas'))
//==================================================================================================================================

const routes = [
  //{ path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element:Dashboard },
  { path: '/help', name: 'Help', element:Helper },
  //------------------------------> ****** <----------------------------------------------
  { path: '/Operaciones/Pedidos/nVivo', name: 'Cotizaciones', element:nVivo },
  { path: '/Operaciones/Pedidos/PTReal', name: 'Pedidos', element:nPTReal },
  //------------------------------> VENTAS <----------------------------------------------
  { path: '/ventas/LCotizacion', name: 'Cotizaciones', element:LCotizaciones },
  { path: '/ventas/LPreCotizacion', name: 'PreCotizaciones', element:LPreCotizaciones },
  { path: '/ventas/CVencimiento', name: 'Vencimiento', element:CVencimiento },
  { path: '/ventas/Cotizador/:id', name: 'Cotizador', element:Cotizador },
  { path: '/reportes/RComision', name: 'Comisiones', element:RComision },
  { path: '/ventas/Cartera', name: 'Cartera', element:RCartera },
  { path: '/ventas/ObjCom', name: 'ObjCom', element:AddObjCom },
  { path: '/ventas/precioPromedio', name: 'PrecioPromedio', element:PrecProm },
  { path: '/ventas/hisClie', name: 'HistoricoClientes', element:HisClie },
  { path: '/ventas/volclie', name: 'Vol. Cliente', element:VolClie },
  { path: '/ventas/clientes', name: 'Clientes', element:Clientes },
  { path: '/ventas/obras', name: 'Obras', element:Obras },
  { path: '/ventas/LevObras', name: 'LevObras', element:LevObras },
  { path: '/reportes/RepObjCom', name: 'RObjCom', element:RObjCom },
  { path: '/Pedidos/Facturas', name: 'Facturas', element:Facturas },
  //------------------------------> OPERACIONES <---------------------------------------------------------------
  { path: '/Cicat/Resumen', name: 'Resumen', element:RCicat },
  { path: '/Cicat/Remisiones', name: 'Remisiones', element:RemiFal },
  { path: '/Cicat/Exceso', name: 'Exceso', element:Excesos },
  { path: '/Cicat/Inventario', name: 'Inventario', element:InvRes },
  { path: '/Operaciones/Simulador', name: 'Simulador', element:OSimulador },
  { path: '/Operaciones/Pedidos/Cancelados', name: 'Pedidos', element:PCancelados },
  { path: '/Operaciones/Pedidos/DCancelados/:id/:tipo/:idTicket', name: 'PedidosD', element:PCanceladosD },
  { path: '/Operaciones/Mantenimiento/ReporteOC', name: 'ReportesOC', element:ReportesOC },
  { path: '/Operaciones/Pedidos/RPCancelados', name: 'RPedidosC', element:RPCancelados },
  { path: '/Operaciones/Pedidos/Pedidos', name: 'ListPedido', element:ListPedidos },
  { path: '/Operaciones/Pedidos/LevantarPedido', name: 'Pedido', element:Pedido },
  { path: '/Operaciones/Pedidos/Eliminados', name: 'Pedido Eliminado', element:PedidosEliminados },
  { path: '/Operaciones/Pedidos/Morosos', name: 'Pedidos Morosos', element:PedidosMorosos },
  { path: '/Operaciones/Cierres', name: 'Cierres', element:Cierres },
  { path: '/Inventario/Almacen', name: 'Almacen', element:InvAlmacen },
  { path: '/logistica/CommandIntelisis', name: 'CommandIntelisis', element:CommandIntelisis },
  //------------------------------> PRODUCCION <-----------------------------------------------------------------
  { path: '/Operaciones/Produccion/FDD', name: 'Fin de Día', element:FDD },
  //------------------------------> MANTENIMIENTO <--------------------------------------------------------------
  { path: '/Operaciones/Mantenimiento/OrdenCompra', name: 'OCompra', element:OCompraMan },
  //------------------------------> LOGISTICA <------------------------------------------------------------------
  { path: '/logistica/LPedidos', name: 'Pedidos', element:LPedidos },
  { path: '/logistica/PLinea', name: 'Pedidos Linea', element:PLinea },
  { path: '/logistica/Pedidos/PedidosC', name: 'PedidosC', element:PedidosC },
  { path: '/logistica/Pedidos/TimeLinePedidos', name: 'TimePedidos', element:TimePedidos },
  //--------------------------------------------> INTERFAZ <-------------------------------
  { path: '/interfaz/Obras', name: 'IObras', element:IObras },
  { path: '/interfaz/Configuracion', name: 'IConfiguracion', element:IConfiguracion },
  { path: '/interfaz/MovimientoI', name: 'IMovimiento', element:IMovimiento },
  { path: '/interfaz/OPDuplicados', name: 'OPDuplicados', element:OPDuplicados },
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
  //--------------------------------------> CALIDAD <-------------------------------
  { path: '/Calidad/CostosPV', name: 'Calidad', element: CostosPV},
  { path: '/Calidad/Formulaciones', name: 'Calidad', element: Formulaciones},
  { path: '/Calidad/CLote', name: 'Crear Lote', element: CLote},
  //--------------------------------------------> EXTRAS <-------------------------------
  { path: '/Admin/Usuarios', name: 'Incidencias', element: Incidencias},
  { path: '/Admin/Catalogos/Categorias', name: 'CategoriaOC', element: CatObjCom},
  { path: '/Admin/Catalogos/PlaObjCom', name: 'PlaOC', element: PlaObjCom},
  { path: '/Admin/Costos', name: 'ECostos', element: ECostos},
  { path: '/Admin/Catalogos/REF', name: 'CRef', element: CTRef},
  { path: '/Admin/LiberarUsuario', name: 'LibUsuario', element: LibUsuario},
  { path: '/Admin/Equipos', name: 'Equipos', element: Equipos},
  { path: '/Admin/BitacoraEquipos', name: 'BEquipos', element: BEquipo},
  { path: '/Admin/Movil', name: 'UMovil', element: UMovil},
  { path: '/Admin/Nominas', name: 'Nomina', element: Nomina},
  //--------------------------------------------> REPORTES <-------------------------------
  { path: '/reportes/RProyeccion', name: 'Proyeccion', element:RProyeccion },
  { path: '/reportes/RProductosV', name: 'RProductosV', element:RProductosV },
  { path: '/reportes/RBombas', name: 'RBombas', element:RBombas },
  
]

export default routes
