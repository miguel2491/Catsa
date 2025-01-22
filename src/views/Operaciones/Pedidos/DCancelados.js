import { useParams } from 'react-router-dom';
import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import '../../../estilos.css';
import { getCmbsAreas, getPCanceladoI, getPCanceladoGn, setTicketCancel, answTicketCancel } from '../../../Utilidades/Funciones';
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
} from '@coreui/react'
import { useNavigate } from "react-router-dom";
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilHeadphones, cilSave, cilSearch, cilShare } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'
import {es} from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css"
import "react-datepicker/dist/react-datepicker.css"
const DCancelados = () => {
    const navigate = useNavigate();
    const { id, tipo, idTicket } = useParams();  
    //**************************************************** FROMS ********************************************************************************************************************** */
    const [cmbMotivo, setCmbMotivo] = useState('-');
    const [cmbAR, setCmbAR] = useState('-');
    const [cmbCausa, setCmbCausa] = useState('-');
    const [cmbCausante, setCmbCausante] = useState('-');
    const [ROrigen, setROrigen] = useState('');
    const [RDestino, setRDestino] = useState('');
    const [RComentario, setRComentario] = useState('');
    const [NLetras, setNLetras] = useState(300);
    const [txtLetras, setTxtLetras] = useState('300 Letras');
    const [file, setFile] = useState(null);
    const [Respuesta, setRespuesta] = useState('-');
    const [RResponsable, setRResponsable] = useState('-');
    const [RCosto, setRCosto] = useState('-');
    const [RAceptacion, setRAceptacion] = useState('-');
    const [RCantidad, setRCantidad] = useState('0');
    const [RPrecioConcreto, setRPrecioConcreto] = useState('0');
    const [RCostoMP, setRCostoMP] = useState('');
    const [RHistorial, setRHistorial] = useState('');
    const [RPlanta, setRPlanta] = useState('');
    const [urlImg, setUrlImg] = useState('');
    const [idCancelado, setIdCancelado] = useState("0");
    const [idTicket_, setIdTicket] = useState("0");
    const [txtBtnTicket, setBtnTicket] = useState("Crear Ticket");
    //**************************************************** VIEWS ********************************************************************************************************************** */
    const [shCmbAR, setshAR] = useState(false);
    const [shCmbCausa, setshCausa] = useState(false);
    const [shCmbCausante, setshCausante] = useState(false);
    const [shFile, setshFile] = useState(true);
    const [shImg, setshImg] = useState(false);
    const [shResponsable, setshResponsable] = useState(false);
    const [shCosto, setshCosto] = useState(false);
    const [shBtnTicket, setshBtnTicket] = useState(false);
    const [isDIsabledR, setIsDisabledR] = useState(false); 
    const [shResp, setshResp] = useState(false);
    //**************************************************** Arrays ********************************************************************************************************************** */
    const [aAreas, setArrAreas] = useState([]);
    const [aCausa, setArrCausa] = useState([]);
    const [aCausante, setArrCausante] = useState([]);
    // ROLES
    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    const userIsAdmin = Rol('Admin')
    //****************************************************************************************************************************************************************************************** */
    const shDisR = !userIsJP ? false : true;
    //*********************************************************************** INIT ************************************************************************************************************* */
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
    const getPCancelado = async (id, tipo) => {
        
        try{
            if(tipo == 'RH'){
                const ocList = await getPCanceladoI(id);
                console.log(ocList)
                if(ocList){
                    setRAceptacion(ocList[0].tipo_respuesta)
                    if (ocList?.[0]?.tipo_respuesta !== "1") {
                        setRResponsable(ocList?.[0]?.usuario_responsable ?? '-');
                        setRCosto(ocList[0].costo ? ocList[0].costo : '0');
                        setshResp(true);
                    }
                    setRHistorial(ocList[0].historial)
                    setIdCancelado(ocList[0].id_cancelados)
                    setBtnTicket("Reasignar")
                    setCmbMotivo(ocList[0].motivo);
                    getCmb("CmbArea",0)
                    let area = ocList[0].area
                    if(area > 0){
                        setshAR(true);
                        setCmbAR(area)
                    }
                    let causa = ocList[0].causa
                    let causante = ocList[0].causante == null ? '-':ocList[0].causante;
                    getCmb("CmbCausa",area)
                    setTimeout(function(){
                        if(causa > 0){
                            setshCausa(true);
                            setCmbCausa(causa)
                            getCmb("CmbCausante",causa)
                            setTimeout(function(){
                                if(causante > 0){
                                    setshCausante(true);
                                    setCmbCausante(causante)
                                }     
                            },300);
                        } 
                    },500);
                    setROrigen(ocList[0].r_origen)
                    setRDestino(ocList[0].r_destino);
                    setRComentario(ocList[0].descripcion);
                    let imagen = ocList[0].url_img;
                    if(imagen.length == 0){
                        setshFile(true);
                        setshImg(false)
                    }else{
                        setshFile(false);
                        setshImg(true)
                        setUrlImg("http://apicatsa.catsaconcretos.mx:2543/Uploads"+imagen)
                    }
                    setRCantidad(ocList[0].cantidad ? ocList[0].cantidad : '0');
                    setRPrecioConcreto(ocList[0].precioConcreto ? ocList[0].precioConcreto:'0');
                    setRCostoMP(
                        Object.keys(ocList[0].costoMP).length === 0 && ocList[0].costoMP.constructor === Object
                        ? '' // Si es un objeto vacío, asignamos una cadena vacía
                        : ocList[0].costoMP
                    );
                    setshResponsable(true);
                }
            }else{
                const ocList = await getPCanceladoGn(idTicket);
                if(ocList){
                    let planta = ocList[0].Planta;  
                    planta = planta.substring(0,3);
                    let noRemision = ocList[0].NoRemision > 0 ? ocList[0].NoRemision:0;
                    let Cantidad = ocList[0].Cantidad == null ? 0:ocList[0].Cantidad;
                    let CostoMP = ocList[0].CostoMP == null ? 0:ocList[0].CostoMP;
                    setROrigen(planta+'-'+noRemision)
                    setRDestino(planta+'-'+noRemision)  
                    setshCosto(false)  
                    setIdTicket(idTicket)
                    setRCantidad(Cantidad)
                    setRPrecioConcreto(ocList[0].PrecioConcreto)
                    setRCostoMP(CostoMP)
                    setRPlanta(ocList[0].Planta)
                }
            }
            
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }    
    //************************************************************************************************************************************************************************** */
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga                
                getPCancelado(id,tipo);
            },
            willClose:() =>{
                Swal.close();
            }
        });
    }, []);
    //**************************************************************************  HANDLES ****************************************************************************************************** */
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
    const hAceptacion = (e) => {
        setRAceptacion(e.target.value)
        let t = e.target.value;
        if(t == "2"){
            setshResp(true);
        }else{
            setshResp(false)
        }
    };
    const hROrigen = (e) =>{
        setROrigen(e.target.value);
    }
    const hRDestino = (e) =>{
        setRDestino(e.target.value);
    }
    const hDescripcion = (e) =>{
        const texto = e.target.value
        const letraCount = texto.replace(/[^a-zA-Z]/g, '').length;
        const letrasRestantes = 300 - letraCount;
        if(letraCount <= 300)
        {
            setRComentario(texto);
            setNLetras(letrasRestantes);
            setTxtLetras(`${letrasRestantes} Letras`);    
        }
        
    };
    const hResponsable = (e) =>{
        setRResponsable(e.target.value)
    };
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Solo se guardará el primer archivo seleccionado
    };
    const hHistorial = (event) => {
        setRHistorial(event.target.value);
    };
    const hCantidad = (e) =>{
        setRCantidad(e.target.value);
    }
    const hPreCon = (e) =>{
        setRPrecioConcreto(e.target.value);
    }
    const hCostoMP = (e) =>{
        setRCostoMP(e.target.value);
    };
    const hCosto = (e) =>{
        setRCosto(e.target.value);
    }
    //*********************************************************************  BOTON ***************************************************************************************************** */
    const btnSaveTicket = (t) =>{
        Swal.fire({
            title: 'Guardar...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        var tipo = idCancelado == '0' ? '0':idCancelado == ''? '0':'1';
        // Crear un objeto FormData
        const formData = {
            id_cancelados:idCancelado,
            id_ticket: idTicket,
            motivo: cmbMotivo,
            area: cmbAR,
            causa: cmbCausa,
            causante: cmbCausante,
            cantidad:RCantidad,
            remOrigen: ROrigen,
            remDestino: RDestino,
            Comentario: RComentario,
            planta:RPlanta,
            precioConcreto:RPrecioConcreto,
            costoMP:RCostoMP,
            file: file,
        };
        if(t == "G"){
            sTicket(formData,tipo);
        }else{
            rTicket(formData, tipo);
        }
    }
    const sTicket = async (data, tipo) => {
        try{
            const ocList = await setTicketCancel(data,tipo);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            navigate('/Operaciones/Pedidos/Cancelados')
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const rTicket = async (data, tipo) => {
        data.Aceptacion = RAceptacion;
        data.Cantidad = RCantidad;
        data.PrecioConcreto = RPrecioConcreto;
        data.CostoMP = RCostoMP;
        data.Historial = RHistorial;
        data.Responsable = RResponsable;
        data.Costo = RCosto;
        try{
            const ocList = await answTicketCancel(data,tipo);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            navigate('/Operaciones/Pedidos/Cancelados')
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
                        value={ROrigen}
                        onChange={hROrigen}
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <CFormInput
                        type="text"
                        id="rd"
                        label="Remisión Destino"
                        placeholder=" "
                        value={RDestino}
                        onChange={hRDestino}
                    />
                </CCol>
                <CCol xs={6} md={8}>
                    <CFormTextarea
                        id="cm"
                        label="Breve Comentario"
                        rows={5}
                        text={txtLetras}
                        value={RComentario}
                        onChange={hDescripcion}
                    ></CFormTextarea>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                {shFile && (
                <CCol xs={6} md={3}>
                    <CFormInput
                        type="file"
                        id="frmFile"
                        label="Archivo"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </CCol>
                )}
                {shImg && (
                <CCol xs={6} md={6} className='mt-4'>
                    <CImage rounded thumbnail src={urlImg} width={800} height={720} />
                </CCol>
                )}
                <CCol xs={6} md={2} className='mt-4'>
                    <CButton color='success' style={{'color':'white'}} onClick={()=>btnSaveTicket("G")}>
                        <CIcon icon={cilHeadphones} className="me-2" />
                        {txtBtnTicket}
                    </CButton>
                </CCol>
            </CRow>
            <hr />
            { (shResponsable) && (
            <CRow className='mt-2 mb-2'>
                <CCol xs={6} md={3}>
                    <label>Aceptación</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={RAceptacion}
                        onChange={hAceptacion}
                        disabled={shDisR}
                    >
                        <option value="-">-</option>
                        <option value="1">Sin Cargo</option>
                        <option value="2">Con Cargo</option>
                    </CFormSelect>
                </CCol>
                {shResp && (
                <>
                <CCol xs={6} md={3}>
                    <label>Responsable</label>
                    <CFormSelect size="lg" className="mb-3" aria-label="Tipo"
                        value={RResponsable}
                        onChange={hResponsable}
                    >
                        <option selected value="-">-</option>
                        <option value="1">Dosificador</option>
                        <option value="2">Laboratorio</option>
                        <option value="3">Cliente</option>
                        <option value="4">Operador</option>
                        <option value="5">Multi Área</option>
                    </CFormSelect>
                </CCol>
                <CCol xs={6} md={6}>
                    <CFormTextarea
                        label="Costo"
                        rows={5}
                        value={RCosto}
                        onChange={hCosto}
                    ></CFormTextarea>
                </CCol>
                </>
                )}
                <CCol xs={6} md={3}>
                    <CFormInput
                        type="text"
                        id="cant"
                        label="Cantidad"
                        placeholder="0"
                        value={RCantidad}
                        onChange={hCantidad}
                    />
                </CCol>
                <CCol xs={6} md={3}>
                    <CFormInput
                        type="text"
                        id="pcon"
                        label="Precio Concreto"
                        placeholder="0"
                        value={RPrecioConcreto}
                        onChange={hPreCon}
                    />
                </CCol>
                <CCol xs={6} md={3}>
                    <CFormInput
                        type="text"
                        id="cMP"
                        label="Costo MP"
                        placeholder="0"
                        value={RCostoMP}
                        onChange={hCostoMP}
                    />
                </CCol>
            </CRow>
            )}
            { (shResponsable) && (
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={10}>
                    <CFormTextarea
                        id="txtArea"
                        label="Historial"
                        rows={5}
                        value={RHistorial}
                        onChange={hHistorial}
                    ></CFormTextarea>                
                </CCol>
                <CCol xs={12} md={2} style={{'margin-top':'3%'}}>
                    <CButton color='primary' disabled={shDisR} onClick={()=>btnSaveTicket("R")}>
                        <CIcon icon={cilShare} className="me-2" />
                        Responder
                    </CButton>
                </CCol> 
            </CRow>
            )}
        </CContainer>
    </>
    )
}
export default DCancelados