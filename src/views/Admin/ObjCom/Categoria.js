import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { convertArrayOfObjectsToCSV, getCategoriasOC, setCategorias, getCatId, delCatId } from '../../../Utilidades/Funciones';
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
import { cilPlus, cilSave, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
const Categoria = () => {
    //************************************************************************************************************************************************************************** */
    const [vOC, setVOC] = useState(false);
    const [btnG, setBtnTxt] = useState('Guardar');
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    const userIsMantenimiento = Rol('Mantenimiento');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [dtObjCom, setDTObjCom] = useState([]);
    // FROMS
    const [id, setId] = useState(0);
    const [categoria, setCategoria] = useState("");
    const [cantidad_min, setCanMin] = useState(0);
    const [cantidad_max, setCanMax] = useState(0);
    const [estatus, setEstatus] = useState("");
    //************************************************************************************************************************************************************************** */    
    const [shRespuesta, setshRespuesta] = useState(false);
    const shDisR = !userIsJP ? false : true;
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gCategoria();
            }
        });
    }, []);
    //************************************************************************************************************************************************************************** */
    const gCategoria = async () => {
        try{
            const ocList = await getCategoriasOC();
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
    const colOC = [
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
                            onClick={() => updCat(row.id)}
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
                            onClick={() => deleteCat(row.id)}
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
            name: 'Estatus',
            selector: row => {
                const aux = row.estatus;
                if (aux === '0' ) {
                    return <CBadge textBgColor='danger'>Inactiva</CBadge>;
                }else {
                    return <CBadge color='primary' shape='rounded-pill'>Aprobada</CBadge>;
                }
                return aux;
            },
            width:"100px",
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
            name: 'Cantidad Mínima',
            selector: row => {
                const aux = row.cantidad_min;
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
            name: 'Cantidad Máxima',
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
    ];
    //************************************************************************************************************************************************************************** */
    const updCat = (id) =>{
        setVOC(true)
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gUpdCat(id);
            }
        });
    }
    const gUpdCat = async (id) => {
        try{
            const ocList = await getCatId(id);
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
    const deleteCat = async(id) => {
        try{
            const ocAutoriza = await delCatId(id);
                Swal.fire({
                    title: 'Cargando...',
                    text: 'Estamos obteniendo la información...',
                    didOpen: () => {
                        Swal.showLoading();  // Muestra la animación de carga
                    }
                });
                setTimeout(() => { gCategoria();},2000);
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
            setDTObjCom(valFiltrados);
        }else{
            gCategoria()
        }
    };
    const fBCategorias = dtObjCom.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.categoria.toLowerCase().includes(fText.toLowerCase());
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
    const onSaveCat = () =>{
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
            categoria:categoria,
            cantidad_max:parseFloat(cantidad_max),
            cantidad_min:parseFloat(cantidad_min),
            estatus:estatus
        };
        saveCategoria(formData);
    }
    const saveCategoria = async (data) => {
        try{
            const ocList = await setCategorias(data);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            setVOC(false);
            gCategoria();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Categorias Objetivos Comerciales </h3>
            <CRow className='mt-4'>
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                    <CButton color='success' onClick={newOC} style={{'color':'white'}} > 
                        <CIcon icon={cilPlus} />
                            Agregar Categoria
                    </CButton>
                </CCol>
                <CCol xs={6} md={6}>
                    <CCol xs={12} md={6}>
                        <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
                    </CCol>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                
                <CCol>
                    <DataTable
                        columns={colOC}
                        data={fBCategorias}
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
                            <CFormInput
                                type="text"
                                label="Categoria"
                                placeholder="Categoria"
                                value={categoria}
                                onChange={hCategoria}
                            />
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="Cant. Max"
                                placeholder="999"
                                value={cantidad_max}
                                onChange={hCanMax}
                            />
                        </CCol>
                        <CCol xs={6} md={3}>
                            <CFormInput
                                type="text"
                                label="Cant. Min."
                                placeholder="0"
                                value={cantidad_min}
                                onChange={hCanMin}
                            />
                        </CCol>
                        <CCol xs={6} md={2} lg={2}>
                            <label>Estatus</label>
                            <CFormSelect size="lg" className="mb-3" aria-label="Estatus" value={estatus} onChange={hEstatus}>
                                <option value="-">-</option>
                                <option value="1">Activa</option>
                                <option value="0">Inactiva</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CCol xs={4} md={4}></CCol>
                    <CCol xs={4} md={2}>
                        <CButton color='primary' onClick={onSaveCat} style={{'color':'white'}} > 
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
export default Categoria
