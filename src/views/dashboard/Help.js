import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";

import '../../estilos.css';
import { getTutoriales, setVideoUpload } from '../../Utilidades/Funciones';
import {
    CContainer,
    CFormInput,
    CFormSelect,
    CImage,
    CBadge,
    CFormTextarea,
    CFormCheck,
    CButton,
    CRow,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardBody,CCardHeader,CCardText,CCardTitle,CCardImage
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilPlus, cilSearch } from '@coreui/icons'

const Help = () => {
    //************************************************************************************************************************************************************************** */
    const [vMFile, setVMFile] = useState(false);
    const [videoActual, setVActual] = useState('http://apicatsa2.catsaconcretos.mx:2533/Uploads/Videos/Login.mp4');
    const [InfoVideo, setInfoVideo] = useState('');
    const [fText, setFText] = useState('');
    const [vBPlanta, setBPlanta] = useState('');
    //Arrays
    const [lVideos, setLVideos] = useState([]);
    
    // FROMS
    const [file, setFile] = useState(null);
    //************************************************************************************************************************************************************************** */    
    const [TxtTitulo, setTitulo] = useState('');
    const [TxtCategoria, setCategoria] = useState('');
    const [TxtDesc, setDesc] = useState('');
    const [ChkEstatus, setEstatus] = useState(false);
    const [urlVideoUp, setUrlVideo] = useState('');
    //************************************************************************************************************************************************************************** */
    // Función para manejar el cambio del archivo
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Solo se guardará el primer archivo seleccionado
    };
    const hTitulo = (event) => {
        setTitulo(event.target.value);
    };
    const hCategoria = (event) => {
        setCategoria(event.target.value); 
    };
    const hDesc = (event) => {
        setDesc(event.target.value); 
    };
    const hEstatus = (event) => {
        setEstatus(event.target.checked);
    };
    const hTextoF = (event) => {
        setFText(event.target.value);
    };
    //************************************************************************************************************************************************************************** */
    const getTutoriales_ = () =>{
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
                gOC();
            }
        });
    }
    const gOC = async () => {
        try{
            const ocList = await getTutoriales();
            console.log(ocList)
            if(ocList)
            {
                setLVideos(ocList)
            }
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    const viewVideo = async(id)=>{
        const tutorial = lVideos.find(video => video.id_tutorial === id);
        if (tutorial) {
            Swal.fire({
                title: 'Cargando...',
                text: 'Estamos obteniendo la información...',
                didOpen: () => {
                    Swal.showLoading();  // Muestra la animación de carga
                }
            });
            setTimeout(function(){
                Swal.close()
                setVActual('http://apicatsa.catsaconcretos.mx:2543/Uploads/'+tutorial.url_video);
                setInfoVideo(tutorial.descripcion)
            },1000)            
            console.log('Tutorial encontrado:', tutorial);
        } else {
            console.log('Tutorial no encontrado');
        }
    };
    const btnUpload = () =>{
        Swal.fire({
            title: 'Guardando...',
            text: 'Estamos guardando la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        // Crear un objeto FormData
        const formData = {
            titulo: TxtTitulo,
            categoria: TxtCategoria,
            descripcion: TxtDesc,
            estatus:ChkEstatus,
            file: file,
        };
        saveVideo(formData);
    };

    const saveVideo = async (data) => {
        try{
            const ocList = await setVideoUpload(data);
            // Cerrar el loading al recibir la respuesta
            Swal.close();  // Cerramos el loading
            Swal.fire("Éxito", "Se Guardo Correctamente", "success");
            setVMFile(false);
            getTutoriales_();
        }catch(error){
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //------------
    useEffect(() => {
        getTutoriales_();
    }, []);
    
    //************************************************************************************************************************************************************************** */
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const filteredVideos = lVideos.filter((video) => {
        return video.titulo.toLowerCase().includes(fText.toLowerCase()) || 
            video.descripcion.toLowerCase().includes(fText.toLowerCase());
    });

    //************************************************************************************************************************************************************************** */
    return (
    <>
        <CContainer fluid>
            <h3>CATSA TV </h3>
            <CRow className='mt-2 mb-2'>
                <CCol xs={8} md={8} lg={8} className='mt-3'>
                <CFormInput
                    type="text"
                    placeholder="Buscar..."
                    value={fText}
                    onChange={hTextoF}
                />
                </CCol>
                <CCol xs={2} md={2} lg={2} className='mt-3'>
                    <CButton color='primary'> 
                        <CIcon icon={cilSearch} />
                            Buscar
                    </CButton>
                </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
                <CCol xs={12} md={8}>
                    <CRow className='mt-2'>
                        <video width="100%" controls key={videoActual}>
                        <source src={videoActual} type="video/mp4" />
                        Tu navegador no soporta el formato de video.
                        </video>
                    </CRow>
                    <CRow className='mt-2'>
                        <p>{InfoVideo}</p>
                    </CRow>
                </CCol>
                <CCol xs={12} md={4}>
                    <CRow>
                        <CCard textBgColor="primary" className="mb-3">
                            <CCardHeader>Soporte</CCardHeader>
                            <CCardBody>
                            <CCardTitle>Dudas y manuales</CCardTitle>
                            <CCardText>
                                Por si te pierdes, encuentra aqui los videos para el uso del sistema.
                            </CCardText>
                            </CCardBody>
                        </CCard>
                    </CRow>
                    <CRow>
                        {filteredVideos.map((video,index) =>(
                        <CCard className="mb-3" key={index} style={{ maxWidth: '540px' }} onClick={() =>viewVideo(video.id_tutorial)}>
                            <CRow className="g-0">
                                <CCol md={4}>
                                <CCardImage src="/tutoV.png" style={{'margin-top':'25px'}} />
                                </CCol>
                                <CCol md={8}>
                                <CCardBody>
                                    <CCardTitle>{video.titulo}</CCardTitle>
                                    <CCardText>
                                        {video.descripcion}
                                    </CCardText>
                                    <CCardText>
                                    <small className="text-body-secondary">{video.created_at}</small>
                                    </CCardText>
                                </CCardBody>
                                </CCol>
                            </CRow>
                        </CCard>
                        ))}
                    </CRow>
                </CCol>
            </CRow>
            <CModal 
                backdrop="static"
                visible={vMFile}
                onClose={() => setVMFile(false)}
                className='c-modal-80'
            >
                <CModalHeader>
                    <CModalTitle id="oc_">Videos</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={4} md={4}>
                            <CFormInput
                                type="text"
                                label="Titulo"
                                value={TxtTitulo}
                                onChange={hTitulo}
                            />
                        </CCol>
                        <CCol xs={4} md={4}>
                            <label>Categoria</label>
                            <CFormSelect size="lg" className="mb-3" aria-label="Interfaz"
                                value={TxtCategoria}
                                onChange={hCategoria}
                            >
                                <option>-</option>
                                <option value="Login">LOGIN</option>
                                <option value="Mantenimiento">MANTENIMIENTO</option>
                            </CFormSelect>
                        </CCol>
                        <CCol xs={4} md={4}>
                            <CFormInput
                                type="text"
                                label="Descripcion"
                                value={TxtDesc}
                                onChange={hDesc}
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={4}>
                            <CFormInput
                                type="file"
                                id="frmFile"
                                label="Agregar Videos"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                        </CCol>
                        <CCol xs={6} md={2}>
                            <CFormCheck label="Estatus" value={ChkEstatus} onChange={hEstatus} />
                        </CCol>
                    </CRow>
                    <CRow className='mt-2'>
                        <CButton onClick={btnUpload}>
                            Agregar
                        </CButton>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    
                </CModalFooter>
            </CModal>
            <br />
        </CContainer>
    </>
    )
}
export default Help