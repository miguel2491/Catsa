import React,{useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import '../../../estilos.css';
import DataTable from 'react-data-table-component';
import {
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CTab, 
  CTabContent, 
  CTabList, 
  CTabPanel, 
  CTabs,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CFormSwitch,
  CBadge,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSearch } from '@coreui/icons'
import { convertArrayOfObjectsToCSV, fNumber, getPreCotizaciones, getPreCotizacion, setUpdPreCot } from '../../../Utilidades/Funciones';
import Plantas from '../../base/parametros/Plantas'
import FechaI from '../../base/parametros/FechaInicio'
import FechaF from '../../base/parametros/FechaFinal'
import { format } from 'date-fns';

const LPreCotizacion = () => {
  const [vMPC, setMPC] = useState(false);
  const [TxtIdCot , setTxtIdCot] = useState('');
  const [TxtPlanta , setTxtPlanta] = useState('');
  const [plantasSel , setPlantas] = useState('');
  const [TxtNoCliente , setNoCliente] = useState('');
  const [TxtCliente , setCliente] = useState('');
  const [TxtNoObra , setNoObra] = useState('');
  const [TxtObra , setObra] = useState('');
  const [TxtAsesor , setAsesor] = useState('');
  const [TxtObs , setObs] = useState('');
  const [TxtEstatus , setEstatus] = useState('');
  const [TxtMotivo , setMotivo] = useState('');
  const [TxtIdPC , setIdPC] = useState(0);
  const [vFechaI, setFechaIni] = useState(() => {
        const fechaActual = new Date();
        fechaActual.setDate(1); // Establecer al primer día del mes
        return fechaActual;
      });     
  const [vFcaF, setFechaFin] = useState(new Date());
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  const [dPreCot, setDPreCot] = useState([]);
  const [dtPreCot, setDTPreCot] = useState([]);
  const [dPCot, setDCot] = useState([]);
  const [dtCot, setDTCot] = useState([]);
  const [opAsesor, setOpAsesor] = useState([]);
  const [dtUpdate, setDTUpd] = useState([]);
  const [dtGen, setDTGen] = useState([]);
  const [dtPreCotTable, setDTPreCotTable] = useState([]);
  const [dtPreCGen, setDTPreCGen] = useState([]);
  //==============================================================================================
  useEffect(()=>{    
    const fBPC = dPreCot.filter(item => item.IdPlanta == plantasSel);   
    setDTPreCot(fBPC)
  },[dPreCot]);

  useEffect(()=>{    
    if(dtUpdate.length > 0)
    {
      const updateData = async() =>{
        try{
          const TabUpd = dtGen.find(table => table.TableName === "Table1");
          let NDatos = [];
          //console.log(TxtEstatus)
          dtUpdate.forEach(rowp => {
            let idc = rowp.IdCot;
            let cantidad = parseFloat(rowp.CantidadM3)
            const datosFil = TabUpd.Rows.filter(row => row.IdCotizacion == idc).map(row =>({
              IdCotizacion:row.IdCotizacion,
              Producto: row.Producto,
              Precio: row.Precio,
              Cantidad: cantidad,
              FlagVoBo: rowp.VoBo,
              M3Bomba:rowp.M3Bomba,
              Comentario: rowp.Comentario ?? null
            }));
            NDatos.push(...datosFil)  
          });
          if(TabUpd)
          {
            TabUpd.Rows = NDatos;
          }
          // ===================================================== CREAR ARRAY =============================================
            // Buscar cada tabla por nombre
            //*********************************************************************************************************** */
            const precotizacionT = dtGen.find(table => table.TableName === "Table");
            const detalleT = dtGen.find(table => table.TableName === "Table1");
            const extrasT = dtGen.find(table => table.TableName === "Table2");
            const precotizacionR = precotizacionT?.Rows?.[0] ?? {};
            const detalleTable = detalleT?.Rows?.[0] ?? {};
            const extrasTable = extrasT?.Rows?.[0] ?? {};
            const payload = {  
                "precotizacion":{
                  IdCotizacion:typeof precotizacionR.IdCotizacion === 'number' 
                  ? precotizacionR.IdCotizacion 
                  : 0,
                    Planta:precotizacionR.Planta,
                    NoCliente:typeof precotizacionR.NoCliente === 'string' ? precotizacionR.NoCliente : '',
                    NoObra: typeof precotizacionR.NoObra === 'string' ? precotizacionR.NoObra : '',
                    Cliente:typeof precotizacionR.Cliente === 'string' ? precotizacionR.Cliente : '',
                    Municipio:precotizacionR.Municipio,
                    Contacto:precotizacionR.Contacto,
                    Obra:precotizacionR.Obra,
                    Direccion:precotizacionR.Direccion,
                    IdVendedor: typeof precotizacionR.IdVendedor === 'string' 
                      ? precotizacionR.IdVendedor 
                      : '',
                    UsuarioCreo:precotizacionR.UsuarioCreo,
                    FlagIVA:precotizacionR.FlagIVA,
                    FlagTotal:precotizacionR.FlagTotal,
                    FlagCondicion:precotizacionR.FlagCondiciones,
                    Estatus:TxtEstatus,
                    IdMotivo:typeof precotizacionR.IdMotivo === 'number' 
                      ? precotizacionR.IdMotivo 
                      : 0,
                    Observaciones:typeof precotizacionR.Observaciones === 'string' 
                    ? precotizacionR.Observaciones 
                    : '',
                    FlagObservaciones:precotizacionR.FlagObservaciones,
                    Segmento:typeof precotizacionR.Segmento === 'number' 
                      ? precotizacionR.Segmento 
                    : 0,
                    Canal:typeof precotizacionR.Canal === 'number' 
                      ? precotizacionR.Canal 
                      : 0,
                  },
                "detalle":{
                  Cantidad: detalleTable.Cantidad,
                  Producto: detalleTable.Producto,
                  MOP: dtPreCGen.MOP,
                  M3Bomba: typeof detalleTable.M3Bomba === 'number'
                    ? detalleTable.M3Bomba
                    : parseFloat(detalleTable.M3Bomba) || null,
                  Bomba: typeof dtPreCotTable[0].Bomba === 'number' 
                    ? dtPreCotTable[0].Bomba 
                    : 0.0,
                  Precio: detalleTable.Precio,
                  MB: dtPreCotTable[0].MB,
                  FlagVoBo: detalleTable.FlagVoBo,
                  UsuarioAutoriza: dtPreCGen.UsuarioAutoriza ?? null,
                  Autoriza:typeof dtPreCotTable[0].Autoriza === 'number' 
                    ? dtPreCotTable[0].Autoriza 
                    : null,
                  Comentario:
                  typeof detalleTable.Comentario === "string"
                    ? detalleTable.Comentario
                    : "",                  
                  FlagImprimir: dtPreCotTable[0].FlagImprimir
                },
                "extras":{
                  Producto: extrasTable.Producto ?? "",
                  IdExtra: extrasTable.IdExtra ?? null,
                  Cantidad: extrasTable.Cantidad ?? null,
                  CantidadCot: extrasTable.CantidadCot ?? null,
                  PrecioUser: extrasTable.PrecioUser ?? null
                },
            };
          // ===============================================================================================================
          const json = JSON.stringify(payload, null, 2)
          const res = await setUpdPreCot(payload)
          const respuesta = res;
          console.log(respuesta.noCotizacion)
          Swal.close();
          if(respuesta){
            Swal.fire("Éxito", "Se realizó correctamente #"+respuesta.noCotizacion, "success");
            
          }
        }catch(error){
          Swal.fire("Error", "Hubo un problema, reintenta mas tarde", "error");
        }
      };
      updateData();
    }
  },[dtUpdate]);
  //=============================================================================================
  const mCambio = (event) => {
    setPlantas(event.target.value);
    const selectedIndex = event.target.selectedIndex;
    const selectedText = event.target.options[selectedIndex].text;
    setTxtPlanta(selectedText)
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mFcaF = (fcaF) => {
    setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
  };
  //=============================================================================================
  const GetPreCotizaciones = async()=>
  {
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
          Swal.showLoading(); 
      }
    });
    const auxFcaI = format(vFechaI, 'yyyy-MM-dd');
    const auxFcaF = format(vFcaF, 'yyyy-MM-dd');
    try{
      const ocList = await getPreCotizaciones(auxFcaI, auxFcaF, plantasSel);
      if(ocList)
      {
        setDPreCot(ocList);
      }else{
        setDPreCot([])
      }
      Swal.close();
    }catch(error){
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const GetCotizacion = async(id)=>
    {
      Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading(); 
        }
      });
      try{
        const auxPreCot = dPreCot.find(table => table.IdCotizacion === id);
        console.log(auxPreCot)
        const ocList = await getPreCotizacion(id);
        console.log("PRECOT",ocList)
        if(ocList)
        {
          setDTGen(ocList)
          const datosCli = ocList[0].Rows;
          const datosPre = ocList[1].Rows;
          const datosAse = ocList[5].Rows;
          const datosPCot = auxPreCot;
          let ncliente = datosCli[0].NoCliente;
          let nobra = datosCli[0].NoObra;
          const isValidObject = (obj) => {
            return obj !== null && obj !== undefined && typeof obj === 'object' && Object.keys(obj).length > 0;
          };
          if (!isValidObject(ncliente)) {
            setNoCliente("-")
          }else{
            setNoCliente(ncliente)
          }
          if (!isValidObject(nobra)) {
            setNoObra("-")
          }else{
            setNoObra(nobra)
          }          
          setCliente(datosCli[0].Cliente)
          setObra(datosCli[0].Obra)
          setEstatus(datosCli[0].Estatus)
          setDTCot(datosPre)
          setOpAsesor(datosAse)
          setDTPreCGen(datosPCot)
          setDTPreCotTable(datosPre)
        }
        Swal.close();
      }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
  }
  //=============================================================================================
  const colPreCot = [
      {
        name: 'Planta',
        selector: row => {
            const aux = row.Planta;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"120px",
        sortable:true,
        grow:1,
      },
      {
        name: '# Pre Cotización',
        cell: row => {
            const aux = row.IdCotizacion;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return (
              <CBadge color='primary'
                onClick={(e) => {
                  e.preventDefault();
                  getIPC(aux)
                }}
                style={{ color: 'white', cursor: 'pointer', fontSize:'16px' }}
              >
                {aux}
              </CBadge>);
        },
        width:"140px",
        sortable:true,
        grow:1,
      },
      {
        name: 'Estatus',
        selector: row => {
            const aux = row.Estatus;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: 'Vendedor',
        selector: row => {
            const aux = row.Vendedor;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: 'Cliente',
        selector: row => {
            const aux = row.Cliente;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"200px",
        sortable:true,
        grow:1,
      },
      {
        name: 'Obra',
        selector: row => {
            const aux = row.Obra;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"200px",
        sortable:true,
        grow:1,
      },
      {
        name: 'Dirección',
        selector: row => {
            const aux = row.Direccion;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
          name: 'Contacto',
          selector: row => {
              const aux = row.Contacto;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"150px",
          sortable:true,
          grow:1,
      },
      {
          name: 'Creo',
          selector: row => {
              const aux = row.Creo;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"200px",
          sortable:true,
          grow:1,
      },
      {
          name: 'Actualizo',
          selector: row => {
              const aux = row.Actualizo;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"200px",
          sortable:true,
          grow:1,
      },
      {
          name: 'Motivo',
          selector: row => {
              const aux = row.Motivo;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"200px",
          sortable:true,
          grow:1,
      },
      {
        name: 'Observaciones',
        selector: row => {
            const aux = row.Observaciones;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"150px",
        sortable:true,
        grow:1,
      },
  ];
  const colCot = [
    {
      name: 'VoBo',
      cell: row => {
        const aux = row.IdCotizacion;
        const flag = row.FlagVoBo;
        const [checked, setChecked] = useState(row.FlagVoBo); 
        const displayText = aux === null || aux === undefined 
          ? "No disponible"
          : typeof aux === 'object'
            ? "Sin Datos"
            : aux;
        
        let permiso = false;
        const estatus = (TxtEstatus || "").toLowerCase().trim();
        if (estatus === "aceptada" || estatus === "cancelada") {
          permiso = true;
        }
        
        const handleChange = (event) => {
          const isChecked = event.target.checked;
          handleVoBoChange(row.IdCotizacion, isChecked);
          setChecked(isChecked)
          console.log(`Checkbox para ID ${row.IdCotizacion} fue ${isChecked ? 'marcado' : 'desmarcado'}`);
        };
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CFormSwitch  id={`flx-${row.IdCotizacion}`} checked={checked} disabled={permiso} onChange={handleChange} style={{fontSize:'20px'}} />
          </div>
        );
      },
      width:"80px",
      sortable:true,
      grow:1,
    },
    {
      name: 'M3',
      selector: row => {
          const aux = row.Cantidad;
          const displayValue = aux === null || aux === undefined
          ? ""
          : typeof aux === 'object'
            ? ""
            : aux;

        return (
          <CFormInput
            type="text"
            placeholder="0"
            value={displayValue}
            onChange={(e) => hM3(row.IdCotizacion, e.target.value)}
          />
        );
      },
      width:"100px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Producto',
      selector: row => {
          const aux = row.Producto;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
      },
      width:"150px",
      sortable:true,
      grow:1,
    },
    {
      name: '%',
      selector: row => {
          const aux = row.MOP;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
      },
      width:"100px",
      sortable:true,
      grow:1,
    },
    {
      name: 'MB',
      selector: row => {
          const aux = fNumber(row.MB);
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
      },
      width:"100px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Precio Unitario',
      selector: row => {
          const aux = fNumber(row.Precio);
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
      },
      width:"130px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Precio Total',
      selector: row => {
          const aux = fNumber(row.Total);
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
      },
      width:"130px",
      sortable:true,
      grow:1,
    },
    {
      name: 'M3Bomba',
      selector: row => {
          const aux = row.M3Bomba;
          const displayValue = aux === null || aux === undefined
          ? ""
          : typeof aux === 'object'
            ? ""
            : aux;

          return (
            <CFormInput
              type="text"
              placeholder="0"
              value={displayValue}
              onChange={(e) => hM3Bomba(row.IdCotizacion, e.target.value)}
            />
          );
      },
      width:"150px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Precio Bomba',
      selector: row => {
          const aux = row.Bomba;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux);
      },
      width:"150px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Comentario',
      selector: row => {
          const aux = row.Comentario;
          const displayValue = aux === null || aux === undefined
          ? ""
          : typeof aux === 'object'
            ? ""
            : aux;

          return (
            <CFormTextarea
              className='mb-3'
              value={displayValue}
              onChange={(e) => hComentario(row.IdCotizacion, e.target.value)}
            />
          );
      },
      width:"200px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Autoriza',
      selector: row => {
          const aux = row.UsuarioAutoriza;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
      },
      width:"150px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Actualizo',
      selector: row => {
        const aux = row.Actualizo;
        if (aux === null || aux === undefined) {
            return "No disponible";
        }
        if (typeof aux === 'object') {
        return "Sin Datos"; // O cualquier mensaje que prefieras
        }
        return aux;
      },
      width:"250px",
      sortable:true,
      grow:1,
    },
  ];
  //=============================================================================================
  const getIPC = (id)=>{
    setTxtIdCot(id)
    setMPC(true);
    GetCotizacion(id)
  }
  const setPreCotId = async()=>{
    setMPC(false)
  };
  const handleVoBoChange = (idCotizacion, newValue) => {
    setDTCot(prev =>
      prev.map(row =>
        row.IdCotizacion === idCotizacion
          ? { ...row, FlagVoBo: newValue }
          : row
      )
    );
  };
  const hM3 = (idCotizacion, newCantidad) =>{
    setDTCot(prev =>
      prev.map(row =>
        row.IdCotizacion === idCotizacion
          ? { ...row, Cantidad: newCantidad }
          : row
      )
    );
  };
  const hM3Bomba = (idCotizacion, newCantidad) =>{
    setDTCot(prev =>
      prev.map(row =>
        row.IdCotizacion === idCotizacion
          ? { ...row, M3Bomba: newCantidad }
          : row
      )
    );
  };
  const hComentario = (idCotizacion, newComentario) =>{
    setDTCot(prev =>
      prev.map(row =>
        row.IdCotizacion === idCotizacion
          ? { ...row, Comentario: newComentario }
          : row
      )
    );
  };
  //=============================================================================================
  const hAsesor = (e) =>{
    setAsesor(e.target.value)
  }
  const hEstatus = (e) =>{
    setEstatus(e.target.value)
  }
  const hMotivo = (e) =>{
    setAsesor(e.target.value)
  }
  //=============================================================================================
  return (
    <>
    {/*********************************************************************************************************************************************/}
      <CContainer fluid>
        <h1>PreCotizaciones</h1>
        <CRow>
          <CCol sm="auto">
            <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
            />
          </CCol>
          <CCol sm="auto">
            <FechaF 
              vFcaF={vFcaF} 
              mFcaF={mFcaF}
            />
          </CCol>
          <CCol sm="auto">
            <Plantas  
              mCambio={mCambio}
              plantasSel={plantasSel}
            />
          </CCol>
          <CCol sm="auto" className='mt6'>
            <CButton color='primary' onClick={GetPreCotizaciones} style={{'color':'white'}} > 
              <CIcon icon={cilSearch} />
              Buscar
            </CButton>
          </CCol>
          <CCol sm="auto" className='mt6'>
            <CButton color='danger' onClick={GetPreCotizaciones} style={{'color':'white'}} > 
              <CIcon icon={cilCloudDownload} />
               Descargar
            </CButton>
          </CCol>
        </CRow>
        <CRow className='mt-4'>
          <CCol>
            <DataTable
                columns={colPreCot}
                data={dtPreCot}
                pagination
                persistTableHead
                subHeader
            />
          </CCol>
        </CRow>
        {/* MODAL PRECOT IND */}
        <CModal 
          backdrop="static"
          visible={vMPC}
          onClose={() => setMPC(false)}
          className='c-modal-95'
        >
          <CModalHeader>
              <CModalTitle id="oc_">Cotización N°.<b>{TxtIdCot}</b></CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CTabs activeItemKey="PC">
            <CTabList variant="tabs">
                <CTab itemKey="PC">PRE COTIZACIÓN</CTab>
                <CTab itemKey="EX">EXTRAS</CTab>
                <CTab itemKey="LM">LOG DE MODIFICACIONES</CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" itemKey="PC">
                  <CRow className='mt-3'>
                    <CCol xs={6} md={2}>
                      <CFormInput
                        type="text"
                        label="Cliente"
                        placeholder="0"
                        value={TxtNoCliente}
                        disabled
                      />
                    </CCol>
                    <CCol xs={6} md={4}>
                      <CFormInput
                        type="text"
                        placeholder="-"
                        className='mt-4'
                        value={TxtCliente}
                        disabled
                      />
                    </CCol>
                    <CCol xs={6} md={2}>
                      <CFormInput
                        type="text"
                        label="Obra"
                        placeholder="-"
                        value={TxtNoObra}
                        disabled
                      />
                    </CCol>
                    <CCol xs={6} md={4}>
                      <CFormInput
                        type="text"
                        placeholder="-"
                        className='mt-4'
                        value={TxtObra}
                        disabled
                      />
                    </CCol>
                  </CRow>
                  <CRow className='mt-3 mb-3'>
                    <CCol xs={6} md={4}>
                      <label>Asesor</label>
                      <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbMuestra" value={TxtAsesor} onChange={hAsesor}>
                          <option value="-">Seleccion</option>
                          {opAsesor.map(item => (
                              <option key={item.IdUsuario} value={item.IdUsuario}>
                                {item.Nombre}
                              </option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol xs={6} md={4}>
                      <label>Estatus</label>
                      <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbMuestra" value={TxtEstatus} onChange={hEstatus}>
                          <option value="-">Seleccion</option>
                          <option value="Aceptada">Aceptada</option>
                          <option value="Cancelada">Cancelada</option>                                                    
                          <option value="Negociando">Negociando</option>
                          <option value="Perdida">Perdida</option>    
                          <option value="Prospecto">Prospecto</option>
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol xs={6} md={4}>
                      <label>Motivo</label>
                      <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbMuestra" value={TxtMotivo} onChange={hMotivo}>
                          <option value="-">Seleccion</option>
                        </CFormSelect>
                      </div>
                    </CCol>
                  </CRow>
                  <DataTable
                    columns={colCot}
                    data={dtCot}
                    pagination
                    persistTableHead
                    subHeader
                  />
                </CTabPanel>
                <CTabPanel className="p-3" itemKey="EX">
                  
                </CTabPanel>
                <CTabPanel className="p-3" itemKey="LM">
                  
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CModalBody>
          <CModalFooter>
            <CCol xs={4} md={4}></CCol>
            <CCol xs={4} md={2}>
              <CButton color='primary' onClick={()=>{
                let bandera = true;
                let updateRows = [];
                if(TxtEstatus == "Aceptada"){
                  Swal.fire({
                    title: 'Cargando...',
                    text: 'Estamos obteniendo la información...',
                    didOpen: () => {
                        Swal.showLoading();  // Muestra la animación de carga
                    }
                  });
                  dtCot.forEach(row => {
                    if(!row.FlagVoBo){
                      bandera = false;
                      return false;
                    }else{
                      bandera = true
                      updateRows.push({IdCot:row.IdCotizacion,VoBo:row.FlagVoBo,CantidadM3:row.Cantidad,M3Bomba:row.M3Bomba,Comentario:row.Comentario})
                    }
                  });
                  if(bandera){
                    setDTUpd(updateRows)
                  }else{
                    Swal.fire("Error", "Hay filas sin VoBo aprobado", "error");
                  }
                }
                else if(TxtEstatus == 'Cancelada' || TxtEstatus == 'Perdida')
                {
                  console.log(TxtMotivo)
                  Swal.fire("Aviso", bandera, "info");
                }
                
                setMPC(false)
              }} style={{'color':'white'}} > 
                Aceptar  
              </CButton>
            </CCol>
            <CCol xs={4} md={2}>
                <CButton color='danger' onClick={() => setMPC(false)} style={{'color':'white'}} > 
                  Cerrar  
                </CButton>
            </CCol>
          </CModalFooter>
        </CModal>
      </CContainer>
      {/*********************************************************************************************************************************************/}
    </>
  )
}

export default LPreCotizacion
