import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { CChart, CChartPolarArea } from '@coreui/react-chartjs'
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import '../../../estilos.css';
import '../ObjCom/AddObjCom.css'
import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import Periodo from '../../base/parametros/Periodo'
import Mes from '../../base/parametros/Mes'
import { convertArrayOfObjectsToCSV, formatResult, fNumberCad, fNumber,getVendedores, getCategoriaVenta, saveOCAs, getObjCom, GetObjComVendedor, GetObjComVId } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CBadge,
    CButton,
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilAvTimer, cilEyedropper, cilPen, cilPlus, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import Categoria from '../../Admin/ObjCom/Categoria';

const RObjCom = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    const [vOC2, setVOC2] = useState(false);
    const [vMHis, setVMHis] = useState(false);
    const [vMod, setVMod] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    const [plantasSel , setPlantas] = useState('');
    const [periodoSel , setPeriodoB] = useState('');
    const [mesSel , setMesB] = useState('');
    const [plantasSelAs , setPlantasAs] = useState('');
    const [periodoSelAs , setPeriodoBAs] = useState('');
    const [mesSelAs , setMesBAs] = useState('');
    // FORM OBJ COM INDI
    const [TxtId , setIdAs] = useState(0);
    const [TxtAsesor , setAsesor] = useState('');
    const [TxtCategoria , setCategoriaAs] = useState('-');
    const [TxtObj , setObjetivo] = useState(0);
    const [TxtObjDg , setObjetivoDg] = useState(0);
    const [TxtPerspectiva , setPersp] = useState(0);
    const [TxtProyCom , setProyCom] = useState(0);
    const [TxtProyComDir , setProyComDir] = useState(0);
    const [TxtFaltante , setFaltante] = useState(0);
    const [TxtMinimo , setMinimo] = useState(0);
    //Auxiliares
    const [DHabiles , setDHabiles] = useState(0);
    const [DTrans , setDTrans] = useState(0);
    const [DFalt , setDFalt] = useState(0);
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtObjCom, setDTObjCom] = useState([]);
    const [arrAsesores, setAsesores] = useState([]);
    const [arrCategoriaV, setCategoriaV] = useState([]);
    const [optCatV, setoptCatV] = useState([]);
    const [arrPlantaObj, setArrPlaObj] = useState([]);
    const [dtPlantaObj, setDTPlaObj] = useState([]);
    const [dtObjComMod, setDTObjComMod] = useState([]);
    const [dtObjComVen, setDTObjComVen] = useState([]);
    // FROMS
    const [oMensualV, setOMV] = useState(0);
    const [oDiarioV, setODV] = useState(0);
    const [oMensualP, setOMP] = useState(0);
    const [oDiarioP, setODP] = useState(0);
    const [oDiarioDGP, setODGP] = useState(0);
    const [TxtAvReal, setAvReal] = useState(0);
    const [TxtProm, setProm] = useState(0);
    const [TxtProy, setProy] = useState(0);
    const [TxtProyObj, setProyObj] = useState(0);
    const [TxtHacer, setHacer] = useState(0);
    const [TxtPorcAv, setPorcAv] = useState(0);
    const [showD, setShowD] = useState(false);
    //************************************************************************************************************************************************************************** */    
    useEffect(() => {
        getCategoriaVenta_()
    }, []);
    useEffect(() => {
      if(arrPlantaObj.length > 0){
        const objDg = arrPlantaObj[0].obj_dg;
        const objOpMax = arrPlantaObj[0].obj_op_max2;
        const objAjuste = arrPlantaObj[0].obj_aju2;
        const objMensP = arrPlantaObj[0].obj_men;
        const objDiaP = arrPlantaObj[0].obj_dia;
        const objDia_ = arrPlantaObj[0].obj_dia2;
        let persp = 0;
        let proy_com = 0;
        let proy_com_dir = 0;
        dtObjCom.forEach((item, index) =>{
          let VolMin = item.objetivo / DHabiles;
          let objPorc =  item.objetivo_dg / objDg;
          let porcentaje = objPorc.toFixed(2) * 100;
          let objOperMax = objOpMax * objPorc;
          let objAjuste_ = objAjuste * objPorc;
          let objMenV = objDiaP * objPorc;
          let objDiaV = objDia_ * objPorc;
          persp += item.perspectiva_pre_cierre;
          proy_com += item.proy_comercial;
          proy_com_dir += item.proy_comercial_Dir;
          const arrAux = {
            id:item.id,
            Asesor:item.Asesor.trim(),
            codigo_vendedor:item.codigo_vendedor,
            cantidad_max:item.cantidad_max,
            categoria:item.categoria,
            faltante:item.faltante,
            id_categoria:item.id_categoria,
            minimo_mas:item.minimo_mas,
            obj_dg:item.objetivo_dg,
            objetivo:item.objetivo,
            perspectiva_pre_cierre:item.perspectiva_pre_cierre,
            planta:item.planta,
            proy_comercial:item.proy_comercial,
            proy_comercial_Dir:item.proy_comercial_Dir,
            vendedor:item.vendedor,
            porcentaje:porcentaje,
            objOpMax:objOperMax.toFixed(2),
            objAjuste:objAjuste_.toFixed(2),
            objMensual:objMenV.toFixed(2),
            objDiario:objDiaV.toFixed(2),
            faltante:item.faltante,
            menosMas:item.menosMas,
          };
          setDTObjComMod((prevArrObjMod) => [...prevArrObjMod, arrAux]);
        });
        setOMP(arrPlantaObj[0].obj_men)
        setODP(arrPlantaObj[0].obj_dia)
        setODGP(arrPlantaObj[0].obj_dg)
        const arrAuxP = [{
          id:arrPlantaObj[0].id,
          TB:arrPlantaObj[0].TB,
          TR:arrPlantaObj[0].TR,
          mes:arrPlantaObj[0].mes,
          obj_aju:arrPlantaObj[0].obj_aju,
          obj_aju2:arrPlantaObj[0].obj_aju2,
          obj_asesores:arrPlantaObj[0].obj_asesores,
          obj_dg:arrPlantaObj[0].obj_dg,
          obj_dia:arrPlantaObj[0].obj_dia,
          obj_dia2:arrPlantaObj[0].obj_dia2,
          obj_max_cat:arrPlantaObj[0].obj_max_cat,
          obj_men:arrPlantaObj[0].obj_men,
          obj_op_max:arrPlantaObj[0].obj_op_max,
          obj_op_max2:arrPlantaObj[0].obj_op_max2,
          periodo:arrPlantaObj[0].periodo,
          planta:arrPlantaObj[0].planta,
          perspectiva:persp,
          proy_com:proy_com,
          proy_com_dirG:proy_com_dir
        }];
        setDTPlaObj(arrAuxP)
      }
    }, [arrPlantaObj]);
    useEffect(() => {
      //console.log(dtObjComMod)
    }, [dtObjComMod]);
    useEffect(() => {
      //console.log(dtPlantaObj)
    }, [dtPlantaObj]);
    useEffect(() => {
      const { fechas, result, av_real } = transposeData(dtObjComVen);
      let uaxP = oDiarioP/DHabiles; 
      let promedio_ = av_real / DHabiles;
      let proy_ = av_real / DTrans;
        proy_ = proy_ * DHabiles;
      let xHacer = oDiarioV * DHabiles;
        xHacer = xHacer - av_real;
        xHacer = xHacer / -1;
      console.log(oDiarioDGP,dtObjComVen)
      let pAvance = av_real / oMensualV;
      let pAvance_ = av_real / oMensualV;
        pAvance = pAvance * 100;
      let proyObj = oDiarioP * pAvance_;
          proyObj = proyObj * -1;
      let proyObjD = uaxP * pAvance_;
          proyObjD = proyObjD * -1;  
          console.log(uaxP,pAvance_,proyObj,proyObjD)
      // Solo actualizar el estado si av_real ha cambiado
      if (av_real !== TxtAvReal) {
        setAvReal(av_real);
        setProm(promedio_.toFixed(2))
        setProy(proy_.toFixed(2));
        setProyObj(proyObj.toFixed(2));
        setHacer(xHacer.toFixed(2));
        setPorcAv(pAvance.toFixed(2));
      }
    }, [dtObjComVen, TxtAvReal]); 
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
    const mCambioAs = (event) => {
      const pla = event.target.value;
      getVendedores_(pla) 
      setPlantasAs(pla);
    };
    const mMesAs = (event) => {
      setMesBAs(event.target.value);
    };
    const mPeriodoAs = (event) => {
      setPeriodoBAs(event.target.value);
      let ejercicio = event.target.value; 
      const valFiltrados = arrCategoriaV.filter(arrCategoriaV => 
        arrCategoriaV.ejercicio.includes(ejercicio) && arrCategoriaV.periodo.includes(mesSelAs) // Filtra los clientes por el número de cliente
      );
      setoptCatV(valFiltrados)
    };
    const mCategoria = (event) => {
      const cat = event.target.value; 
      setCategoriaAs(cat);
    };
    const getVendedores_ = async(p)=>{
      try{
        const ocList = await getVendedores(p);
        if(ocList)
        {
          setAsesores(ocList)
        }
      }catch(error){
          console.log("Ocurrio un problema cargando Plantas....")
      }
    };
    const getCategoriaVenta_ = async()=>{
      try{
        const ocList = await getCategoriaVenta();
        if(ocList)
        {
          setCategoriaV(ocList)
        }
      }catch(error){
          console.log("Ocurrio un problema cargando Plantas....")
      }
    };
    //************************************************************************************************************************************************************************** */
    const getAcObjCom_ = async () => {
      setDTObjComMod([]);
      setArrPlaObj([]);

      Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
      });
      if(plantasSel === '' && mesSel == 0){
        Swal.close();
        return false
      }
      try{
        const pla = plantasSel != '' ? plantasSel:'-';
        const ocList = await getObjCom(fNumberCad(mesSel),periodoSel, pla);
        const objD = ocList[2].Rows;
        const objIP = ocList[0].Rows;
        const objP = ocList[1].Rows;
        if(objD)
        {
          setShowD(true)
          console.log(objD)
          setDTObjCom(objD)
          let obj_acs = 0;
          let obj_max_cat = 0;
          let obj_dg = 0;
          let obj_men = 0;
          let trP = objP[0].TR;
          let tbP = objP[0].TB;
          let obj_op_max = (21*20) + (14*4);
              obj_op_max = obj_op_max * trP;
          let obj_ajusteP = objP[0].obj_aju;
          let obj_oper_max2 = obj_op_max/25;
          let obj_ajusteP2 = obj_ajusteP/25;
          
          objD.forEach((item, index) =>{
            obj_acs += parseFloat(item.objetivo) || 0;
            obj_max_cat += parseFloat(item.cantidad_max) || 0;
            obj_dg += parseFloat(item.objetivo_dg) || 0;
            obj_men += parseFloat(item.objetivo_dg) || 0;
          })
          const obj_diaP = parseFloat(obj_dg) + parseFloat(obj_ajusteP);
          let obj_diaP2 = (obj_diaP / 2) + 25;
          let objDiaP = obj_diaP2;
          let objDiario2 = obj_diaP2 / DHabiles;
          
          //console.log(obj_acs, obj_max_cat, obj_dg, trP, tbP, obj_op_max, obj_ajusteP, obj_oper_max2, obj_ajusteP2, obj_diaP2, objDiario2.toFixed(2))
          const arrAux = {
            id:objP[0].id,
            mes:objP[0].mes,
            periodo:objP[0].periodo,
            planta:objP[0].planta,
            TR:trP,
            TB:tbP,
            obj_aju:objP[0].obj_aju,
            obj_asesores:obj_acs,
            obj_dg:obj_dg,
            obj_dia:obj_diaP2,
            obj_max_cat:obj_max_cat,
            obj_men:objDiaP,
            obj_op_max:obj_op_max,
            obj_op_max2:obj_oper_max2,
            obj_aju2:obj_ajusteP2,
            obj_dia2:objDiario2.toFixed(2),
          };
          setArrPlaObj((prevArrPlaObj) => [...prevArrPlaObj, arrAux]);
        }
        if(objIP)
        {
          setDHabiles(objIP[0].DiaHabil)
          setDTrans(objIP[0].DiasTrans)
          const diasFal = parseInt(objIP[0].DiaHabil) - parseInt(objIP[0].DiasTrans) 
          setDFalt(diasFal)
        }
        // Cerrar el loading al recibir la respuesta
        Swal.close();  // Cerramos el loading
      }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }
    const getHisc = async(vendedor,oM,oD)=>{
      try{
        setOMV(oM);
        setODV(oD);
        const pla = plantasSel != '' ? plantasSel:'-';
        const ocList = await GetObjComVendedor(fNumberCad(mesSel),periodoSel, pla, vendedor);
        setDTObjComVen(ocList)
      }catch(error){
        console.log(error)
      }
    };
    const transposeData = (data) =>{
      const result = [];
      const fechas = [];
      const cantidades = [];
      let av_real = 0;
      // Iteramos sobre los datos originales
      data.forEach((item) => {
        const fecha = item.FechaPedido.split('T')[0];  // Extraemos solo la fecha (sin hora)
        fechas.push(fecha);  // Asignamos la cantidad a la fecha correspondiente
        cantidades.push(item.TotalCantidad);
        av_real += item.TotalCantidad;
      });
      result.push(cantidades);
      // Devuelve los datos transpuestos
      return { fechas, result, av_real };
    };
    const getObjComInfo = async(id)=>{
      try{
        const ocList = await GetObjComVId(id);
        if(ocList.length > 0){
          setIdAs(id);
          setPersp(ocList[0].perspectiva_pre_cierre);
          setProyCom(ocList[0].proy_comercial);
          setProyComDir(ocList[0].proy_comercial_Dir);
          setCategoriaAs(ocList[0].id_categoria);
          setAsesor(ocList[0].vendedor)
        }
      }catch(error){
        console.log(error)
      }
    }
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colComObj = [
      {
        name: '',
        selector: row => row.id,
        width:"120px",
        cell: (row) => (
            <div>
              <CRow>
                <CCol xs={6} md={2} lg={2}>
                  <CButton
                      color="warning"
                      onClick={() => vHist(row.codigo_vendedor,row.objMensual,row.objDiario)}
                      size="sm"
                      className="me-2"
                      title="Ver"
                  >
                  <CIcon icon={cilAvTimer} />
                  </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} style={{marginLeft:'15%'}}>
                  <CButton
                      color="success"
                      onClick={() => vModObj(row.id)}
                      size="sm"
                      className="ml-2 me-2"
                      title="Modificar"
                  >
                  <CIcon icon={cilPen} />
                  </CButton>
                </CCol>
              </CRow>
            </div>
        ),
      },
      {
        name: '%',
        selector: row => {
            const aux = parseInt(row.porcentaje)+'%';
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"80px",
        sortable:true,
        grow:1,
      },
      {
        name: 'CAT',
        selector: row => {
            const aux = row.categoria;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"80px",
        sortable:true,
        grow:1,
      },
      {
        name: 'ASESOR',
        selector: row => {
            const aux = row.Asesor;
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
        name: 'OBJ. AC´S',
        selector: row => {
            const aux = row.objetivo;
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
        name: 'Vol. min. DIARIO',
        selector: row => {
            const aux = row.objetivo / DHabiles;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux.toFixed(2);
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
        name: 'OBJ. MAX. x CAT.',
        selector: row => {
            const aux = row.cantidad_max;
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
        name: 'OBJETIVO DG',
        selector: row => {
            const aux = row.obj_dg;
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
      // {
      //   name: 'TR',
      //   selector: row => {
      //       const aux = row.tr;
      //       if (aux === null || aux === undefined) {
      //           return "No disponible";
      //       }
      //       if (typeof aux === 'object') {
      //       return "Sin Datos"; // O cualquier mensaje que prefieras
      //       }
      //       return aux;
      //   },
      //   width:"80px",
      //   sortable:true,
      //   grow:1,
      // },
      // {
      //   name: 'TB',
      //   selector: row => {
      //       const aux = row.tb;
      //       if (aux === null || aux === undefined) {
      //           return "No disponible";
      //       }
      //       if (typeof aux === 'object') {
      //       return "Sin Datos"; // O cualquier mensaje que prefieras
      //       }
      //       return aux;
      //   },
      //   width:"80px",
      //   sortable:true,
      //   grow:1,
      // },
      {
          name: 'OBJ. OPER MAX.',
          selector: row => {
              const aux = row.objOpMax;
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
          name: 'OBJ. AJUST',
          selector: row => {
              const aux = row.objAjuste;
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
          name: 'OBJETIVO MENSUAL',
          selector: row => {
              const aux = row.objMensual;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return aux;
          },
          width:"170px",
          sortable:true,
          grow:1,
      },
      {
          name: 'OBJETIVO DIARIO',
          selector: row => {
              const aux = row.objDiario;
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
        name: 'Perspectiva comercial Pre Cierre',
        selector: row => {
            const aux = row.perspectiva_pre_cierre;
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
        name: 'Proyección Comercial AC',
        selector: row => {
            const aux = row.proy_comercial;
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
        name: 'Proyección Comercial DirG',
        selector: row => {
            const aux = row.proy_comercial_Dir;
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
        name: 'Faltante',
        selector: row => {
            const aux = row.faltante;
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
        name: 'Menos Más',
        selector: row => {
            const aux = row.menosMas;
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
    // Obtener los datos transpuestos
    const { fechas, result } = transposeData(dtObjComVen);

    // Crear las columnas para DataTable
    const columns = fechas.map(fecha => ({
      name: fecha,
      selector: row => row[fecha],
      width: "120px",
    }));
    const data = result.map(cantidades => ({
     ...cantidades.reduce((acc, cantidad, index) => {
       acc[fechas[index]] = cantidad;  // Asignamos la cantidad a su fecha correspondiente
       return acc;
     }, {}),
   }));
    //************************************************************************************************************************************************************************** */
    const downloadCSV = (e) => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exOC);
        if (csv == null) return;
    
        const filename = 'OC_'+auxFcaI+'-'+auxFcaF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtObjComMod.filter(dtObjComMod => 
              dtObjComMod.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlaOC(valFiltrados);
        }else{
          getAcObjCom_()
        }
    };
    const fBComObj = dtObjComMod.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.planta.toLowerCase().includes(fText.toLowerCase()) || item.mes.includes(fText) || item.periodo.includes(fText);
    });
    
    //************************************************************************************************************************************************************************** */
    const newOAs = () =>{
        setVOC(true)
        setIdAs(0);
        setBtnTxt("Guardar")
    };
    const vHist = (id,oMen, oDia) =>{
      setVMHis(true);
      console.log(oMensualP)
      getHisc(id.trim(),oMensualP,oDiarioP)
    };
    const vModObj = (id) =>{
      setVMod(true);
      getObjComInfo(id)
    };
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hOnSearch = (string, results) => {
      if(results.length == 0){
          //setMostrarDataTable(false);
      }
    };
    const hOnSelect = (item) =>{
      setAsesor(item.id);
    };
    const hBlurObj = (e) =>{
      const objetivo = e.target.value;
      let cate = "";
      arrCategoriaV.map((elemento, index) =>{
        if(objetivo >= elemento.cantidad_min && objetivo <= elemento.cantidad_max){
          cate = elemento.categoria;
        }
      })
      console.log(cate)
    };
    const hObjetivo = (e) => {
      setObjetivo(e.target.value);
    };
    const hObjetivoDG = (e) => {
      setObjetivoDg(e.target.value);
    };
    const hPersp = (e) => {
      setPersp(e.target.value);
    };
    const hProyCom = (e) => {
      setProyCom(e.target.value);
    };
    const hProyComDg = (e) => {
      setProyComDir(e.target.value);
    };
    const hFaltante = (e) => {
      setFaltante(e.target.value);
    };
    const hMinimo = (e) => {
      setMinimo(e.target.value);
    };
    const hDHabiles = (e) => {
      setDHabiles(e.target.value);
    };
    const hBlurDhabiles = (e) =>{
      const objetivo = e.target.value;
      const aux = objetivo - DTrans;
      console.log(aux)
      setDFalt(aux)
    };
    //************************************************************************************************************************************************************************************* */
    const onSaveOCAs = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        // Crear un objeto FormData
        const formData = {
            id: TxtId,
            id_categoria:parseInt(TxtCategoria),
            vendedor:parseInt(TxtAsesor),
            mes:fNumberCad(mesSelAs),
            periodo:periodoSelAs,
            planta:plantasSelAs,
            objetivo:parseFloat(TxtObj),
            objetivo_dg:parseFloat(TxtObjDg),
            persp_pre_cierre:parseFloat(TxtPerspectiva),
            proy_com:parseFloat(TxtProyCom),
            proy_com_dir:parseFloat(TxtProyComDir),
            faltante:parseFloat(TxtFaltante),
            menosMas:parseFloat(TxtMinimo)
        };
        saveOCAsesor(formData);
    };
    const saveOCAsesor = async (data) => {
        try{
          const ocList = await saveOCAs(data);
          Swal.close();  // Cerramos el loading
          Swal.fire("Éxito", "Se Guardo Correctamente", "success");
          setVOC(false);
          setVMod(false);
          setTimeout(function(){getAcObjCom_();},2000);  
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Objetivos Comerciales </h3>
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
                <CCol xs={12} md={3}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                    <CButton color='primary' onClick={getAcObjCom_} style={{'color':'white'}} > 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                    <CButton color='success' onClick={newOAs} style={{'color':'white'}} > 
                        <CIcon icon={cilPlus} />
                            Agregar Objetivo
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
              <CCol xs={6} md={4}>
                <CCol xs={12} md={12}>
                  <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                </CCol>
              </CCol>
              {showD && (
              <>
              <CCol xs={6} md={2}>
                <div className="pt-3 tCenter"> Días Habiles</div>
                <div className='tCenter'> {DHabiles}</div>
              </CCol>
              <CCol xs={6} md={3}>
                <div className="pt-3 tCenter">Días Transcurridos</div>
                <div className='tCenter'>{DTrans}</div>
              </CCol>
              <CCol xs={6} md={3}>
                <div className="pt-3 tCenter">Días Faltantes</div>
                <div className='tCenter'>{DFalt}</div>
              </CCol>
              </>
              )}
            </CRow>
            {showD && (
            <>
            <CRow className='mt-2'>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell> </CTableHeaderCell>
                    <CTableHeaderCell>OBJ AC's</CTableHeaderCell>
                    <CTableHeaderCell>OBJ MAX x CAT</CTableHeaderCell>
                    <CTableHeaderCell>OBJ OBJ DG</CTableHeaderCell>
                    <CTableHeaderCell>TR</CTableHeaderCell>
                    <CTableHeaderCell>TB</CTableHeaderCell>
                    <CTableHeaderCell>OBJ OP MAX</CTableHeaderCell>
                    <CTableHeaderCell>OBJ AJUSTE</CTableHeaderCell>
                    <CTableHeaderCell>OBJ MENSUAL</CTableHeaderCell>
                    <CTableHeaderCell>OBJ DIARIO</CTableHeaderCell>
                    <CTableHeaderCell>PERSP. COM. PRE-CIERRE</CTableHeaderCell>
                    <CTableHeaderCell>PROYECCIÓN COM.</CTableHeaderCell>
                    <CTableHeaderCell>PROYECCIÓN COM. DIR.</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {dtPlantaObj.map((row, index) =>(
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">
                    <CButton
                      color="primary"
                      onClick={() => vHist('-',row.obj_men,row.obj_dia)}
                      size="sm"
                      className="me-2"
                      title="Ver"
                    >
                      <CIcon icon={cilAvTimer} />
                    </CButton>
                  </CTableHeaderCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_asesores)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_max_cat)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_dg)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{parseInt(row.TR)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{parseInt(row.TB)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_op_max)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_aju)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_men)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.obj_dia)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.perspectiva)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.proy_com)}</CTableDataCell>
                  <CTableDataCell className='tCenter'>{fNumber(row.proy_com_dirG)}</CTableDataCell>
                </CTableRow>
                ))}
                </CTableBody>
              </CTable>
            </CRow>
            </>
            )}
            <CRow className='mt-2 mb-2'>
                <CCol>
                  <DataTable
                      columns={colComObj}
                      data={fBComObj}
                      pagination
                      persistTableHead
                      subHeader
                  />
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vOC}
                onClose={() => setVOC(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_" className='tCenter'>Objetivo Comerical</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-4 mb-4'>
                      <CCol xs={6} md={3}>
                        <Mes
                          mMes={mMesAs}
                          mesSel={mesSelAs}
                          className="input"
                        />
                      </CCol>
                      <CCol xs={6} md={3}>
                        <Periodo
                          mPeriodo={mPeriodoAs}
                          periodoSel={periodoSelAs}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <Plantas  
                            mCambio={mCambioAs}
                            plantasSel={plantasSelAs}
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <label>Categoria</label>
                        <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbCategoria" value={TxtCategoria} onChange={mCategoria}>
                          <option value="" >Selecciona...</option>
                            {optCatV.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.categoria}
                              </option>
                            ))}
                        </CFormSelect>
                        </div>
                      </CCol>
                    </CRow>
                    <CRow className='mt-4 mb-4'>
                      <CCol xs={6} md={5}>
                        <label>Asesor</label>
                        <ReactSearchAutocomplete
                          items={arrAsesores}
                          onSearch={hOnSearch}
                          onSelect={hOnSelect}
                          autoFocus
                          formatResult={formatResult}
                        />
                      </CCol>
                      <CCol xs={6} md={2}>
                        <CFormInput
                            type="text"
                            label="Objetivo Asesor"
                            placeholder="0"
                            value={TxtObj}
                            onChange={hObjetivo}
                            onBlur={hBlurObj}
                        />
                      </CCol>
                      <CCol xs={6} md={2}>
                        <CFormInput
                            type="text"
                            label="Objetivo DG"
                            placeholder="0"
                            value={TxtObjDg}
                            onChange={hObjetivoDG}
                        />
                      </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSaveOCAs} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <CModal 
                backdrop="static"
                visible={vMod}
                onClose={() => setVMod(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_" className='tCenter'>Objetivo Comerical</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-4 mb-4'>
                      <CCol xs={6} md={2}>
                          <CFormInput
                              type="text"
                              label="Perspectiva"
                              placeholder="0"
                              value={TxtPerspectiva}
                              onChange={hPersp}
                          />
                        </CCol>
                      <CCol xs={6} md={2}>
                        <CFormInput
                            type="text"
                            label="Proyección Comercial"
                            placeholder="0"
                            value={TxtProyCom}
                            onChange={hProyCom}
                        />
                      </CCol>
                      <CCol xs={6} md={3}>
                        <CFormInput
                            type="text"
                            label="Proyección Comercial Dir G"
                            placeholder="0"
                            value={TxtProyComDir}
                            onChange={hProyComDg}
                        />
                      </CCol>
                      <CCol xs={6} md={1}>
                        <CFormInput
                            type="text"
                            label="Faltante"
                            placeholder="0"
                            value={TxtFaltante}
                            onChange={hFaltante}
                        />
                      </CCol>
                      <CCol xs={6} md={1}>
                        <CFormInput
                            type="text"
                            label="Mínimo +"
                            placeholder="0"
                            value={TxtMinimo}
                            onChange={hMinimo}
                        />
                      </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSaveOCAs} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='danger' onClick={() => setVMod(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            
            <CModal 
                backdrop="static"
                visible={vMHis}
                onClose={() => setVMHis(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Historico</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-4 mb-4'>
                      <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        persistTableHead
                      />
                    </CRow>
                    <CRow className='mt-4'>
                      <CCol sm={4} md={2} className='tCenter'>AVANCE REAL</CCol>
                      <CCol sm={4} md={2} className='tCenter'>PROM</CCol>
                      <CCol sm={4} md={2} className='tCenter'>PROYECCIÓN</CCol>
                      <CCol sm={4} md={2} className='tCenter'>PROY VS OBJ</CCol>
                      <CCol sm={4} md={2} className='tCenter'>POR HACER</CCol>
                      <CCol sm={4} md={2} className='tCenter'>% AVANCE</CCol>
                    </CRow>
                    <CRow className='mt-1 mb-1'>
                      <CCol sm={4} md={2} className='tCenter'>{TxtAvReal}</CCol>
                      <CCol sm={4} md={2} className='tCenter'>{TxtProm}</CCol>
                      <CCol sm={4} md={2} className='tCenter'>{TxtProy}</CCol>
                      <CCol sm={4} md={2} className='tCenter'>{TxtProyObj}</CCol>
                      <CCol sm={4} md={2} className='tCenter'>{TxtHacer}</CCol>
                      <CCol sm={4} md={2} className='tCenter'>{TxtPorcAv}</CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={() => setVMHis(false)} style={{'color':'white'}} > 
                          Cerrar  
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
            <br />
        </CContainer>
    </>
    )
}
export default RObjCom
