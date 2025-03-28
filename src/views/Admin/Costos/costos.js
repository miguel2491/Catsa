import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import Periodo from '../../base/parametros/Periodo'
import Mes from '../../base/parametros/Mes'
import { convertArrayOfObjectsToCSV, formatResult, fNumberCad, fNumber, getECostos } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormSelect,
    CButton,
    CRow,
    CCol,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilAvTimer, cilCloudDownload, cilPen, cilPlus, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';

const costos = () => {
    //************************************************************************************************************************************************************************** */
    const [vMC, setVMC] = useState(false);
    const [vMM, setVMM] = useState(false);
    const [vMG, setVMG] = useState(false);
    const [vMI, setVMI] = useState(false);
    const [vMD, setVMD] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    const [periodoSel , setPeriodoB] = useState('');
    const [mesSel , setMesB] = useState('');
    // FORM OBJ COM INDI
    const [TxtId , setIdAs] = useState(0);
    const [TxtAsesor , setAsesor] = useState('');
    const [TxtTIPO , setTipo] = useState('-');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtCostos, setDTCostos] = useState([]);
    const [exOC, setExOc] = useState([]);
    // FROMS
    const [oMensualV, setOMV] = useState(0);
    const [showD, setShowD] = useState(false);
    //************************************************************************************************************************************************************************** */    
    useEffect(() => {
      if (Array.isArray(dtCostos)) {
        const arrCostos = dtCostos.map((r) => {
          // Definir la variable cp_mrgn para cada iteración
          let cp_mrgn = r.COSTO + r.Mrgn;
          let infla = r.Inflacion;
          let costo = r.COSTO;
          let Rgdist = cp_mrgn * r.GDist;
          let aux_SSF = cp_mrgn * r.SSF;
          aux_SSF = aux_SSF / 100;
          aux_SSF = aux_SSF.toFixed(2);
          let aux_SSV = cp_mrgn * r.SSV;
          aux_SSV = aux_SSV / 100;
          aux_SSV = aux_SSV.toFixed(2);
          let aux_GV = cp_mrgn * r.GV;
          aux_GV = aux_GV / 100;
          aux_GV = aux_GV.toFixed(2);
          Rgdist = Rgdist / 100;
          let auxGOPER = parseFloat(Rgdist) + parseFloat(aux_SSF) + parseFloat(aux_SSV) + parseFloat(aux_GV) + parseFloat(r.GF) + parseFloat(r.M);
          auxGOPER = auxGOPER.toFixed(2);
          let auxMBMIN = parseFloat(auxGOPER) + parseFloat(r.GCorp) + parseFloat(r.Arr_PF) + parseFloat(r.Int_) + parseFloat(r.Mrgn); 
          auxMBMIN = auxMBMIN.toFixed(2); 
          let auxInfla = parseFloat(auxGOPER) + parseFloat(costo);
          auxInfla = auxInfla * infla; 
          auxInfla = auxInfla / 100; 
          auxInfla = auxInfla.toFixed(2); 
          let auxMBD = parseFloat(auxMBMIN) + parseFloat(auxInfla) + parseFloat(r.Proteccion); 
          auxMBD = auxMBD.toFixed(2); 
          let auxPO = parseFloat(costo) + parseFloat(auxGOPER);
          auxPO = auxPO.toFixed(2);
          let auxMBDES = parseFloat(costo) + parseFloat(auxMBMIN);
          auxMBDES = auxMBDES.toFixed(2)
          // Devolver el objeto con los valores y la variable calculada
          return {
            planta: r.Planta,
            producto: r.Producto,
            costo: r.COSTO,
            margen: r.Mrgn,
            cp_margen: cp_mrgn,
            p_gdist: r.GDist,
            GDIST: Rgdist,
            p_ssf:r.SSF,
            SSF:aux_SSF,
            p_ssv:r.SSV,
            SSV:aux_SSV,
            p_gv:r.GV,
            GV:aux_GV,
            GF:r.GF,
            M:r.M,
            GOPER:auxGOPER,
            GCORP:r.GCorp,
            ARR_PF:r.Arr_PF,
            INT:r.Int_,
            MARGEN:r.Mrgn,
            MB_MINIMO:auxMBMIN,
            INFLACION:auxInfla,
            PROTECCION:r.Proteccion,
            MB_DESEABLE:auxMBD,
            PRECIO_OPER:auxPO,
            PRECIO_MB_DES:auxMBDES,
          };
        });        
        setExOc(arrCostos)
      } else {
        console.error('dtCostos no es un array', dtCostos);
      }
    }, [dtCostos]);
    
    //************************************************************************************************************************************************************************** */
    const mCambio = (event) => {
        const pla = event.target.value; 
        setPlantas(pla);
    };
    const mMes = (event) => {
        setMesB(event.target.value);
    };
    const mPeriodo = (event) => {
        setPeriodoB(event.target.value);
    };
    const bCostos = async() => {
      Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
      });
      try{
        const ocList = await getECostos(fNumberCad(mesSel), periodoSel, TxtTIPO);
        Swal.close();
        if(ocList)
        {
          setDTCostos(ocList)
          setExOc(ocList);
        }
      }catch(error){
        Swal.close();
        console.log("Ocurrio un problema cargando Plantas....")
      }
    };
    // ESTILOS COLUMNAS OCULTAS
    const [columnVisibility, setColumnVisibility] = useState({
      GOPER_C:false,
      MB_MINIMO_C:false,
      MB_DESEABLE_C:false,
    });
    const toggleColumnVisibility = (columnName) => {
      console.log(columnName)
      setColumnVisibility((prevVisibility) => ({
        ...prevVisibility,
        [columnName]: !prevVisibility[columnName],
      }));
    };    
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colComObj = [
      {
        name: 'PLANTA',
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
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: 'PRODUCTO',
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
        name: 'COSTO',
        selector: row => {
            const cpc = row.CPC;
            const h2o = row.H2O;
            const gravas = row.GRAVAS;
            const arenas = row.ARENAS;
            const aditivos = row.ADITIVOS;
            const insumos = row.INSUMOS == null ? 0:row.INSUMOS;
            let aux = cpc+h2o+gravas+arenas+aditivos+insumos;
            aux = parseFloat(aux).toFixed(2)
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return ( <a onClick={()=>bMC(row.id)}>{row.COSTO}</a>);
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
        name: 'MRG N PROM',
        selector: row => {
            const aux = row.Mrgn;
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
        name: 'CP + MRGN',
        selector: row => {
            let aux = row.COSTO + row.Mrgn;
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: '% GDIST',
        selector: row => {
            const aux = row.GDist;
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: 'GDIST',
        selector: row => {
          let cp_mrgn = row.COSTO + row.Mrgn;
          let aux = cp_mrgn * row.GDist;
          aux = aux / 100;
          aux = aux.toFixed(2);
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: '% SSF',
        selector: row => {
            const aux = row.SSF;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"130px",
        sortable:true,
        grow:1,
        visible:columnVisibility.GOPER_C,
      },
      {
        name: 'SSF',
        selector: row => {
          let cp_mrgn = row.COSTO + row.Mrgn;
          let aux = cp_mrgn * row.SSF;
          aux = aux / 100;
          aux = aux.toFixed(2);
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: '% SSV',
        selector: row => {
            const aux = row.SSV;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"130px",
        sortable:true,
        grow:1,
        visible:columnVisibility.GOPER_C,
      },
      {
        name: 'SSV',
        selector: row => {
          let cp_mrgn = row.COSTO + row.Mrgn;
          let aux = cp_mrgn * row.SSV;
          aux = aux / 100;
          aux = aux.toFixed(2);
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: '% GV',
        selector: row => {
            const aux = row.GV;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"130px",
        sortable:true,
        grow:1,
        visible:columnVisibility.GOPER_C,
      },
      {
        name: 'GV',
        selector: row => {
          let cp_mrgn = row.COSTO + row.Mrgn;
          let aux = cp_mrgn * row.GV;
          aux = aux / 100;
          aux = aux.toFixed(2);
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: 'GF',
        selector: row => {
          let aux = row.GF;
          aux = aux.toFixed(2);
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: 'M',
        selector: row => {
          let aux = row.M;
          aux = aux.toFixed(2);
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
        visible:columnVisibility.GOPER_C,
      },
      {
        name: (<button onClick={() => toggleColumnVisibility('GOPER_C')}>GOPER</button>),
        selector: row => {
          let cp_mrgn = row.COSTO + row.Mrgn;
          let auxDist = cp_mrgn * row.GDist;
          auxDist = auxDist / 100;
          auxDist = auxDist.toFixed(2);
          let auxSSF = cp_mrgn * row.SSF;
          auxSSF = auxSSF / 100;
          auxSSF = auxSSF.toFixed(2);
          let auxSSV = cp_mrgn * row.SSV;
          auxSSV = auxSSV / 100;
          auxSSV = auxSSV.toFixed(2);
          let auxGV = cp_mrgn * row.GV;
          auxGV = auxGV / 100;
          auxGV = auxGV.toFixed(2);
          let auxGF = row.GF;
          let auxM = row.M;
          let aux = parseFloat(auxDist) + parseFloat(auxSSF) + parseFloat(auxSSV) + parseFloat(auxGV) + parseFloat(auxGF) + parseFloat(auxM);
          aux = aux.toFixed(2);
          if (aux === null || aux === undefined) {
            return "No disponible";
          }
          if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return ( <a onClick={()=>bMGO(row.id)}>{aux}</a>);  
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
        name: 'GCORP',
        selector: row => {
            let aux = row.GCorp;
            aux = aux.toFixed(2);
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
        visible:columnVisibility.MB_MINIMO_C,
      },
      {
        name: 'ARR P/F',
        selector: row => {
            let aux = row.Arr_PF;
            aux = aux.toFixed(2);
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
        visible:columnVisibility.MB_MINIMO_C,
      },
      {
        name: 'INT',
        selector: row => {
            let aux = row.Int_;
            aux = aux.toFixed(2);
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
        visible:columnVisibility.MB_MINIMO_C,
      },
      {
        name: 'MARGEN',
        selector: row => {
            let aux = row.Mrgn;
            aux = aux.toFixed(2);
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
        visible:columnVisibility.MB_MINIMO_C,
      },
      {
        name: (<button onClick={() => toggleColumnVisibility('MB_MINIMO_C')}>MB MÍNIMO</button>),
        selector: row => {
          let cp_mrgn = row.COSTO + row.Mrgn;
          let auxDist = cp_mrgn * row.GDist;
          auxDist = auxDist / 100;
          auxDist = auxDist.toFixed(2);
          let auxSSF = cp_mrgn * row.SSF;
          auxSSF = auxSSF / 100;
          auxSSF = auxSSF.toFixed(2);
          let auxSSV = cp_mrgn * row.SSV;
          auxSSV = auxSSV / 100;
          auxSSV = auxSSV.toFixed(2);
          let auxGV = cp_mrgn * row.GV;
          auxGV = auxGV / 100;
          auxGV = auxGV.toFixed(2);
          let auxGF = row.GF;
          let auxM = row.M;
          let auxGOPER = parseFloat(auxDist) + parseFloat(auxSSF) + parseFloat(auxSSV) + parseFloat(auxGV) + parseFloat(auxGF) + parseFloat(auxM);
          auxGOPER = auxGOPER.toFixed(2);
          let aux = parseFloat(auxGOPER) + parseFloat(row.GCorp) + parseFloat(row.Arr_PF) + parseFloat(row.Int_) + parseFloat(row.Mrgn); 
          aux = aux.toFixed(2); 
          if (aux === null || aux === undefined) {
            return "No disponible";
          }
          if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return ( <a onClick={()=>bMMI(row.id)}>{aux}</a>);
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
        name: (<button onClick={() => toggleColumnVisibility('MB_DESEABLE_C')}>MB DESEABLE</button>),
        selector: row => {
          let infla = row.Inflacion;
          let costo = row.COSTO;
          let cp_mrgn = row.COSTO + row.Mrgn;
          let auxDist = cp_mrgn * row.GDist;
          auxDist = auxDist / 100;
          auxDist = auxDist.toFixed(2);
          let auxSSF = cp_mrgn * row.SSF;
          auxSSF = auxSSF / 100;
          auxSSF = auxSSF.toFixed(2);
          let auxSSV = cp_mrgn * row.SSV;
          auxSSV = auxSSV / 100;
          auxSSV = auxSSV.toFixed(2);
          let auxGV = cp_mrgn * row.GV;
          auxGV = auxGV / 100;
          auxGV = auxGV.toFixed(2);
          let auxGF = row.GF;
          let auxM = row.M;
          let auxGOPER = parseFloat(auxDist) + parseFloat(auxSSF) + parseFloat(auxSSV) + parseFloat(auxGV) + parseFloat(auxGF) + parseFloat(auxM);
          auxGOPER = auxGOPER.toFixed(2);
          let auxMin = parseFloat(auxGOPER) + parseFloat(row.GCorp) + parseFloat(row.Arr_PF) + parseFloat(row.Int_) + parseFloat(row.Mrgn); 
          auxMin = auxMin.toFixed(2);
          let auxInf = parseFloat(auxGOPER) + parseFloat(costo);
          auxInf = auxInf * infla; 
          auxInf = auxInf / 100;
          auxInf = auxInf.toFixed(2); 
          let aux = parseFloat(auxMin) + parseFloat(auxInf) + parseFloat(row.Proteccion); 
          aux = aux.toFixed(2); 
          if (aux === null || aux === undefined) {
            return "No disponible";
          }
          if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return ( <a onClick={()=>bMDE(row.id)}>{aux}</a>);
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
        name: 'INFLACIÓN',
        selector: row => {
          let infla = row.Inflacion;
          let costo = row.COSTO;
          let cp_mrgn = row.COSTO + row.Mrgn;
          let auxDist = cp_mrgn * row.GDist;
          auxDist = auxDist / 100;
          auxDist = auxDist.toFixed(2);
          let auxSSF = cp_mrgn * row.SSF;
          auxSSF = auxSSF / 100;
          auxSSF = auxSSF.toFixed(2);
          let auxSSV = cp_mrgn * row.SSV;
          auxSSV = auxSSV / 100;
          auxSSV = auxSSV.toFixed(2);
          let auxGV = cp_mrgn * row.GV;
          auxGV = auxGV / 100;
          auxGV = auxGV.toFixed(2);
          let auxGF = row.GF;
          let auxM = row.M;
          let auxGOPER = parseFloat(auxDist) + parseFloat(auxSSF) + parseFloat(auxSSV) + parseFloat(auxGV) + parseFloat(auxGF) + parseFloat(auxM);
          auxGOPER = auxGOPER.toFixed(2);
          let aux = parseFloat(auxGOPER) + parseFloat(costo);
          aux = aux * infla; 
          aux = aux / 100; 
          aux = aux.toFixed(2); 
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
        visible:columnVisibility.MB_DESEABLE_C,
      },
      {
        name: 'PROTECCIÓN',
        selector: row => {
            let aux = row.Proteccion;
            aux = aux.toFixed(2)
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
        visible:columnVisibility.MB_DESEABLE_C,
      },
      {
        name: 'PRECIO OPER.',
        selector: row => {
          let costo = row.COSTO;
          let cp_mrgn = row.COSTO + row.Mrgn;
          let auxDist = cp_mrgn * row.GDist;
          auxDist = auxDist / 100;
          auxDist = auxDist.toFixed(2);
          let auxSSF = cp_mrgn * row.SSF;
          auxSSF = auxSSF / 100;
          auxSSF = auxSSF.toFixed(2);
          let auxSSV = cp_mrgn * row.SSV;
          auxSSV = auxSSV / 100;
          auxSSV = auxSSV.toFixed(2);
          let auxGV = cp_mrgn * row.GV;
          auxGV = auxGV / 100;
          auxGV = auxGV.toFixed(2);
          let auxGF = row.GF;
          let auxM = row.M;
          let auxGOPER = parseFloat(auxDist) + parseFloat(auxSSF) + parseFloat(auxSSV) + parseFloat(auxGV) + parseFloat(auxGF) + parseFloat(auxM);
          auxGOPER = auxGOPER.toFixed(2);
          let aux = parseFloat(costo) + parseFloat(auxGOPER);
          aux = aux.toFixed(2);
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
        },
        width:"180px",
        sortable:true,
        grow:1,
      },
      {
        name: 'PRECIO MB DESEABLE',
        selector: row => {
          let costo = row.COSTO;
          let cp_mrgn = row.COSTO + row.Mrgn;
          let auxDist = cp_mrgn * row.GDist;
          auxDist = auxDist / 100;
          auxDist = auxDist.toFixed(2);
          let auxSSF = cp_mrgn * row.SSF;
          auxSSF = auxSSF / 100;
          auxSSF = auxSSF.toFixed(2);
          let auxSSV = cp_mrgn * row.SSV;
          auxSSV = auxSSV / 100;
          auxSSV = auxSSV.toFixed(2);
          let auxGV = cp_mrgn * row.GV;
          auxGV = auxGV / 100;
          auxGV = auxGV.toFixed(2);
          let auxGF = row.GF;
          let auxM = row.M;
          let auxGOPER = parseFloat(auxDist) + parseFloat(auxSSF) + parseFloat(auxSSV) + parseFloat(auxGV) + parseFloat(auxGF) + parseFloat(auxM);
          auxGOPER = auxGOPER.toFixed(2);
          let auxMin = parseFloat(auxGOPER) + parseFloat(row.GCorp) + parseFloat(row.Arr_PF) + parseFloat(row.Int_) + parseFloat(row.Mrgn); 
          auxMin = auxMin.toFixed(2); 
          let aux = parseFloat(costo) + parseFloat(auxMin);
          aux = aux.toFixed(2)
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return aux;
        },
        width:"180px",
        sortable:true,
        grow:1,
      },
    ];
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtCostos.filter(dtCostos => 
              dtCostos.Planta.includes(vBPlanta) || dtCostos.Producto.includes(vBPlanta)// Filtra los clientes por el número de cliente
            );
        }else{
          //getAcObjCom_()
        }
    };
    const fBComObj = dtCostos.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.Producto.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************** */
    const bMC = (id) =>{
      setVMC(true);
    };
    const bMGO = (id) =>{
      setVMG(true);
    };
    const bMMI = (id) =>{
      setVMI(true);
    };
    const bMDE = (id) =>{
      setVMD(true);
    };
    //************************************************************************************************************************************************************************************** */
    const mCambioTipo = (event) => {
      const Tipo = event.target.value; 
      setTipo(Tipo);
    };
    //************************************************************************************************************************************************************************************* */
    const downloadCSV = (e) => {
      const link = document.createElement('a');
      let csv = convertArrayOfObjectsToCSV(exOC);
      if (csv == null) return;
  
      const filename = 'CO_'+mesSel+'_'+periodoSel+'_'+TxtTIPO+'.csv';
  
      if (!csv.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
      }
  
      link.setAttribute('href', encodeURI(csv));
      link.setAttribute('download', filename);
      link.click();
    };
    //************************************************************************************************************************************************************************************** */
    
    //************************************************************************************************************************************************************************************* */
    return (
    <>
        <CContainer fluid>
            <h3>Estructura de Costos </h3>
            <CRow className='mt-3 mb-3'>
                <CCol xs={6} md={2}>
                    <Mes
                        mMes={mMes}
                        mesSel={mesSel}
                        className="input"
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <Periodo
                        mPeriodo={mPeriodo}
                        periodoSel={periodoSel}
                    />
                </CCol>
                <CCol xs={6} md={2}>
                  <label>TIPO</label>
                  <CFormSelect aria-label="Selecciona" value={TxtTIPO} onChange={mCambioTipo} className='mt-1'>
                      <option value="-">Selecciona...</option>
                      <option value="REAL" >REAL</option>
                      <option value="PPTO" >PPTO</option>
                      <option value="PPTO2" >PPTO2</option>
                  </CFormSelect> 
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                    <CButton color='primary' onClick={bCostos} style={{'color':'white'}} > 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} className='mt-4'>
                  <CButton color='danger' onClick={downloadCSV} style={{'color':'white'}}>
                      <CIcon icon={cilCloudDownload} className="me-2" style={{'color':'white'}} />
                      Exportar
                  </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
              <CCol xs={12} md={3}>
                <CCol xs={12} md={12}>
                  <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
              </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol>
                  <DataTable
                      columns={colComObj.filter((col) => col.visible !== false)}
                      data={fBComObj}
                      pagination
                      persistTableHead
                      subHeader
                  />
                </CCol>
            </CRow>
            <br />
        </CContainer>
    </>
    )
}
export default costos
