import * as XLSX from "xlsx";
import React, {useEffect, useState, useRef} from 'react'
import '../../estilos.css';
import Swal from "sweetalert2";
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { sNomina, fNumber, downloadCV, cargando, getNominas, convertArrayOfObjectsToCSV
} from '../../Utilidades/Funciones';
import FechaI from '../base/parametros/FechaInicio'
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CFormSelect,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilAt,
  cilCheck,
  cilCloudDownload,
  cilDataTransferDown,
  cilPen,
  cilPlus,
  cilPrint,
  cilQrCode,
  cilSave,
  cilSearch,
  cilTrash,
} from '@coreui/icons'
import BuscadorDT from '../base/parametros/BuscadorDT'
import AccionesTabla from "../widgets/ImportarExc";
import { Rol } from '../../Utilidades/Roles'
import { format } from 'date-fns';
import { useReactToPrint } from "react-to-print";

const Nominas = () => {    
    const printRef = useRef(null);
    const navigate = useNavigate();
    //--------------- MODALS ---------------------------------
    const [mdlNuevo, setMNuevo] = useState(false);
    const [vFechaI, setFechaIni] = useState(null);
    //------------------Shows---------------------------------
    const [shDiv, setShDiv] = useState(false);
    const [file, setFile] = useState(null);
    //--DT 
    const [data, setData] = useState([]);
    const [dtCarga, setDTCarga] = useState([]);
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    const [previewData, setPreviewData] = useState({
      nomina: []
    });
    const [exOC, setExOc] = useState([]);
    const opcionesFca = {
        year: 'numeric', // '2-digit' para el año en dos dígitos
        month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
        day: '2-digit'   // 'numeric', '2-digit'
    };
    //-----------------------------------------------------------------------------------
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    // ROLES
    const userIsAdmin = Rol('Admin');
    useEffect(()=>{    
      const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: landscape;
          margin: 10mm;
        }

        table {
          font-size: 11px;
          width: 100%;
        }

        th, td {
          padding: 4px;
        }

        .print-page {
          page-break-after: always;
        }

        .print-page:last-child {
          page-break-after: auto;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
    },[]);
    //---------------------------- BOTONS --------------------------------------------
    const handlePrint = useReactToPrint({
        contentRef:printRef,
    });
    //=================================================================================
    
    //--------------------------- COLS -----------------------------------------------
    const colEq = [
      {
        name: 'Colaborador',
        selector: (row) => {
          const aux = row.Colaborador
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '400px',
      },
      {
        name: 'CUENTA',
        sortable: true,
        selector: (row) => {
          const aux = row.Cuenta
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        width: '250px',
      },
      {
        name: 'BANCO',
        selector: (row) => {
          const aux = row.Banco
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
        name: 'MONTO',
        selector: (row) => {
          const aux = row.Total
          if (aux === null || aux === undefined) {
            return 0
          }
          if (typeof aux === 'object') {
            return 0 // O cualquier mensaje que prefieras
          }
          return fNumber(aux)
        },
        sortable: true,
        width: '200px',
      },
      {
        name: 'ESTATUS',
        selector: (row) => {
          const aux = row.Estatus
          if (aux === null || aux === undefined) {
            return 0
          }
          if (typeof aux === 'object') {
            return 0 // O cualquier mensaje que prefieras
          }
          return fNumber(aux)
        },
        sortable: true,
        width: '200px',
      },
    ];
    const rowStyles = [
        {
        when: row => row.__EMPTY_2 !== 'Bancomer',
            style: {
                backgroundColor: '#F2BB16', // Color de fondo rojo claro
                color: '#262223', // Color de texto rojo oscuro
            },
        },
    ];
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda SP
    //--------------------------------------------------------------------------------
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const dataFiltrado = json.slice(2);
        setData(dataFiltrado);
        console.log('🐦‍🔥', dataFiltrado)
        setDTCarga(dataFiltrado);
        setShDiv(true)
        };

        reader.readAsBinaryString(file);
    };
    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const hSavedDB = (e, tipo) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result)

            //const workbook = XLSX.read(data, { type: "array" })
            const workbook = XLSX.read(data, { 
                type: "array",
                cellDates: true // 👈 intenta leer fechas correctamente
            })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]

            //const jsonData = XLSX.utils.sheet_to_json(sheet)
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                raw: true
            })

            const transformedData = jsonData.map(item => transformRow(item, tipo))
            
            setPreviewData(prev => ({
                ...prev,
                [tipo]: transformedData
            }))
        }
        reader.readAsArrayBuffer(file)
        e.target.value = null
    }
    const cleanDate = (value) => {
        if (!value) return null

        // si viene como número (excel)
        if (typeof value === "number") {
            return excelDateToJSDate(value)
        }

        // si ya viene como Date
        if (value instanceof Date) {
            return value.toISOString().split('T')[0]
        }

        // si ya es string (ej: "2024-01-01")
        return value
    }

    const excelDateToJSDate = (serial) => {
        const utc_days = Math.floor(serial - 25569)
        const utc_value = utc_days * 86400
        const date_info = new Date(utc_value * 1000)

        return date_info.toISOString().split('T')[0]
    }

    const transformRow = (item, tipo) => {
        const newItem = { ...item }

        // 🔥 fechas
        const dateFields = ["Fecha"]
        dateFields.forEach(field => {
            if (newItem[field]) {
                newItem[field] = cleanDate(newItem[field])
            }
        })

        // 🔥 enteros
        const intFields = ["Estatus", "NSemana","DSemana"]
        intFields.forEach(field => {
            if (newItem[field] !== undefined) {
                newItem[field] = parseInt(newItem[field]) || 0
            }
        })

        // 🔥 decimales
        const decimalFields = ["Total"]
        decimalFields.forEach(field => {
            if (newItem[field] !== undefined) {
                newItem[field] = parseFloat(newItem[field]) || 0
            }
        })

        return newItem
    }
    const downloadPlantilla = () => {
        const link = document.createElement("a")
        link.href = "/plantillas/plantilla_materiales.xlsx"
        link.download = "plantilla_materiales.xlsx"
        link.click()
    }
    const downloadCSV = (e) => {
          const link = document.createElement('a');
          let csv = convertArrayOfObjectsToCSV(exOC);
          if (csv == null) return;
      
          const filename = 'NOM_'+vFechaI+'.csv';
      
          if (!csv.match(/^data:text\/csv/i)) {
              csv = `data:text/csv;charset=utf-8,${csv}`;
          }
      
          link.setAttribute('href', encodeURI(csv));
          link.setAttribute('download', filename);
          link.click();
        };
    const sDatos = async(tipo) => {
        const datos = previewData[tipo];
        console.log(datos)
        cargando();
        if (!datos || datos.length === 0) {
            Swal.close();  // Cerramos el loading
            Swal.fire("ERROR", "No Hay Datos para Guardar", "error");
            return
        }
        try{
          const nominaSend = previewData.nomina
          .filter(item => item.Colaborador) // o cualquier campo clave
          .map(item => ({
            Id: 0,
            Colaborador: item.Colaborador?.trim() || "",
            Planta: item.Planta?.trim() || "",
            Cuenta: item.Cuenta?.trim() || "",
            Banco: item.Banco?.trim() || "",
            Total: parseFloat(item.Total?.toString().replace(/,/g, "")) || 0,
            Estatus: "I"
          }));
            const ocList = await sNomina(tipo, nominaSend);
            console.log(ocList)
            setShDiv(true);
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    // Buscador
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const fEq = dtCarga.filter((item) => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.Colaborador.toString().includes(fText)
    })
    const paginas = chunkArray(fEq, 13);
    //************************* HANDLE*************************************************************** */
    const bNominas = async () =>{
      const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
      try {
          const data = await getNominas(auxFcaI);
          if (data) {
            const prioridadBancos = {
              "Bancomer": 1,
              "Banamex": 2,
              "Santander": 3
            };
            const ordenado = data.sort((a, b) => a.Total - b.Total);
            const ordenadoBank = [...ordenado].sort((a, b) => {
              return (prioridadBancos[a.Banco] || 99) - (prioridadBancos[b.Banco] || 99);
            });
            setShDiv(true);
            setDTCarga(ordenadoBank);
            const nuevoArray = ordenadoBank.map(item => ({
              Colaborador: item.Colaborador,
              Banco: item.Banco,
              Cuenta:item.Cuenta,
              Total: item.Total
            }));

            setExOc(nuevoArray);
          } else {
              Swal.fire("No se encontraron datos", "El número de cotización no es válido", "error");
          }
      } catch (error) {
          console.error(error);
          Swal.fire("Error", "Hubo un problema al obtener los datos", "error");
      } 
    }
    //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>Nómina</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={12} md={3}>
            <FechaI 
                vFechaI={vFechaI} 
                cFechaI={cFechaI} 
            />
            <CButton color='primary' onClick={()=>bNominas()} > 
                <CIcon icon={cilSearch} />
            </CButton>
        </CCol>
        <CCol xs={12} md={4} className="mt-4" >
            <AccionesTabla onImport={(e)=>hSavedDB(e, "nomina")} onExport={downloadCV} onPlantilla={downloadPlantilla} />
        </CCol>
        <CCol xs={3} md={3} className='mt-4'>
          {previewData.nomina.length > 0 && (
            <CButton color='primary' className='mr-4 ml-4' onClick={()=>sDatos("nomina")} > 
                <CIcon icon={cilSave} />
                {' '}Guardar
            </CButton>
            )}
            <CButton color='warning' style={{color:"white",marginRight:"10px"}} onClick={handlePrint} > 
                <CIcon icon={cilPrint} />
                {' '}Imprimir
            </CButton>
            <CButton color='primary' style={{color:"white",marginRight:"10px"}} onClick={downloadCSV} > 
                <CIcon icon={cilCloudDownload} />
                {' '}Descargar
            </CButton>
        </CCol>        
      </CRow>
          <>
          <CRow className="mt-4 mb-4" id="divTb">
            <CCol xs={12} md={12} lg={12}>
              {previewData.nomina.length > 0 && (
                <DataTable
                  columns={[
                    { name: "Colaborador", selector: row => row.Colaborador },
                    { name: "Planta", selector: row => row.Planta },
                    { name: "Cuenta", selector: row => row.Cuenta },
                    { name: "Banco", selector: row => row.Banco },
                    { name: "Total", selector: row => row.Total }
                  ]}
                  data={previewData.nomina}
                  pagination
                />
              )}
              {shDiv && (
                <div ref={printRef}>
                {paginas.map((pagina, index) => (
                    <div
                    key={index}
                    className="print-page"
                    >
                    <DataTable
                        columns={colEq}
                        data={pagina}
                        pagination={false}
                        persistTableHead
                    />
                    </div>
                ))}
              </div>
              )}
            </CCol>
          </CRow>
          </>
      {/* Modal Nuevo */}
      <CModal
        backdrop="static"
        size="lg"
        visible={mdlNuevo}
        onClose={() => setMNuevo(false)}
      >
        <CModalHeader>
          <CModalTitle>Nuevo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className='mt-2 mb-2'>
            
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary">
            Agregar
          </CButton>
          <CButton color="secondary" onClick={() => setMNuevo(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
    </>
  )
}

export default Nominas
