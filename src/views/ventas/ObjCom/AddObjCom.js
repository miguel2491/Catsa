import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import '../../../estilos.css';
import '../ObjCom/AddObjCom.css'
import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import Periodo from '../../base/parametros/Periodo'
import Mes from '../../base/parametros/Mes'
import { convertArrayOfObjectsToCSV, formatResult, fNumberCad, getVendedores, getCategoriaVenta, saveOCAs, getObjCom } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CBadge,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilPlus, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import Categoria from '../../Admin/ObjCom/Categoria';

const RObjCom = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
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
    const [TxtCategoria , setCategoriaAs] = useState('');
    const [TxtObj , setObjetivo] = useState(0);
    const [TxtObjDg , setObjetivoDg] = useState(0);
    const [TxtPerspectiva , setPersp] = useState(0);
    const [TxtProyCom , setProyCom] = useState(0);
    const [TxtProyComDir , setProyComDir] = useState(0);
    const [TxtFaltante , setFaltante] = useState(0);
    const [TxtMinimo , setMinimo] = useState(0);
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtObjCom, setDTObjCom] = useState([]);
    const [arrAsesores, setAsesores] = useState([]);
    const [arrCategoriaV, setCategoriaV] = useState([]);
    // FROMS
    const [id, setId] = useState(0);
    const [planta, setPlanta] = useState("");
    const [mes, setMes] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [TR, setTR] = useState(0);
    const [TB, setTB] = useState(0);
    //************************************************************************************************************************************************************************** */    
    useEffect(() => {
        getCategoriaVenta_()
    }, []);
    
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
        console.log(ocList)
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
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
          const pla = plantasSel != '' ? plantasSel:'-';
          const ocList = await getObjCom(fNumberCad(mesSel),periodoSel, pla);
          console.log(ocList)
          if(ocList)
          {
            setDTObjCom(ocList)
          }            
          // Cerrar el loading al recibir la respuesta
          Swal.close();  // Cerramos el loading
        }catch(error){
          Swal.close();
          Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colComObj = [
      {
        name: '%',
        selector: row => {
            const aux = 1 / 1;
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
        name: 'OBJETIVO DG',
        selector: row => {
            const aux = row.objetivo_dg;
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
        name: 'TR',
        selector: row => {
            const aux = row.tr;
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
        name: 'TB',
        selector: row => {
            const aux = row.tb;
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
          name: 'OBJ. OPER MAX.',
          selector: row => {
              const aux = row.obj_max_cat;
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
              const aux = row.obj_dg;
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
          name: 'OBJETIVO MENSUAL',
          selector: row => {
              const aux = row.TR;
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
          name: 'OBJETIVO DIARIO',
          selector: row => {
              const aux = row.TB;
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
        name: 'AVANCE REAL',
        selector: row => {
            const aux = row.TB;
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
        name: 'PROMEDIO',
        selector: row => {
            const aux = row.TB;
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
        name: 'PROYECCIÓN',
        selector: row => {
            const aux = row.TB;
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
        name: 'PROY VS OBJ',
        selector: row => {
            const aux = row.TB;
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
        name: '% AVANCE',
        selector: row => {
            const aux = row.TB;
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
    //************************************************************************************************************************************************************************** */
    const updPlaOC = (id) =>{
        setVOC(true)
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gUpdPlaOC(id);
            }
        });
    }
    const gUpdPlaOC = async (id) => {
        try{
            const ocList = await getPlantasOCId(id);
            console.log(ocList)
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            setId(ocList[0].id)
            setCategoria(ocList[0].categoria)
            setCanMin(ocList[0].cantidad_min)
            setCanMax(ocList[0].cantidad_max)
            setEstatus(ocList[0].estatus)
            setBtnTxt('Actualizar')
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const deletePlaOC = async(id) => {
        try{
            const ocAutoriza = await delPlaOC(id);
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Estamos obteniendo la información...',
                    didOpen: () => {
                        Swal.showLoading();  // Muestra la animación de carga
                    }
                });
                setTimeout(() => { gPlantaOC_();},2000);
        }catch(error){
            Swal.fire({
                title: "ERROR",
                text: "Ocurrio un error, vuelve a intentarlo",
                icon: "error"
            });
        }
    }
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
            const valFiltrados = dtObjCom.filter(dtObjCom => 
            dtObjCom.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlaOC(valFiltrados);
        }else{
          getAcObjCom_()
        }
    };
    const fBComObj = dtObjCom.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.planta.toLowerCase().includes(fText.toLowerCase()) || item.mes.includes(fText) || item.periodo.includes(fText);
    });
    //************************************************************************************************************************************************************************** */
    const newOAs = () =>{
        setVOC(true)
        setId(0);
        setBtnTxt("Guardar")
    }
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
            minimo_mas:parseFloat(TxtMinimo)
        };
        saveOCAsesor(formData);
    }
    const saveOCAsesor = async (data) => {
        try{
          const ocList = await saveOCAs(data);
          Swal.close();  // Cerramos el loading
          Swal.fire("Éxito", "Se Guardo Correctamente", "success");
          setVOC(false);
          getAcObjCom_();  
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
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
                <CCol xs={6} md={4}>
                    <CCol xs={12} md={12}>
                        <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                    </CCol>
                </CCol>
            </CRow>
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
                    <CModalTitle id="oc_">Objetivo Comerical</CModalTitle>
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
                            {arrCategoriaV.map(item => (
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
                            label="Objetivo"
                            placeholder="0"
                            value={TxtObj}
                            onChange={hObjetivo}
                            onBlur={hBlurObj}
                        />
                      </CCol>
                      <CCol xs={6} md={2}>
                        <CFormInput
                            type="text"
                            label="Obj DG"
                            placeholder="0"
                            value={TxtObjDg}
                            onChange={hObjetivoDG}
                        />
                      </CCol>
                      <CCol xs={6} md={2}>
                          <CFormInput
                              type="text"
                              label="Perspectiva"
                              placeholder="0"
                              value={TxtPerspectiva}
                              onChange={hPersp}
                          />
                        </CCol>
                    </CRow>
                    <CRow className='mt-4 mb-4'>
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
                        <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
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
