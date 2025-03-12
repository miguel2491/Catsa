import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import Plantas from '../../base/parametros/Plantas'
import Periodo from '../../base/parametros/Periodo'
import Mes from '../../base/parametros/Mes'

import { convertArrayOfObjectsToCSV, getPlantasOC, getPlantasOCId, savePlaOC, delPlaOC, fNumberCad } from '../../../Utilidades/Funciones';
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

const PlaOC = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    const [plantasSel , setPlantas] = useState('');
    const [periodoSel , setPeriodoB] = useState('');
    const [mesSel , setMesB] = useState('');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtPlaOC, setDTPlaOC] = useState([]);
    // FROMS
    const [id, setId] = useState(0);
    const [planta, setPlanta] = useState("");
    const [mes, setMes] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [objAs, setObjAs] = useState(0);
    const [objMaxCat, setObjMaxCat] = useState(0);
    const [objDg, setObjDg] = useState(0);
    const [TR, setTR] = useState(0);
    const [TB, setTB] = useState(0);
    const [objOpMax, setObjOpMax] = useState(0);
    const [objAju, setObjAju] = useState(0);
    const [objMen, setObjMen] = useState(0);
    const [objDia, setObjDia] = useState(0);
    const [perspCom, setObjPersp] = useState(0);
    const [proyCom, setProyCom] = useState(0);
    const [proyComDir, setProyComDir] = useState(0);
    //************************************************************************************************************************************************************************** */    
    useEffect(() => {
        
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
    const gPlantaOC_ = async () => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try{
            Swal.close()
            if(plantasSel != ""){
                console.log(plantasSel, periodoSel, fNumberCad(mesSel))
                const ocList = await getPlantasOCId(plantasSel, fNumberCad(mesSel), periodoSel);
                if(ocList)
                {
                    setDTPlaOC(ocList)
                }
            }else{
                console.log(periodoSel, fNumberCad(mesSel))
                const ocList = await getPlantasOC(fNumberCad(mesSel),periodoSel);
                console.log(ocList)
                if(ocList)
                {
                    setDTPlaOC(ocList)
                }
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
    const colPlaOC = [
        {
            name: 'Acción',
            selector: row => row.id,
            width:"200px",
            cell: (row) => (
                <div>
                    <CRow>
                    { row.estatus === '1' && (
                        <CCol xs={6} md={6} lg={6}>
                        <CButton
                            color="primary"
                            onClick={() => updPlaOC(row.id)}
                            size="sm"
                            className="me-2"
                            title="Actualizar"
                        >
                            <CIcon icon={cilSave} />
                        </CButton>
                        </CCol>
                    )}
                    <CCol xs={6} md={6} lg={6}>
                        <CButton
                            color="danger"
                            onClick={() => deletePlaOC(row.id)}
                            size="sm"
                            className="me-2"
                            title="Eliminar"
                        >
                            <CIcon icon={cilTrash} style={{'color':'white'}} />
                        </CButton>
                    </CCol>
                    </CRow>
                </div>
            ),
        },
        {
            name: 'Planta',
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
            name: 'OBJ. AC´S',
            selector: row => {
                const aux = row.obj_asesores;
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
            name: 'OBJ. MAX x CAT.',
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
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'OBJ. DG',
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
            name: 'TR',
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
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'TB',
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
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'OBJ. OPER MAX',
            selector: row => {
                const aux = row.obj_op_max;
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
            name: 'OBJ. AJUSTE',
            selector: row => {
                const aux = row.obj_aju;
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
            name: 'OBJ. MENSUAL',
            selector: row => {
                const aux = row.obj_men;
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
            name: 'OBJ. DIARIO',
            selector: row => {
                const aux = row.obj_dia;
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
            name: 'Perspectiva Com. Pre Cierre',
            selector: row => {
                const aux = row.persp_com_pre_cierre;
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
            name: 'Proyección Comercial AC',
            selector: row => {
                const aux = row.proy_com_ac;
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
            name: 'Proyección Dir. Gn',
            selector: row => {
                const aux = row.proy_com_dirG;
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
            const valFiltrados = dtPlaOC.filter(dtPlaOC => 
            dtPlaOC.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
            setDTPlaOC(valFiltrados);
        }else{
            gPlantaOC_()
        }
    };
    const fBPlantasOC = dtPlaOC.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.planta.toLowerCase().includes(fText.toLowerCase()) || item.mes.includes(fText) || item.periodo.includes(fText);
    });
    //************************************************************************************************************************************************************************** */
    const newOC = () =>{
        setVOC(true)
        setId(0);
        setCategoria("");
        setEstatus("");
        setCanMin("");
        setCanMax("");
        setBtnTxt("Guardar")
    }
    //************************************************************************************************************************************************************************************** */
    // Maneja el cambio en el select de tipo de mantenimiento
    const hCategoria = (e) => {
        setCategoria(e.target.value);
    }
    const hCanMin = (e) => {
        setCanMin(e.target.value);
    }
    const hCanMax = (e) => {
        setCanMax(e.target.value);
    }
    const hEstatus = (e) => {
        setEstatus(e.target.value);
    }
    //************************************************************************************************************************************************************************************* */
    const onSavePlaOC = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        // Crear un objeto FormData
        const formData = {
            id: id,
            planta:planta,
            mes:mes,
            periodo:periodo,
            TR:TR,
            TB:TB,
            obj_asesores:obj_asesores,
            obj_max_cat:obj_max_cat,
            obj_dg:obj_dg,
            obj_op_max:obj_op_max,
            obj_aju:obj_aju,
            obj_men:obj_men,
            obj_dia:obj_dia,
            persp_com_pre_cierre:persp_com_pre_cierre,
            proy_com_ac:proy_com_ac,
            proy_com_dirG:proy_com_dirG,
        };
        savePlantaOC(formData);
    }
    const savePlantaOC = async (data) => {
        try{
            const ocList = await savePlaOC(data);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            setVOC(false);
            gPlantaOC_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Plantas Objetivos Comerciales </h3>
            <CRow className='mt-3 mb-3'>
                <CCol xs={6} md={2}>
                    <Mes
                        mMes={mMes}
                        mesSel={mesSel}
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
                    <CButton color='primary' onClick={gPlantaOC_} style={{'color':'white'}} > 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                    <CButton color='success' onClick={newOC} style={{'color':'white'}} > 
                        <CIcon icon={cilPlus} />
                            Agregar Planta
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
                        columns={colPlaOC}
                        data={fBPlantasOC}
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
                    <CModalTitle id="oc_">Categoria</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={3}>
                            
                        </CCol>
                        <CCol xs={6} md={3}>
                            
                        </CCol>
                        <CCol xs={6} md={3}>
                            
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="# TR"
                                placeholder="0"
                                value={TR}
                                onChange={hCanMin}
                            />
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="# TB"
                                placeholder="0"
                                value={TB}
                                onChange={hCanMin}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSavePlaOC} style={{'color':'white'}} > 
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
export default PlaOC
