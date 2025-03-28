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
import { convertArrayOfObjectsToCSV, formatResult, fNumberCad, fNumber, getRFs, setRF, getRFId } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
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
import { cilAvTimer, cilPen, cilPlus, cilSave, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';

const CRef = () => {
    //************************************************************************************************************************************************************************** */
    const [vMREF, setVMREF] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    const [periodoSel , setPeriodoB] = useState('');
    // FORM OBJ COM INDI
    const [TxtIdREF , setIdREF] = useState(0);
    const [mesSel , setMesB] = useState('');
    const [TxtEjercicio , setEJERCICIO] = useState('');
    const [plantasSel , setPlantas] = useState('');
    const [TxtMrgnN , setMrgnProm] = useState(0);
    const [TxtGDist , setGDist] = useState(0);
    const [TxtSSF , setSSF] = useState(0);
    const [TxtSSV , setSSV] = useState(0);
    const [TxtGV , setGV] = useState(0);
    const [TxtGF , setGF] = useState(0);
    const [TxtM , setM] = useState(0);
    const [TxtGCORP , setGCorp] = useState(0);
    const [TxtARR_PF , setArrPF] = useState(0);
    const [TxtINT , setINT] = useState(0);
    const [TxtINFLACION , setInflacion] = useState(0);
    const [TxtPROTECCION , setProteccion] = useState(0);
    const [TxtTIPO , setTipo] = useState(0);
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtREFS, setDTRefs] = useState([]);
    // FROMS
    const [oMensualV, setOMV] = useState(0);
    const [showD, setShowD] = useState(false);
    //************************************************************************************************************************************************************************** */    
    useEffect(() => {
        //getCategoriaVenta_()
    }, []);
    //************************************************************************************************************************************************************************** */
    const mCambio = (event) => {
        const pla = event.target.value; 
        setPlantas(pla);
    };
    const mCambioTipo = (event) => {
        const Tipo = event.target.value; 
        setTipo(Tipo);
    };
    const mMes = (event) => {
        setMesB(event.target.value);
    };
    const mPeriodo = (event) => {
        setPeriodoB(event.target.value);
    };
    const mPeriodoREF = (event) => {
        setEJERCICIO(event.target.value);
    };
    const bREFs = async() => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
      try{
        const ocList = await getRFs(periodoSel);
        console.log(ocList)
        Swal.close();
        if(ocList)
        {
          setDTRefs(ocList)
        }
      }catch(error){
        Swal.close();
        console.log("Ocurrio un problema cargando Plantas....")
      }
    };
    //************************************************************************************************************************************************************************** */
    //---Movimientos
    const colREFS = [
      {
        name: '',
        selector: row => row.id,
        width:"80px",
        cell: (row) => (
            <div>
              <CRow>
                <CCol xs={6} md={2} lg={2}>
                  <CButton
                      color="warning"
                      onClick={() => nREF(row.id)}
                      size="sm"
                      className="me-2"
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
        name: 'PLANTA',
        selector: row => {
            const aux = row.planta;
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
        name: 'MRG N PROM',
        selector: row => {
            const aux = row.margen_N_prom.toFixed(2);
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
        name: '% GDIST',
        selector: row => {
            const aux = row.p_gdist.toFixed(2);
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: '% SSF',
        selector: row => {
            const aux = row.p_ssf;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"80px",
        sortable:true,
        grow:1,
      },
      {
        name: '% SSV',
        selector: row => {
            const aux = row.p_ssv.toFixed(2);
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: '% GV',
        selector: row => {
            const aux = row.p_gv.toFixed(2);
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"100px",
        sortable:true,
        grow:1,
      },
      {
        name: 'GF',
        selector: row => {
            const aux = row.GF.toFixed(2);
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return "$ "+fNumber(aux);
        },
        width:"130px",
        sortable:true,
        grow:1,
      },
      {
        name: 'M',
        selector: row => {
            const aux = row.M.toFixed(2);
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
        name: 'GCORP',
        selector: row => {
            const aux = row.GCorp.toFixed(2);
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
        name: 'ARR P/F',
        selector: row => {
            const aux = row.ARR_PF.toFixed(2);
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux;
        },
        width:"110px",
        sortable:true,
        grow:1,
      },
      {
        name: 'INT',
        selector: row => {
            const aux = row.INT.toFixed(2);
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
        name: 'INFLACION',
        selector: row => {
            const aux = row.INFLACION;
            if (aux === null || aux === undefined) {
                return "No disponible";
            }
            if (typeof aux === 'object') {
            return "Sin Datos"; // O cualquier mensaje que prefieras
            }
            return aux+"%";
        },
        width:"120px",
        sortable:true,
        grow:1,
      },
      {
        name: 'PROTECCION',
        selector: row => {
            const aux = row.PROTECCION.toFixed(2);
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
        name: 'TIPO',
        selector: row => {
            const aux = row.TIPO.trim();
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
    ];
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
            const valFiltrados = dtREFS.filter(dtREFS => 
              dtREFS.planta.includes(vBPlanta) || dtREFS.TIPO.includes(vBPlanta)// Filtra los clientes por el número de cliente
            );
        }else{
          bREFs()
        }
    };
    const fBREFS = dtREFS.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.planta.toLowerCase().includes(fText.toLowerCase()) || item.TIPO.toLowerCase().includes(fText.toLowerCase());
    });
    //************************************************************************************************************************************************************************** */
    const nREF = (id) =>{
        setIdREF(id);
        if(id != 0)
        {
            getRFId_(id)
        }
        setVMREF(true);
    };
    const getRFId_ = async(id)=>{
        try{
            const ocList = await getRFId(id);
            if(ocList)
            {
                console.log(ocList)
                var obj = ocList[0];
                setBtnTxt("Actualizar")
                setIdREF(id)
                setEJERCICIO(obj.Ejercicio)
                setPlantas(obj.planta)
                setMrgnProm(obj.margen_N_prom)
                setGDist(obj.p_gdist)
                setSSF(obj.p_ssf)
                setSSV(obj.p_ssv)
                setGV(obj.p_gv)
                setGF(obj.GF)
                setM(obj.M)
                setGCorp(obj.GCorp)
                setArrPF(obj.ARR_PF)
                setINT(obj.INT)
                setInflacion(obj.INFLACION)
                setProteccion(obj.PROTECCION)
                setTipo(obj.TIPO.trim())
                let auxMes = fNumberCad(obj.Periodo); 
                setMesB(parseInt(auxMes))
            }
        }catch(error){
            console.log("Ocurrio un problema cargando Plantas....")
        }
    }
    //************************************************************************************************************************************************************************************** */
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
    };
    const hMrgnN = (e) => {
      setMrgnProm(e.target.value);
    };
    const hGDist = (e) =>{
      setGDist(e.target.value);
    };
    const hSSF = (e) => {
        setSSF(e.target.value);
    };
    const hSSV = (e) => {
        setSSV(e.target.value);
    };
    const hGV = (e) => {
        setGV(e.target.value);
    };
    const hGF = (e) => {
        setGF(e.target.value);
    };
    const hM = (e) => {
        setM(e.target.value);
    };
    const hGCorp = (e) => {
        setGCorp(e.target.value);
    };
    const hArrPF = (e) => {
        setArrPF(e.target.value);
    };
    const hINT = (e) => {
        setINT(e.target.value);
    };
    const hINFLACION = (e) => {
        setInflacion(e.target.value);
    };
    const hProteccional = (e) => {
        setProteccion(e.target.value);
    };
    //************************************************************************************************************************************************************************************* */
    const onSaveREF = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        // Crear un objeto FormData
        const formData = {
            id: parseInt(TxtIdREF),
            planta:plantasSel,
            margen_N_prom:parseFloat(TxtMrgnN),
            p_gdist:parseFloat(TxtGDist),
            p_ssf:parseFloat(TxtSSF),
            p_ssv:parseFloat(TxtSSV),
            p_gv:parseFloat(TxtGV),
            GF:parseFloat(TxtGF),
            M:parseFloat(TxtM),
            GCorp:parseFloat(TxtGCORP),
            ARR_PF:parseFloat(TxtARR_PF),
            INT:parseFloat(TxtINT),
            INFLACION:parseInt(TxtINFLACION),
            PROTECCION:parseFloat(TxtPROTECCION),
            TIPO:TxtTIPO,
            Ejercicio:TxtEjercicio,
            Periodo:fNumberCad(mesSel)
        };
        saveREF(formData);
    };
    const saveREF = async (data) => {
        try{
          const ocList = await setRF(data);
          Swal.close();  // Cerramos el loading
          Swal.fire("Éxito", "Se Guardo Correctamente", "success");
          setVMREF(false);
          bREFs();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Costos REF</h3>
            <CRow className='mt-3 mb-3'>
                {/* <CCol xs={6} md={2}>
                    <Mes
                        mMes={mMes}
                        mesSel={mesSel}
                        className="input"
                    />
                </CCol> */}
                <CCol xs={6} md={2}>
                    <Periodo
                        mPeriodo={mPeriodo}
                        periodoSel={periodoSel}
                    />
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                    <CButton color='primary' onClick={bREFs} style={{'color':'white'}} > 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2}>
                    <CButton color='success' onClick={()=>{nREF(0)}} style={{'color':'white','marginTop':'1.5rem'}} > 
                        <CIcon icon={cilPlus} />
                        Agregar
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
                      columns={colREFS}
                      data={fBREFS}
                      pagination
                      persistTableHead
                      subHeader
                  />
                </CCol>
            </CRow>
            <br />
            <CModal 
                backdrop="static"
                visible={vMREF}
                onClose={() => setVMREF(false)}
                className='c-modal-60'
            >
                <CModalHeader>
                    <CModalTitle className='tCenter'>REF</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                      <CCol xs={6} md={4}>
                        <Mes
                          mMes={mMes}
                          mesSel={mesSel}
                          className="input"
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <Periodo
                          mPeriodo={mPeriodoREF}
                          periodoSel={TxtEjercicio}
                        />
                      </CCol>
                      <CCol xs={12} md={4}>
                        <Plantas  
                            mCambio={mCambio}
                            plantasSel={plantasSel}
                        />
                      </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="MARGEN N PROM"
                            placeholder="0"
                            value={TxtMrgnN}
                            onChange={hMrgnN}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="% GDIST"
                            placeholder="0"
                            value={TxtGDist}
                            onChange={hGDist}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="% SSF"
                            placeholder="0"
                            value={TxtSSF}
                            onChange={hSSF}
                        />
                      </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="% SSV"
                            placeholder="0"
                            value={TxtSSV}
                            onChange={hSSV}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="% GV"
                            placeholder="0"
                            value={TxtGV}
                            onChange={hGV}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="GF"
                            placeholder="0"
                            value={TxtGF}
                            onChange={hGF}
                        />
                      </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="M"
                            placeholder="0"
                            value={TxtM}
                            onChange={hM}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="GCORP"
                            placeholder="0"
                            value={TxtGCORP}
                            onChange={hGCorp}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="ARR P/F"
                            placeholder="0"
                            value={TxtARR_PF}
                            onChange={hArrPF}
                        />
                      </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="INT"
                            placeholder="0"
                            value={TxtINT}
                            onChange={hINT}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="INFLACIÓN"
                            placeholder="0"
                            value={TxtINFLACION}
                            onChange={hINFLACION}
                        />
                      </CCol>
                      <CCol xs={6} md={4}>
                        <CFormInput
                            type="text"
                            label="PROTECCIÓN"
                            placeholder="0"
                            value={TxtPROTECCION}
                            onChange={hProteccional}
                        />
                      </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                      <CCol xs={6} md={4}>
                        <label>TIPO</label>
                        <CFormSelect aria-label="Selecciona" value={TxtTIPO} onChange={mCambioTipo} className='mt-1'>
                            <option value="-">Selecciona...</option>
                            <option value="REAL" >REAL</option>
                            <option value="PPTO" >PPTO</option>
                            <option value="PPTO2" >PPTO2</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={5}></CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='primary' onClick={onSaveREF} style={{'color':'white'}} > 
                            <CIcon icon={cilSave} /> {btnG}
                        </CButton>
                    </CCol>
                    <CCol xs={4} md={3}>
                        <CButton color='danger' onClick={() => setVMREF(false)} style={{'color':'white'}} > 
                            <CIcon icon={cilTrash} />   Cerrar
                        </CButton>
                    </CCol>
                </CModalFooter>
            </CModal>
        </CContainer>
    </>
    )
}
export default CRef
