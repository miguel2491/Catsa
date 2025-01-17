import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import '../../../estilos.css';
import { getCmbsAreas } from '../../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CImage,
    CBadge,
    CFormTextarea,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter
} from '@coreui/react'
import { useNavigate } from "react-router-dom";
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilHeadphones, cilSave, cilSearch } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import {es} from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css"
import "react-datepicker/dist/react-datepicker.css"
const DCancelados = () => {
    const navigate = useNavigate();
    //**************************************************** FROMS ********************************************************************************************************************** */
    const [cmbMotivo, setCmbMotivo] = useState('-');
    const [cmbAR, setCmbAR] = useState('-');
    const [cmbCausa, setCmbCausa] = useState('-');
    const [cmbCausante, setCmbCausante] = useState('-');
    const [ROrigen, setROrigen] = useState('');
    const [RDestino, setRDestino] = useState('');
    const [RComentario, setRComentario] = useState('');
    const [file, setFile] = useState(null);
    const [Respuesta, setRespuesta] = useState('-');
    const [RResponsable, setRResponsable] = useState('-');
    const [RCosto, setRCosto] = useState('');
    const [RHistorial, setRHistorial] = useState('');
    const [idOC, setIdOC] = useState("0");
    //**************************************************** VIEWS ********************************************************************************************************************** */
    const [shCmbAR, setshAR] = useState(false);
    const [shCmbCausa, setshCausa] = useState(false);
    const [shCmbCausante, setshCausante] = useState(false);
    const [shFile, setshFile] = useState(false);
    const [shResponsable, setshResponsable] = useState(false);
    const [shCosto, setshCosto] = useState(false);
    //**************************************************** Arrays ********************************************************************************************************************** */
    const [aAreas, setArrAreas] = useState([]);
    const [aCausa, setArrCausa] = useState([]);
    const [aCausante, setArrCausante] = useState([]);
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    //Buscador
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    //************************************************************************************************************************************************************************** */
    const getCmb = async (tipo, id) => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga                
            },
            willClose:() =>{
                Swal.close();
            }
        });
        try{
            switch(tipo)
            {
                case "CmbArea":
                    const cmbArea = await getCmbsAreas("Area",0);
                    if(cmbArea)
                    {
                        setArrAreas(cmbArea);
                        Swal.close();
                    }
                break;
                case "CmbCausa":
                    const cmbCausa = await getCmbsAreas("Causa",id);
                    if(cmbCausa)
                    {
                        setArrCausa(cmbCausa);
                        Swal.close();
                    }
                break;
                case "CmbCausante":
                    const cmbCausante = await getCmbsAreas("Causante",id);
                    console.log(cmbCausante)
                    if(cmbCausante)
                    {
                        setArrCausante(cmbCausante);
                        Swal.close();
                    } 
                break;
                default:
                    Swal.close();
                    break;
            }
        }catch(error){
            Swal.close();
            Swal.fire("Error","No se pudo obtener el resultado","err")
        }
    }
    
    const viewPC = (id) =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Reedirigiendo...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                navigate('/login');
            }
        });
    }
    
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        //getOCan(null);
    }, []);

    //************************************************************************************************************************************************************************** */
    const nOrdenCh = (e) =>{
        setNorden(e.target.value);
    }
    const newOC = () =>{
        setVOC(true)
    }
    // Maneja el cambio en el select de tipo
    const handleMotivo = (e) => {
        setCmbMotivo(e.target.value);
        if(e.target.value == "-"){
            setshAR(false);
            setshCausa(false);
            setshCausante(false);
        }else{
            setshAR(true);
            setshCausa(false);
            setshCausante(false);
            getCmb("CmbArea",0)
        }
    };
    const handleArea = (e) => {
        setCmbAR(e.target.value);
        getCmb("CmbCausa",e.target.value)
        setshCausa(true);
    };
    const handleCausa = (e) => {
        setCmbCausa(e.target.value);
        getCmb("CmbCausante",e.target.value)
        setshCausante(true);
    };
    const handleCausante = (e) => {
        setCmbCausante(e.target.value);
    };

    const handleTipoSt = (e) => {
        
    };
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Solo se guardará el primer archivo seleccionado
    };
    const onSaveOC = () =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        var tipo = idOC == '0' ? '0':idOC == ''? '0':'1';
        // Crear un objeto FormData
        const formData = {
            id: idOC,
            planta: plantasSelF,
            fecha: fechaOC,
            nFactura: nFactura,
            descripcion: descripcion,
            tipoMant: tipoMantenimiento,
            idVehiculo: vehiculo,
            descMant: descMan,
            file: file,
        };
        saveOCompra(formData,tipo);
    }
    const saveOCompra = async (data, tipo) => {
        try{
            const ocList = await setOCompra(data,tipo);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            setVOC(false);
            gOC();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>Pedido Cancelado </h3>
            <hr />
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={3}>
                    <label>Motivo</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={cmbMotivo}
                        onChange={handleMotivo}
                    >
                        <option value="-">-</option>
                        <option value="1">RECHAZADO/ARREGLADO</option>
                        <option value="2">RECHAZADO/RE DIRECCIONADO</option>
                        <option value="3">RECHAZADO/TIRADO</option>
                        <option value="4">RECHAZADO/RETORNADA</option>
                    </CFormSelect>
                </CCol>
                {shCmbAR && (
                <CCol xs={6} md={2}>
                    <label>Área</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={cmbAR}
                        onChange={handleArea}
                    >
                        <option value="-">- Todos -</option>
                        {aAreas.map((item, index) => (
                            <option key={index} value={item.id_areas}>{item.area}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                )}
                {shCmbCausa && (
                <CCol xs={6} md={3}>
                    <label>Causa</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={cmbCausa}
                        onChange={handleCausa}
                    >
                        <option value="-">- Todos -</option>
                        {aCausa.map((item, index) => (
                            <option key={index} value={item.id_causa}>{item.causa}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                )}
                {shCmbCausante && (
                <CCol xs={6} md={2}>
                    <label>Causante</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={cmbCausante}
                        onChange={handleCausante}
                    >
                        <option value="-">- Todos -</option>
                        {aCausante.map((item, index) => (
                            <option key={index} value={item.id_causante}>{item.causante}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                )}
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={2}>
                    <CFormInput
                        type="text"
                        id="ro"
                        label="Remisión Origen"
                        placeholder=" "
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <CFormInput
                        type="text"
                        id="rd"
                        label="Remisión Destino"
                        placeholder=" "
                    />
                </CCol>
                <CCol xs={6} md={8}>
                    <CFormTextarea
                        id="cm"
                        label="Breve Comentario"
                        rows={3}
                        text="300 Letras"
                    ></CFormTextarea>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={3}>
                    <CFormInput
                        type="file"
                        id="frmFile"
                        label="Archivo"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </CCol>
                <CCol xs={6} md={3} className='mt-4'>
                    <CButton color='primary'>
                        <CIcon icon={cilHeadphones} className="me-2" />
                        Crear Ticket
                    </CButton>
                </CCol>
            </CRow>

            <br />
        </CContainer>
    </>
    )
}
export default DCancelados