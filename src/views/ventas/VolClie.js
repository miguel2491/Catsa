import React, {useEffect, useState} from 'react'
import '../../estilos.css';
import Swal from "sweetalert2";
import { CChart } from '@coreui/react-chartjs'
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { getVolCliente, getClientes, convertArrayOfObjectsToCSV, fNumber
} from '../../Utilidades/Funciones';
import {
    CButton,
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import FechaF from '../base/parametros/FechaFinal'

import {
    cilChartPie,
  cilCheck,
  cilCloudDownload,
  cilPen,
  cilPlus,
  cilQrCode,
  cilSearch,
  cilTablet,
  cilTrash,
} from '@coreui/icons'
import BuscadorDT from '../base/parametros/BuscadorDT'
import { Rol } from '../../Utilidades/Roles'
import { format } from 'date-fns';
import { Autocomplete, TextField } from "@mui/material";

const VolClie = () => {    
    const [plantasSel , setPlantas] = useState('');
    const [clienteSel , setClienteSel] = useState('');
    const [clientes , setClientes] = useState('');
    const [vFechaI, setFechaIni] = useState(null);
    const [vFcaF, setFechaFin] = useState(null);
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    const [loading, setLoading] = useState(false);
    const [exOC, setExOc] = useState([]);
    const [chartDataD, setChartDataD] = useState({
        labels: [],
        datasets: [
        {
            data: [],
            backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#005C53','#9FC131','#D6D58E'],
        },
        ],
    });
    //****************************************************** */
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const mCliente = (event) => {
        setCliente(event.target.value);
    };
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const handleSearch = async (input) => {
        setClientes('')
        if (!input || input.length < 2) return;
        setLoading(true);
        try {
            const clie = await getClientes(plantasSel,input.toUpperCase());
            if(clie)
            {
              setClientes(clie);
            }
        } catch (error) {
            console.log(error)
        }    
    };
    //--------------- TABLES --------------------------------
    const [idReg, setIdReg] = useState(0);
    //--------------- MODALS ---------------------------------
    const [tipoGra, setTGra] = useState(''); 
    //------------------Shows---------------------------------
    const [shDiv, setShDiv] = useState(false);
    const [shCh, setShCh] = useState(false);
    const [shBtn, setShBtn] = useState(false);
    //--DT Pedidos
    const [dtVolClie, setDTVolClie] = useState([]);
    //EXTRAS
    const [dtVolClieAux, setDTVolClieAux] = useState([]);
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    // ROLES
    const userIsAdmin = Rol('Admin');
    useEffect(()=>{    
      if (Array.isArray(dtVolClie)) {
        const arrVC = dtVolClie.map((r) => {
            return {
                Planta:r.planta,
                Remision:r.Remision,
                Fecha:r.Fecha,
                Cantidad:r.Cantidad,
                Producto:r.Producto,
                Pedido:r.NoPedido,
                Asesor:r.UsuarioCreo,
                Bomba:r.Bomba
            }
        });
        setExOc(arrVC)
      }
    },[]);
    //---------------------------- BOTONS --------------------------------------------
    const btnBuscar = async() =>{
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFcaF, 'yyyy/MM/dd');
        Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
            Swal.showLoading(); 
          }
        });
        try {
            const vc = await getVolCliente(plantasSel, auxFcaI, auxFcaF, clienteSel);
            Swal.close();
            if(vc)
            {
                setShBtn(true)
                setShDiv(true)
                setShCh(false)
                setDTVolClie(vc);
                if (Array.isArray(vc)) {
                    const arrVC = vc.map((r) => {
                        return {
                            Planta:r.Planta,
                            Remision:r.Remision,
                            Fecha:r.Fecha,
                            Cantidad:r.Cantidad,
                            Producto:r.Producto,
                            Pedido:r.NoPedido,
                            Asesor:r.UsuarioCreo,
                            Bomba:r.Bomba
                        }
                    });
                    setExOc(arrVC)
                }
                
            }
        } catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }    
    }
    const shChart = (tipo) => {
        setShDiv(false)
        setShCh(true)
        if(tipo == 'A'){
            setTGra('Asesor')
            let totalP = 0;
            // Agrupar por UsuarioCreo
            const agrupado = dtVolClie.reduce((acc, item) => {
            if (item.Producto?.length > 0) {
                if (!acc[item.UsuarioCreo]) {
                acc[item.UsuarioCreo] = 0;
                }
                acc[item.UsuarioCreo] += item.Cantidad;
            }
            return acc;
            }, {});

            // Convertir a arrays para Chart.js
            const labels = Object.keys(agrupado);
            const dataSet = Object.values(agrupado);

            // Calcular el total general
            totalP = dataSet.reduce((a, b) => a + b, 0);

            // Actualizar el gráfico
            setChartDataD({
                labels: labels,
                datasets: [
                    {
                    label: 'Cantidad Total: ' + totalP,
                    data: dataSet,
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                    },
                ],
            });
        }else{
            setTGra('Producto')
            let totalP = 0;
            // Agrupar por Producto
            const agrupado = dtVolClie.reduce((acc, item) => {
            if (item.Producto?.length > 0) {
                if (!acc[item.Producto]) {
                acc[item.Producto] = 0;
                }
                acc[item.Producto] += item.Cantidad;
            }
            return acc;
            }, {});

            // Convertir a arrays para Chart.js
            const labels = Object.keys(agrupado);
            const dataSet = Object.values(agrupado);

            // Calcular el total general
            totalP = dataSet.reduce((a, b) => a + b, 0);

            // Actualizar el gráfico
            setChartDataD({
                labels: labels,
                datasets: [
                    {
                    label: 'Cantidad Total: ' + totalP,
                    data: dataSet,
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                    },
                ],
            });
        }
    }
    //--------------------------- COLS -----------------------------------------------
    const colVC = [
      {
        name: 'PLANTA',
        selector: (row) => {
          const aux = row.Planta
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '120px',
      },
      {
        name: 'No. REMISIÓN',
        selector: (row) => {
          const aux = row.Remision
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'FECHA',
        selector: row => {
            const fecha = row.Fecha;
            if (fecha === null || fecha === undefined) {
                return "No disponible";
                }
                if (typeof fecha === 'object') {
                return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
            return fecha_;
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'CANTIDAD',
        cell: row => {
            let aux = row.Cantidad;
            if (aux === null || aux === undefined) {
                aux = 0;
            }
            if (typeof aux === 'object') {
                aux = 0; // O cualquier mensaje que prefieras
            }
            return (<div className='align-left'>{fNumber(aux.toFixed(2))}</div>);
        },
        sortable: true,
        width: '120px',
      },
      {
        name: 'PRODUCTO',
        selector: (row) => {
          const aux = row.Producto
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '180px',
      },
      {
        name: 'PEDIDO',
        selector: (row) => {
          const aux = row.NoPedido
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '120px',
      },
      {
        name: 'ASESOR',
        selector: (row) => {
          const aux = row.UsuarioCreo
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '150px',
      },
      {
        name: 'BOMBA',
        selector: (row) => {
          const aux = row.Bomba
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '150px',
      },
    ];
    //--------------------------- FUNCTION ACCIONES -----------------------------------------------
    // Función de búsqueda SP
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
        const valFiltrados = dtVolClie.filter(
          (dtVolClie) => dtVolClie.Planta.includes(vBPlanta), // Filtra los clientes por el número de cliente
        )
        setDTVolClieAux(valFiltrados)
      } else {
        btnBuscar()
      }
    }
    const fVC = dtVolClie.filter((item) => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.Planta.toString().includes(fText)
    }) 
    //************************* HANDLE*************************************************************** */
    const h_articulo = (e) =>{
        setArticulo(e.target.value)
    };
    //******************************************************** */
    // Descargar CSV
    const downloadCSV = (e) => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFcaF, 'yyyy/MM/dd');
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exOC);
        if (csv == null) return;
    
        const filename = 'VC_'+auxFcaI+'_'+auxFcaF+'.csv';
    
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
      <h1>VOLÚMEN CLIENTE</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={2} md={2}>
            <Plantas  
                mCambio={mCambio}
                plantasSel={plantasSel}
            />
        </CCol>
        <CCol xs={4} md={4}>
            <label>Cliente</label>
            <div className='mt-2 dvAutoc'>
                <Autocomplete
                    freeSolo
                    options={Array.isArray(clientes) ? clientes : []}
                    getOptionLabel={(option) => option.Description || option.label || ""}
                    isOptionEqualToValue={(option, value) => option.Customer_Code === value?.Customer_Code}
                    onInputChange={(e, value) => handleSearch(value)}
                    onChange={(event, value) => {
                        setClienteSel(value); // 👈 aquí guardas el cliente elegido
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={option.Customer_Code}>
                        {option.Description}
                        </li>
                    )}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Buscar cliente"
                        variant="outlined"
                        sx={{
                        "& .MuiOutlinedInput-root": {
                        height: "38px", // altura típica de un CFormSelect
                        fontSize: "0.875rem",
                        borderRadius: "0.375rem", // similar al select de CoreUI
                        },
                        "& .MuiInputLabel-root": {
                        top: "-4px",
                        fontSize: "0.875rem",
                        },
                    }}
                    />
                )}
            />
            </div>
        </CCol>
        <CCol xs={2} md={2}>
            <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
            />
        </CCol>
        <CCol xs={2} md={2}>
            <FechaF 
              vFcaF={vFcaF} 
              mFcaF={mFcaF}
            />
        </CCol>
        <CCol xs={2} md={2} className='mt-4'>
            <CButton color='info' style={{color:"white",marginRight:"10px"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
        </CCol>       
      </CRow>
      <CRow>
        <CCol xs={3} md={3}>
            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
        </CCol>
        <CCol xs={5} md={5} className='mt-4'>
            {shBtn && (
            <>
            <CButton color='info' style={{color:"white",marginRight:"10px"}} onClick={btnBuscar} > 
                <CIcon icon={cilTablet} />
                {' '}Todo
            </CButton>
            <CButton color='info' style={{color:"white",marginRight:"10px"}} onClick={() => shChart('A')} > 
                <CIcon icon={cilChartPie} />
                {' '}Asesor
            </CButton>
            <CButton color='secondary' style={{color:"white",marginRight:"10px"}} onClick={() => shChart('P')} > 
                <CIcon icon={cilChartPie} />
                {' '}Producto
            </CButton>
            <CButton color='warning' style={{color:"white",marginRight:"10px"}} onClick={downloadCSV} > 
                <CIcon icon={cilCloudDownload} />
                {' '}Descargar
            </CButton>
            </>
            )}
        </CCol>
      </CRow>
      {shDiv && (
          <>
          <CRow className="mt-4 mb-4" id="divTb">
              <DataTable
                columns={colVC}
                data={fVC}
                pagination
                persistTableHead
                subHeader
              />
            </CRow>
          </>
      )}
      {shCh && (
        <CRow>
            <h2>{tipoGra}</h2> 
            <CCard className="mb-4">
                <CCardHeader>Productos Venta</CCardHeader>
                <CCardBody>
                    <CChart
                        type='bar'
                        data={chartDataD}
                    />
                </CCardBody>
            </CCard>   
        </CRow>
      )}
    </CContainer>
    </>
  )
}

export default VolClie
