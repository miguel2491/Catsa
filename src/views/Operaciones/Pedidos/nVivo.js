import React, { useEffect, useState } from 'react'
import '../../../estilos.css'
import Swal from 'sweetalert2'
import 'leaflet/dist/leaflet.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import DataTable from 'react-data-table-component'
import 'react-datepicker/dist/react-datepicker.css'
import 'rc-time-picker/assets/index.css'
import { useNavigate } from 'react-router-dom'
import { GetPlantas, GetPVivos, GetPLinea, GetPVivosAnt, convertArrayOfObjectsToCSV, GetRecoverys} from '../../../Utilidades/Funciones'
import { CButton, CBadge, CContainer, CRow, CCol, CSpinner, CFormSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCopy, cilSearch } from '@coreui/icons'
import FechaI from '../../base/parametros/FechaInicio'
import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import { Rol } from '../../../Utilidades/Roles'
import { format, isBefore, isAfter, isEqual, startOfDay } from 'date-fns';

const nVivo = () => {
  const navigate = useNavigate()
  const [plantasSel, setPlantas] = useState('')
  const [plantasDB, setPlantasDB] = useState([]);
  const [plantasSelDB, setPlantasSelDB] = useState("");
  const [vFechaI, setFechaIni] = useState(new Date())
  //------------------Shows---------------------------------
  const [shDiv, setShDiv] = useState(false);
  const [shDivRec, setShDivRec] = useState(false);
  const [shCarga, setShCarga] = useState(true);
  const [shBtnRec, setShBtnRec] = useState(false);
  const [online, setOnline] = useState(true)
  //--DT Clientes
  const [dtPlantas, setDTPlantas] = useState([])
  const [dtPVivoAux, setDTPVicoAux] = useState([]);
  const [dtRecovery, setDTRecovery] = useState([]);
  const [repPDF, setRepPDF] = useState([]);
  //--------------------------- Buscador --------------------------------------
  const [fText, setFText] = useState('') // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('')
  // ROLES
  const userIsAdmin = Rol('Admin')
  const app = [];

  useEffect(() => {
    VerPlantas()
  }, [])
  //-----------------------------------------------------------------------------------
  const mCambio = (event) => {
    const pla = event.target.value
    setPlantas(pla)
  }
  const mCambioDB = (event) => {
    const pla = event.target.value
    setPlantasSelDB(pla);
    setShBtnRec(true);
    fListRespaldo(pla);
  }
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US', opcionesFca))
  }
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit', // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit', // 'numeric', '2-digit'
  }
  //---------------------------- BOTONS --------------------------------------------
  const VerPlantas = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Comprobando...',
      didOpen: () => {
        Swal.showLoading() // Muestra la animación de carga
      },
    })
    try {
      // Llamada a la API
      const pLantas = await GetPlantas();
      Swal.close() // Cerramos el loading
      if (pLantas) {
        setDTPlantas(pLantas);
        const ap = pLantas.filter(item => item.estado === "Success").map((item, index) => ({
          ID: index,
          IdPlanta: item.planta,
          Planta: item.planta
        }));
        console.log(ap)
        setPlantasDB(ap);
      } else {
        Swal.close()
        Swal.fire('Error', 'Ocurrió un error, vuelve a intentar', 'error')
      }
      setShCarga(false)
    } catch (error) {
      Swal.close()
      Swal.fire('Error', 'No se pudo obtener la información', 'error')
    }
  }
  const btnBuscar = async () => {
    setShDiv(true)
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
        Swal.showLoading() // Muestra la animación de carga
      },
    })
    try {
      // Llamada a la API
      const auxFcaI = format(vFechaI, 'yyyy/MM/dd')
      const auxFcaIn = format(vFechaI, 'yyyy-MM-dd')
      
      const [year, month, day] = auxFcaIn.split('-').map(Number);
      const fcaI = startOfDay(new Date(year, month - 1, day)); // mes base 0
      const hoy = startOfDay(new Date());
      const pLinea = await GetPLinea(auxFcaI,plantasSel);

      Swal.close() // Cerramos el loading
      let pActual = false;
      if (pLinea) {
        setShDiv(true)
        let pvivo;
        if(isBefore(fcaI, hoy)){
          pvivo = await GetPVivosAnt(auxFcaI,plantasSel)
          pActual = true;
        }else if (isAfter(fcaI, hoy)) {
        } else if (isEqual(fcaI, hoy)) {
          pvivo = await GetPVivos(auxFcaI,plantasSel)
        }
        
        const obras = pvivo.Remisiones;
        const fusionado = pLinea.map(pedido => {
          let obrasRelacionadas;
          if(pActual){
            obrasRelacionadas = obras.filter(o => parseInt(o.IdPedido) === parseInt(pedido.IdPedido));
          }else{
            obrasRelacionadas = obras.filter(o => o.IdPedido === pedido.IdPedido);
          }
          
          // sumar la cantidad de todas las remisiones
          const totalCantidad = obrasRelacionadas.reduce((sum, o) => sum + Number(o.Cantidad || 0), 0);

          return {
            ...pedido,
            Obras: obrasRelacionadas,
            TotalCantidad: totalCantidad
          };
        });
        setDTPVicoAux(fusionado);
        setRepPDF(fusionado)
      } else {
        Swal.close()
        Swal.fire('Error', 'Ocurrió un error, vuelve a intentar', 'error')
      }
    } catch (error) {
      console.log(error)
      // Cerrar el loading y mostrar el error
      Swal.close()
      Swal.fire('Error', 'No se pudo obtener la información', 'error')
    }
  }
  const conditionalRowStyles = [
  {
    when: row => row.activo, // ✅ condición
      style: {
        backgroundColor: '#F4E2DE', // claro
    },
  },{
    when: row => new Date(row.hrSalida) < new Date(),
    style: {
      backgroundColor: '#ADD8E6', // azul claro
      color: '#000',
    },
  },
  {
    when: row => new Date(row.hrSalida) >= new Date(),
    style: {
      backgroundColor: '#FF9999', // rojo claro
      color: '#000',
    },
  },
  ];
  //--------------------------- COLS -----------------------------------------------
  const colPVivo = [
    {
      name: 'PLANTA',
      selector: (row) => plantasSel,
      sortable: true,
      width: '120px',
    },
    {
      name: 'PEDIDO',
      sortable: true,
      selector: (row) => row.IdPedido,
      width: '150px',
    },
    {
      name: 'OBRA',
      selector: (row) => row.Obra,
      sortable: true,
      width: '250px',
    },
    {
      name: 'PRODUCTO',
      selector: (row) => {
        const vendedor = row.Producto
        if (vendedor === null || vendedor === undefined) {
          return 'No disponible'
        }
        if (typeof vendedor === 'object') {
          return '-' // O cualquier mensaje que prefieras
        }
        return vendedor
      },
      sortable: true,
      width: '150px',
    },
    {
      name: 'M3',
      selector: (row) => {
        
        return row.M3
      },
      sortable: true,
      width: '100px',
    },
    {
      name: 'ENVIADOS',
      selector: (row) => {
        var numero = row.TotalCantidad
        if (numero === null || numero === undefined) {
          numero = 'No disponible'
        }
        return numero
      },
      sortable: true,
      width: '120px',
    },
    {
      name: 'FECHA',
      selector: (row) => {
        var fecha = row.FechaHoraPedido
        if (fecha === null || fecha === undefined) {
          return "No disponible";
        }
        if (typeof fecha === 'object') {
          return "Sin Fecha"; // O cualquier mensaje que prefieras
        }
        const [fecha_, hora_] = fecha.split("T");
        return fecha_
      },
      sortable: true,
      width: '150px',
    },
    {
      name: 'SOLICITADO',
      selector: (row) => {
        const fcaHP = row.FechaHoraPedido
        if (fcaHP === null || fcaHP === undefined) {
          return "No disponible";
        }
        if (typeof fcaHP === 'object') {
          return "Sin Horario"; // O cualquier mensaje que prefieras
        }
        const [fecha_, hora_] = fcaHP.split("T");
        return hora_.substring(0,5)
      },
      sortable: true,
      width: '150px',
    },
    {
      name: 'HORA SALIDA',
      selector: (row) => {
        const hraSalida = row.hrSalida
        if (hraSalida === null || hraSalida === undefined) {
          return "No disponible";
        }
        if (typeof hraSalida === 'object') {
          return "Sin hraSalida"; // O cualquier mensaje que prefieras
        }
        const [fecha_, hora_] = hraSalida.split("T");
        return hora_.substring(0,5)
      },
      sortable: true,
      width: '150px',
    },
    {
      name: 'TIEMPO REAL',
      selector: (row) => {
        const tReal = row.TiempoReal
        return tReal
      },
      sortable: true,
      width: '100px',
    },
    {
      name: 'DISTANCIA (KM)',
      selector: (row) => {
        const distancia = row.Distancia
        return distancia
      },
      sortable: true,
      width: '150px',
    },
  ];
  const ExpandedComponent = ({ data }) => {
    return(
    <div style={{ padding: '10px 20px' }}>
      <h4>Remisiones</h4>

      {data.Obras && data.Obras.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Remisión</th>
              <th>TR</th>
              <th>Conductor</th>
              <th>M3</th>
              <th>Acomulado</th>
              <th>Inicio Carga</th>
              <th>Salió de Planta</th>
              <th>Llego a Obra</th>
              <th>Regreso de Obra</th>
              <th>Llego a Planta</th>
              <th>Tiempo Ciclo</th>
              <th>Distancia KM</th>
            </tr>
          </thead>
          <tbody>
            {data.Obras.map((o, i) => {
              const [fechaInicio, horaInicio] = o.InicioCarga
                ? o.InicioCarga.split('T')
                : ['—', '—'];
              const [fechaSalida, horaSalida] = o.SalioDePlanta
                ? o.SalioDePlanta.split('T')
                : ['—', '—'];
              
              const [llegoObra, hraLlego] =
                typeof o.LlegoAObra === 'string' && o.LlegoAObra.includes('T')
                  ? o.LlegoAObra.split('T')
                  : ['—', '—'];
              const [regresoObra, hraRegreso] = 
                typeof o.RegresaDeObra === 'string' && o.RegresaDeObra.includes('T')
                  ? o.RegresaDeObra.split('T')
                  : ['—', '—'];
              const [llegoPlanta, hraPlanta] = 
                typeof o.LlegoAPlanta === 'string' && o.LlegoAPlanta.includes('T')
                  ? o.LlegoAPlanta.split('T')
                  : ['—', '—'];

              return (
                <tr key={i}>
                  <td>{o.NoRemision}</td>
                  <td>{o.TR}</td>
                  <td>{o.Conductor}</td>
                  <td>{o.Cantidad}</td>
                  <td>
                    {typeof o.Enviado === 'object' && Object.keys(o.Enviado).length === 0
                      ? '—' // muestra un guion si está vacío
                      : o.Enviado}
                  </td>
                  <td>
                    {horaInicio?.slice(0, 5)}
                  </td>
                  <td>
                    {horaSalida?.slice(0, 5)}
                  </td>
                  <td>
                    {typeof o.LlegoAObra === 'object' && Object.keys(o.LlegoAObra).length === 0
                      ? '—' // muestra un guion si está vacío
                      : hraLlego?.slice(0, 5)}
                  </td>
                  <td>
                    {typeof o.RegresaDeObra === 'object' && Object.keys(o.RegresaDeObra).length === 0
                      ? '—' // muestra un guion si está vacío
                      : hraRegreso?.slice(0, 5)}
                  </td>
                  <td>
                    {typeof o.LlegoAPlanta === 'object' && Object.keys(o.LlegoAPlanta).length === 0
                      ? '—' // muestra un guion si está vacío
                      : hraPlanta?.slice(0, 5)}
                  </td>
                  <td>
                    {typeof o.TiempoCiclo === 'object' && Object.keys(o.TiempoCiclo).length === 0
                      ? '—' // muestra un guion si está vacío
                      : o.TiempoCiclo}
                  </td>
                  <td>
                    {typeof o.DistanciaKm === 'object' && Object.keys(o.DistanciaKm).length === 0
                      ? '—' // muestra un guion si está vacío
                      : o.DistanciaKm}
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Sin obras relacionadas</p>
      )}
    </div>
    )
  };
  const colDBR = [
     {
      name: 'ID',
      sortable: true,
      selector: (row) => row.IdPedido,
      width: '150px',
    },
    {
      name: 'PLANTA',
      selector: (row) => plantasDB,
      sortable: true,
      width: '120px',
    },
    {
      name: 'ESTADO',
      selector: (row) => row.Obra,
      sortable: true,
      width: '250px',
    },
    {
      name: 'FECHA',
      selector: (row) => row.Obra,
      sortable: true,
      width: '250px',
    },
    {
        name: 'ACCION',
        width:"100px",
        sortable:true,
        cell: (row) => {
            return (
            <div>
                <CRow>
                    <CCol xs={2} md={2} lg={2}>
                    <CButton
                        style={{ color: 'white' }}
                        color="warning"
                        onClick={() => Recuperar(row.IdPedido)}
                        size="sm"
                        className="me-2"
                        title="Recuperar"
                    >
                        <CIcon icon={cilSync} />
                    </CButton>
                    </CCol>
                </CRow>
            </div>
            );
        },
    },
  ];
  //----------------------- FUNCIONES ----------------------------------------------
  const fListRespaldo = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
        Swal.showLoading() // Muestra la animación de carga
      },
    })
    setShDivRec(true);
    try{
      const listRecovery = await GetRecoverys(plantasSel,"R","0",0);
      console.log(listRecovery)
      if(listRecovery){
        setDTRecovery(listRecovery);
      }else{
        Swal.close()
        Swal.fire('Error', 'Ocurrió un error, vuelve a intentar', 'error')
      }
    }catch(error){
      Swal.close()
      Swal.fire('Error', 'No se pudo obtener la información', 'error')
    }
  }
  const fRespaldar = async () => {
    let fechaHra = format(new Date(),'yyyy-MM-dd HH:mm:ss');
    console.log(fechaHra,plantasSelDB);
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
        Swal.showLoading() // Muestra la animación de carga
      },
    });
    try{
      Swal.close()
      const lDt = await setRecovery(plantasSelDB,fechaHra);
      if(lDT){
        Swal.fire('Success', 'Copia Realizada Correctamente', 'success');
        fListRespaldo(plantasSelDB);
      }else{
        Swal.fire('Error', 'Ocurrió un error, vuelve a intentar', 'error')
      }
    }catch(error){
      Swal.fire('Error', 'Ocurrió un error, vuelve a intentar', 'error')
    }
  }
  //--------------------------------------------------------------------------------
  // Buscador
  //************************************************************************************************************************************************************************** */
  // Función de búsqueda
  const onFindBusqueda = (e) => {
    setBPlanta(e.target.value)
    setFText(e.target.value)
  }
  const fBusqueda = () => {
    if (vBPlanta.length != 0) {
      const valFiltrados = dtPVivoAux.filter(
        (dtPVivoAux) => dtPVivoAux.Planta.includes(vBPlanta), // Filtra los clientes por el número de cliente
      )
      setDTPVicoAux(valFiltrados)
    } else {
      btnBuscar()
    }
  }
  const fPVivo = dtPVivoAux.filter((item) => {
    // Filtrar por planta, interfaz y texto de búsqueda
    return item.IdPedido.toString().includes(fText)
  })
  const fRecovery = dtRecovery.filter((item) => {
    // Filtrar por planta, interfaz y texto de búsqueda
    return item.Id.toString().includes(fText)
  })
  //************************* HANDLE*************************************************************** */
  // Descargar CSV
  const downloadCSV = () => {
    // 1️⃣ Generar dataset con obras “planas” para el CSV
    const dataForCSV = fPVivo.flatMap(pedido => {
      if (pedido.Obras && pedido.Obras.length > 0) {
        // Crear una fila por cada obra
        return pedido.Obras.map(obra => ({
          IdPedido: pedido.IdPedido,
          Cliente: pedido.Cliente,
          TotalCantidad: pedido.TotalCantidad,
          Obra: obra.Obra,
          Cantidad: obra.Cantidad,
          Planta: obra.Planta,
        }));
      } else {
        // Si no hay obras, solo la fila del pedido
        return [{
          IdPedido: pedido.IdPedido,
          Cliente: pedido.Cliente,
          TotalCantidad: pedido.TotalCantidad,
          Obra: '',
          Cantidad: '',
          Planta: '',
        }];
      }
    });

    // 2️⃣ Convertir a CSV
    let csv = convertArrayOfObjectsToCSV(dataForCSV);
    if (!csv) return;

    // 3️⃣ Crear link de descarga
    const link = document.createElement('a');
    const filename = 'PedLinea_' + plantasSel + '.csv';
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  };
  //********************************************************************************************** */
  return (
    <>
      <CContainer fluid>
        {userIsAdmin &&(
          <>
          <CRow>
            <CCol xs={12} md={3}>
              <CFormSelect aria-label="Selecciona" id="cmbPlantaDB" value={plantasSelDB} onChange={mCambioDB}>
                <option value="" >Selecciona...</option>
                {plantasDB.map((planta, index) =>(
                    <option value={planta.IdPlanta} key={index}>{planta.Planta}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={12} md={3}>
              {shBtnRec &&(
                <CButton
                  style={{ color: 'white' }}
                  color="warning"
                  onClick={() => fRespaldar()}
                  size="sm"
                  className="me-2"
                  title="Respaldar"
                >
                  <CIcon icon={cilCopy} /> Respaldar DB
                </CButton>
              )}
            </CCol>
          </CRow>
          {shDivRec &&(
            <CRow>
            <>
              <CRow className="mt-4 mb-4" id="divTb">
                <DataTable
                  columns={colDBR}
                  data={fRecovery}
                  pagination
                  persistTableHead
                  subHeader
                />
              </CRow>
            </>
            </CRow>
          )}  
          </>
        )}
        {!userIsAdmin &&(
        <CRow>
          <CCol xs={12} md={2}>
            <h1>En vivo</h1>
          </CCol>
         
          {shCarga && !userIsAdmin &&(
            <CCol xs={10} className="d-flex justify-content-center align-items-center">
              <CSpinner color="light" />
            </CCol>
          )}
          {dtPlantas.filter(planta => planta.planta !== 'BMD1').map((planta,i) => {
            const online = planta.estado === 'Success'; 
            return(
              <CCol key={i} xs={6} md={2}>
                {planta.planta}
                <CBadge color={online ? 'success' : 'secondary'} className={online ? 'badge-pulse' : ''}>
                  {online ? 'En línea' : 'Fuera de línea'}
                </CBadge>
              </CCol>
            );
          })}
        </CRow>
        )}
        {!userIsAdmin &&(
        <CRow className="mt-3 mb-3">
          <CCol xs={12} md={3}>
            <Plantas mCambio={mCambio} plantasSel={plantasSel} />
          </CCol>
          <CCol xs={12} md={2}>
            <FechaI vFechaI={vFechaI} cFechaI={cFechaI} className="form-control" />
          </CCol>
          <CCol xs={12} md={3} className="mt-4">
            <CButton color="info" style={{ color: 'white' }} onClick={btnBuscar}>
              <CIcon icon={cilSearch} /> Buscar
            </CButton>
            <CButton color="warning" style={{ color: 'white' }} onClick={downloadCSV}>
              <CIcon icon={cilCloudDownload} className="me-2" />
              Exportar
            </CButton>
          </CCol>
          <CCol xs={12} md={3}>
            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
          </CCol>
        </CRow>
        )}
        {shDiv && !userIsAdmin && (
          <>
            <CRow className="mt-4 mb-4" id="divTb">
              <DataTable
                columns={colPVivo}
                data={fPVivo}
                pagination
                persistTableHead
                subHeader
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                conditionalRowStyles={conditionalRowStyles}
              />
            </CRow>
          </>
        )}
      </CContainer>
    </>
  )
}

export default nVivo
