import React, {useEffect, useState, useRef} from 'react'
import '../../../estilos.css';
import Swal from "sweetalert2";
import 'leaflet/dist/leaflet.css'
import "sweetalert2/dist/sweetalert2.min.css";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import { getEquiposList, getEquiposId, setRgEq, deleteEQ, convertArrayOfObjectsToCSV, fNumber
} from '../../../Utilidades/Funciones';
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
  cilCheck,
  cilPen,
  cilPlus,
  cilQrCode,
  cilSearch,
  cilTrash,
} from '@coreui/icons'
import ReactQR from 'react-qr-code';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { Rol } from '../../../Utilidades/Roles'
import { format } from 'date-fns';
import QrScanner  from "react-qr-reader-es6";

const Equipos = () => {    
    const navigate = useNavigate();
    const [qrText, setQrText] = useState('');
    //--------------- TABLES --------------------------------
    const [idReg, setIdReg] = useState(0);
    const [txt_categoria, setCategoria] = useState('');
    const [txt_articulo, setArticulo] = useState('');
    const [txt_marca, setMarca] = useState('');
    const [txt_modelo, setModelo] = useState('');
    const [txt_estado, setEstado] = useState('');
    const [txt_SN, setSN] = useState('');
    const [txt_imei, setImei] = useState('');
    //--------------- MODALS ---------------------------------
    const [mdlNuevo, setMNuevo] = useState(false);
    const [mdlQR, setMQR] = useState(false);
    //------------------Shows---------------------------------
    const [shDiv, setShDiv] = useState(false);
    //
    
    //--DT Pedidos
    const [dtEquipos, setDTEquipos] = useState([]);
    const [dtEquiposAux, setDTEquiposAux] = useState([]);
    //EXTRAS
    //--------------------------- Buscador --------------------------------------
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');
    // ROLES
    const userIsAdmin = Rol('Admin');
    useEffect(()=>{    
      btnBuscar();
    },[]);
    //-----------------------------------------------------------------------------------
    
    //---------------------------- BOTONS --------------------------------------------
    const btnBuscar = async() =>{
      Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
        });
        try {
            const equipos = await getEquiposList();
            Swal.close();
            if(equipos)
            {
              setShDiv(true)
              setDTEquipos(equipos);
              setDTEquiposAux(equipos);
            }
        } catch (error) {
            // Cerrar el loading y mostrar el error
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }    
    }

    const Nuevo = () =>{
      setMNuevo(true);  
      setIdReg(0)
      setCategoria('C')
      setArticulo('')
      setMarca('')
      setModelo('')
      setSN('')
      setImei('')
      setEstado('Bueno')  
    }
    //=================================================================================
    const Modificar = async(id) =>{
      try {
        const equiposId = await getEquiposId(id);
        if(equiposId)
        {
          setMNuevo(true);
          setIdReg(equiposId[0].id)
          setCategoria(equiposId[0].categoria)
          setArticulo(equiposId[0].articulo)
          setMarca(equiposId[0].marca)
          setModelo(equiposId[0].modelo)
          setSN(equiposId[0].SN)
          setImei(equiposId[0].imei)
          setEstado(equiposId[0].estado)
        }
      } catch (error) {
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }
    const Eliminar = async(id) =>{
      Swal.fire({
          title: "¿Deseas eliminar el equipo "+id+" ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Eliminar",
          denyButtonText: "Cancelar"
      }).then((result) => {
          if (result.isConfirmed) {
              Swal.fire({
                  title: 'Cargando...',
                  text: 'Procesando Solicitud...',
                  didOpen: () => {
                      Swal.showLoading();
                      eliminarEQ(idP);
                  }
              });
          }
      });
    }
    const eliminarEQ = async (id) => {
      try {
        const result = await deleteEQ(id);
        if (result) {
          Swal.fire("Correcto", "Se elimino correctamente", "success");
          btnBuscar();
        } else {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Ocurrio un error, vuelve a intentar", "error");
      } finally {
        Swal.close();
      }
    };
    const GenQR = (id, modelo, sn, imei) =>{
      let cadena = id+"-"+modelo+"-"+sn+"-"+imei;
      setMQR(true);
      setQrText(cadena);
      //AQUI GENERAMOS EL QR
    }
    const saveReg = async() =>{
      Swal.fire({
          title: 'Guardar...',
          text: 'Estamos guardando la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
          }
      });
      // Crear un objeto FormData
      const formData = {
          id: parseInt(idReg),
          categoria:txt_categoria,
          articulo:txt_articulo,
          marca:txt_marca,
          modelo:txt_modelo,
          estado:txt_estado,
          sn:txt_SN,
          imei:txt_imei,
      };
      saveRgs(formData);
    }
    const saveRgs = async (data) => {
      try{
        const ocList = await setRgEq(data);
        Swal.close();  // Cerramos el loading
        Swal.fire("Éxito", "Se Guardo Correctamente", "success");
        setMNuevo(false);
        btnBuscar();
      }catch(error){
          Swal.close();
          Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    };
    //--------------------------- COLS -----------------------------------------------
    const colEq = [
      {
          name: 'ACCION',
          width:"200px",
          sortable:true,
          cell: (row) => {    
              return (
              <div>
                  <CRow>
                      <CCol xs={3} md={3} lg={3}>
                        <CButton
                            style={{ color: 'white' }}
                            color="primary"
                            onClick={() => Modificar(row.id)}
                            size="sm"
                            className="me-2"
                            title="Modificar"
                        >
                            <CIcon icon={cilPen} />
                        </CButton>
                      </CCol>
                      <CCol xs={3} md={3} lg={3}>
                        <CButton
                            style={{ color: 'white' }}
                            color="danger"
                            onClick={() => Eliminar(row.id)}
                            size="sm"
                            className="me-2"
                            title="Eliminar"
                        >
                            <CIcon icon={cilTrash} />
                        </CButton>
                      </CCol>
                      <CCol xs={3} md={3} lg={3}>
                        <CButton
                            style={{ color: 'white' }}
                            color="info"
                            onClick={() => GenQR(row.id, row.modelo, row.SN, row.imei)}
                            size="sm"
                            className="me-2"
                            title="QR"
                        >
                            <CIcon icon={cilQrCode} />
                        </CButton>
                      </CCol>
                  </CRow>
              </div>
              );
          },
      },
      {
        name: 'CATEGORIA',
        selector: (row) => {
          const aux = row.categoria
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '120px',
      },
      {
        name: 'ARTÍCULO',
        sortable: true,
        selector: (row) => {
          const aux = row.articulo
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        width: '150px',
      },
      {
        name: 'MARCA',
        selector: (row) => {
          const aux = row.marca
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
        name: 'MODELO',
        selector: (row) => {
          const aux = row.modelo
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
        name: 'ESTADO',
        selector: row => {
            const aux = row.estado;
            if (aux == "Bueno") {
                return <CBadge color='primary' textBgColor='primary'>{aux}<CIcon icon={cilCheck}></CIcon></CBadge>;
            }else if(aux == "Regular"){
                return <CBadge color='warning' shape='rounded-pill'>{aux}<CIcon icon={cilX}></CIcon></CBadge>;
            }else{
              return <CBadge color='danger' shape='rounded-pill'>{aux}<CIcon icon={cilX}></CIcon></CBadge>;
            }
        },
        sortable: true,
        width: '100px',
      },
      {
        name: 'SN',
        selector: (row) => {
          const aux = row.SN
          if (aux === null || aux === undefined) {
            return 'No disponible'
          }
          if (typeof aux === 'object') {
            return '-' // O cualquier mensaje que prefieras
          }
          return aux
        },
        sortable: true,
        width: '120px',
      },
      {
        name: 'IMEI',
        selector: (row) => {
          const aux = row.imei
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
    ];
    //--------------------------- FUNCTION ACCIONES -----------------------------------------------
    const mBorrarP = async(IdPedido) =>{
        console.log(IdPedido)
    }
    //--------------------------------------------------------------------------------
    // Buscador
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda SP
    //--------------------------------------------------------------------------------
    // Buscador
    //************************************************************************************************************************************************************************** */
    // Función de búsqueda
    const onFindBusqueda = (e) => {
      setBPlanta(e.target.value)
      setFText(e.target.value)
    }
    const fBusqueda = () => {
      if (vBPlanta.length != 0) {
        const valFiltrados = dtEquipos.filter(
          (dtEquipos) => dtEquipos.Planta.includes(vBPlanta), // Filtra los clientes por el número de cliente
        )
        setDTEquiposAux(valFiltrados)
      } else {
        btnBuscar()
      }
    }
    const fEq = dtEquiposAux.filter((item) => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.categoria.toString().includes(fText)
    })
  
    //************************* HANDLE*************************************************************** */
    const h_articulo = (e) =>{
        setArticulo(e.target.value)
    };
    const h_marca = (e) =>{
        setMarca(e.target.value)
    };
    const h_modelo = (e) =>{
        setModelo(e.target.value)
    };
    const h_SN = (e) =>{
        setSN(e.target.value)
    };
    const h_imei = (e) =>{
        setImei(e.target.value)
    };
    const mCategoria = (event) => {
        const Cate = event.target.value; 
        setCategoria(Cate);
    };
    const mEstado = (event) => {
        const Edo = event.target.value; 
        setEstado(Edo);
    };
    
    //******************************************************** */
    // Descargar CSV
    const downloadQR = () => {
        const svgElement = document.getElementById('qr-code-svg'); // Obtener el SVG generado
        const svgData = new XMLSerializer().serializeToString(svgElement); // Serializar el SVG a string
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' }); // Convertir el SVG a Blob
        const svgUrl = URL.createObjectURL(svgBlob); // Crear un objeto URL del Blob

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // Convertir el canvas a imagen PNG
            const pngDataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngDataUrl;
            link.download = 'QR_Code.png'; // Nombre del archivo a descargar
            link.click();
        };
        img.src = svgUrl; // Cargar el SVG como imagen
    };
    //********************************************************************************************** */
  return (
    <>
    <CContainer fluid>
      <h1>EQUIPOS</h1>
      <CRow className='mt-3 mb-3'>
        <CCol xs={3} md={3}>
          <CFormSelect className='mt-4' aria-label="size 3 select example">
            <option value="0">Todos</option>
            <option value="C">Celulares</option>
            <option value="L">LapTop</option>
            <option value="P">PC</option>
            <option value="I">Impresoras</option>
            <option value="V">Varios</option>
          </CFormSelect>
        </CCol>
        <CCol xs={5} md={5} className='mt-4'>
            <CButton color='info' style={{color:"white",marginRight:"10px"}} onClick={btnBuscar} > 
                <CIcon icon={cilSearch} />
                {' '}Buscar
            </CButton>
            <CButton color='primary' onClick={Nuevo}> 
                <CIcon icon={cilPlus} />
                {' '}Nuevo
            </CButton>

        </CCol>
        <CCol xs={3} md={3}>
            <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
          </CCol>        
      </CRow>
      {shDiv && (
          <>
          <CRow className="mt-4 mb-4" id="divTb">
              <DataTable
                columns={colEq}
                data={fEq}
                pagination
                persistTableHead
                subHeader
              />
            </CRow>
          </>
      )}
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
            <CCol xs={12} md={4}>
              <label>Categoria</label>
              <CFormSelect aria-label="Selecciona" value={txt_categoria} onChange={mCategoria} className='mt-1'>
                  <option value="-">Selecciona...</option>
                  <option value="Movil" >Móvil</option>
                  <option value="LapTop" >Lap Top</option>
                  <option value="PC" >Equipo PC</option>
                  <option value="Varios" >Varios</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12} md={4}>
              <label>Artículo</label>
              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="Artículo"
                placeholder="---"
                value={txt_articulo}
                onChange={h_articulo}
              />
            </CCol>
            <CCol xs={12} md={4}>
              <label>Marca</label>
              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="Marca"
                placeholder="---"
                value={txt_marca}
                onChange={h_marca}
              />
            </CCol>
          </CRow>
          <CRow className='mt-2 mb-2'>
            <CCol xs={12} md={4}>
              <label>Modelo</label>
              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="Modelo"
                placeholder="0"
                value={txt_modelo}
                onChange={h_modelo}
              />
            </CCol>
            <CCol xs={12} md={4}>
              <label>Estado</label>
              <CFormSelect aria-label="Selecciona" value={txt_estado} onChange={mEstado} className='mt-1'>
                  <option value="-">Selecciona...</option>
                  <option value="Bueno" >Bueno</option>
                  <option value="Regular" >Regular</option>
                  <option value="Mal" >Mal</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12} md={4}>
              <label>SN</label>
              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="SN"
                placeholder="---"
                value={txt_SN}
                onChange={h_SN}
              />
            </CCol>
          </CRow>
          <CRow className='mt-2 mb-2'>
            <CCol xs={12} md={4}>
              <label>IMEI</label>
              <CFormInput
                type="text"
                floatingClassName="mb-3"
                floatingLabel="IMEI"
                placeholder="-"
                value={txt_imei}
                onChange={h_imei}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={saveReg}>
            Agregar
          </CButton>
          <CButton color="secondary" onClick={() => setMNuevo(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Modal QR */}
      <CModal
        backdrop="static"
        size="sm"
        visible={mdlQR}
        onClose={() => setMQR(false)}
      >
        <CModalHeader>
          <CModalTitle>QR</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {qrText && (
            <CRow className='mt-2 mb-2'>
              <CCol xs={12} md={4}>
                <ReactQR id="qr-code-svg" value={qrText} size={256} />
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="info" onClick={downloadQR}>
            Descargar QR
          </CButton>
          <CButton color="secondary" onClick={() => setMQR(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
    </>
  )
}

export default Equipos
