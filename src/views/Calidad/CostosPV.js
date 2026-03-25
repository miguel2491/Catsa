import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { convertArrayOfObjectsToCSV, getCostosPV, getPrecioVol, updatePV, updateMasivo } from '../../Utilidades/Funciones';
import './CostosPV.css';
import { cilCloudDownload, cilCloudUpload, cilPen, cilSearch, cilTrash } from '@coreui/icons';
import {
  CContainer,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab,
  CFormSelect,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CFormLabel,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import BuscadorDT from '../base/parametros/BuscadorDT'

const SearchFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  // **************************************************************************************************************************************************************
  const [showP, setShowP] = useState(false);
  const [shDiv, setShDiv] = useState(false);
  const [shIPV, setShIPV] = useState(false);
  // **************************************************************************************************************************************************************
  // ARRAYS
  const [dtCostos, setDTCostos] = useState([]);
  const [exDes, setExDes] = useState([]);
  // **************************************************************************************************************************************************************
  
  //-------------------- MODALS -----------------------------
  const [mCotizaciones, setMCotizaciones] = useState(false);
  const [sgrupo, setSGrupo] = useState('');
  const [smaterial, setSMaterial] = useState('');
  const [sprecio, setSPrecio] = useState(0.00);
  const [sprecioFlete, setSPrecioFlete] = useState(0.00);
  const [spesoVol, setSPesoVol] = useState(0.00);
  const [spFlag, setSFlag] = useState(false);
  //---------------------------------------------------------
  //HANDLES
  const [PR, setPr] = useState(0);
  const [PRF, setPrF] = useState(0);
  const [PSV, setPv] = useState(0);
  // **************************************************************************************************************************************************************
  const mCambio = (event) => {
    const pla = event.target.value; 
    setPlantas(pla);
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
  //Buscador
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('');
  //DATATABLES
  const columns = [
    {
      name: 'Acciones',
      selector: row => row.id,
      width:"200px",
      cell: (row) => (
          <div>
              <CRow>
                <CCol xs={3} md={3} lg={3}>
                    <CButton
                        color="primary"
                        onClick={() => mEditar(row.Material, row.Grupo)}
                        size="sm"
                        className="me-2"
                        title="Editar"
                    >
                        <CIcon icon={cilPen} style={{'color':'white'}} />
                    </CButton>
                </CCol>
                <CCol xs={3} md={3} lg={3}>
                    <CButton
                        color="danger"
                        onClick={() => eliminar(1)}
                        size="sm"
                        className="me-2"
                        title="Eliminar"
                    >
                        <CIcon icon={cilTrash} style={{'color':'white'}} />
                    </CButton>
                </CCol>
                <CCol xs={3} md={3} lg={3}>
                    <CFormCheck id={`cbVBueno${row.Material}`} className='mt-4' style={{'width':'30px','height':'25px'}} checked={row.Flag_autorizado} onChange={(e) => toggleAutorizado(row.Material, e.target.checked)} />
                </CCol>
              </CRow>
          </div>
      ),
    },
    {
      name: 'Grupo',
      selector: (row) => row.Grupo,
      sortable: true,
    },
    {
      name: 'Material',
      selector: (row) => row.Material,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.Descripccion,
      width:"400px",
      sortable: true,
    },
    {
      name: 'Peso Vol',
      selector: (row) => row.PesoVol,
      sortable: true,
    },
    {
      name: 'Unidad',
      selector: (row) => row.Unidad,
      sortable: true,
    },
    {
      name: 'Precio',
      selector: (row) => row.PrecioMP,
      sortable: true,
    },
    {
      name: 'Flete',
      selector: (row) => row.PrecioFlete,
      sortable: true,
    },
    {
      name: 'Precio por Autorizar',
      selector: (row) => row.PrecioMP_,
      sortable: true,
    },
    {
      name: 'Flete por Autorizar',
      selector: (row) => row.PrecioFlete_,
      sortable: true,
    },
    {
      name: 'U. Compra',
      selector: (row) => row.UnidadCompra,
      sortable: true,
    },
    {
      name: 'Costo MP',
      selector: (row) => row.Costo,
      sortable: true,
    },
  ];
  // **************************************************************************************************************************************************************
  useEffect(() => {
    //getPlantasOp()
  }, []);
  // **************************************************************************************************************************************************************
  const getPlantasOp = async () => {
    try{
      setShDiv(true);
      const ocList = await getPrecioVol(plantasSel);
      if(ocList)
      {
        setDTCostos(ocList);
      }
        Swal.close();
    }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  const mEditar = async(material, grupo) =>{
    setMCotizaciones(true);
    const encontrado = dtCostos.find(
      item => item.Material === material && item.Grupo === grupo
    );

    if (encontrado) {
      setSGrupo(encontrado.Grupo);
      setSMaterial(encontrado.Material);
      setSPrecio(encontrado.PrecioMP);
      setSPrecioFlete(encontrado.PrecioFlete);
      setSPesoVol(encontrado.PesoVol);
      setSFlag(encontrado.Flag_autorizado);
      // aquí puedes manipular o usarlo
      if(encontrado.Grupo == "Arena" || encontrado.Grupo == "Cemento" || encontrado.Grupo == "Grava"){
        setShIPV(true)
      }else{
        setShIPV(false)
      }
    } else {
      console.log("No se encontró el material");
    }
  }
  // **************************************************************************************************************************************************************
  const handleSearch = () => {
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading();
            getCostosPV_()
        }
    });
  };
  const hPrecio = (e) => {
      setSPrecio(e.target.value);
  }
  const hPrecioF = (e) => {
      setSPrecioFlete(e.target.value);
  }
  const hPesoV = (e) => {
      setSPesoVol(e.target.value);
  }
  // **************************************************************************************************************************************************************
  const getCostosPV_ = async () => {
    try{
        const ocList = await getCostosPV(selectedPlant, selectedDate);
        if(ocList)
        {
            setDTDesigns(ocList);
            setExDes(ocList);
        }
        Swal.close();
    }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  };
  const toggleAutorizado = (material, status) => {
    setDTCostos(prev =>
    prev.map(item =>
      item.Material === material
        ? { ...item, Flag_autorizado: status }
        : item
    )
  );
  };
  const setUpdatePre = async() =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Modificando ...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try{
      const ocList = await updatePV(selectedPlant, sgrupo, smaterial, sprecio, sprecioFlete, spesoVol, spFlag);
      if(ocList)
      {
        Swal.close();
        Swal.fire(
          "Se ha modificado correctamente",
          "success"
        );
        getPlantasOp();
      }
    }catch(error){
      Swal.close();
      Swal.fire("Error al guardar", error.message, "error");
    }
  }
  
  const updMasivo = async() =>{
    Swal.fire({
      title: 'Cargando...',
      text: 'Actualizando Masivo ...',
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
    });
    try{
      const fecha = vFechaI;
      const ocList = await updateMasivo(fecha);
      if(ocList)
      {
        Swal.close();
        Swal.fire(
          "Se Actualizo Masivamente correctamente",
          "success"
        );
        getPlantasOp();
      }
    }catch(error){
      Swal.close();
      Swal.fire("Error al guardar", error.message, "error");
    }
  }
  // **************************************************************************************************************************************************************
  // Función de búsqueda
  const onFindBusqueda = (e) => {
    setBPlanta(e.target.value);
    setFText(e.target.value);
  };
  const fBusqueda = () => {
    
    if(vBPlanta.length != 0){
        const valFiltrados = dtDesigns.filter(dtDesigns => 
        dtDesigns.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
        );
        setDTDesigns(valFiltrados);
        setExDes(valFiltrados);
    }else{
        getCostosPV_()
    }
  };
  const fCostos = dtCostos.filter(item => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.Grupo.includes(fText) || item.Material.includes(fText);
  });
  // **************************************************************************************************************************************************************
  return (
      <CContainer fluid>
        <h3>Precios Materia Prima </h3>
        <CRow className='mt-3 mb-3'>
          <CCol xs={3} md={3}>
            <Plantas  
              mCambio={mCambio}
              plantasSel={plantasSel}
            />
          </CCol>
          <CCol xs={3} md={2}>
            <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
            />
          </CCol>
          <CCol xs={6} md={4} lg={4} className='mt-4'>
            <CButton color='primary' onClick={getPlantasOp} style={{'color':'white'}} > 
              <CIcon icon={cilSearch} />
              Buscar
            </CButton>
            <CButton color='warning' onClick={getPlantasOp} style={{'color':'white'}} > 
              <CIcon icon={cilCloudDownload} />
              Exportar
            </CButton>
            <CButton color='danger' onClick={updMasivo} style={{'color':'white'}} > 
              <CIcon icon={cilCloudUpload} />
              Actualizar Masivo
            </CButton>
          </CCol>
        </CRow>

        {shDiv && (
        <>
          <CRow className='mt-2 mb-2' id="divInfo">
            <CCol xs={3} md={3}>
              <BuscadorDT value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda} />
            </CCol>
          </CRow>
          <CRow className='mt-3 mb-3' id="divTb">
            <DataTable
              columns={columns}
              data={fCostos}
              pagination
              persistTableHead
              subHeader
            />
            
          {/* Modal para mostrar el MAPA con TODOS los puntos */}
          <CModal
            backdrop="static"
            visible={mCotizaciones}
            onClose={() => setMCotizaciones(false)}
          >
            <CModalHeader>
              <CModalTitle>MATERIAL </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTabs activeItemKey="cot">
                <CTabContent>
                  <CRow className='mt-2'>
                    <CCol xs={6} md={6}>
                      <CFormInput
                        type="text"
                        label="Grupo"
                        placeholder="0"
                        value={sgrupo}
                        disabled
                      />
                    </CCol>
                    <CCol xs={6} md={6}>
                      <CFormInput
                        type="text"
                        label="Material"
                        placeholder="0"
                        value={smaterial}
                        disabled
                      />
                    </CCol>
                  </CRow>
                  <CRow className='mt-2'>
                    <CCol xs={6} md={6}>
                      <CFormInput
                        type="text"
                        label="Precio"
                        placeholder="0"
                        value={sprecio}
                        onChange={hPrecio}
                      />
                    </CCol>
                    <CCol xs={6} md={6}>
                      <CFormInput
                        type="text"
                        label="Precio Flete"
                        placeholder="0"
                        value={sprecioFlete}
                        onChange={hPrecioF}
                      />
                    </CCol>
                  </CRow>
                  {shIPV && (
                  <CRow>
                    <CCol xs={6} md={6}>
                      <CFormInput
                        type="text"
                        label="Peso Vol."
                        placeholder="0"
                        value={spesoVol}
                        onChange={hPesoV}
                      />
                    </CCol>
                  </CRow>
                  )}
                  <CRow>
                    <CCol xs={6} md={6}>
                      <CFormCheck id="flag" className='mt-4' style={{'width':'30px','height':'25px'}} checked={spFlag} disabled />
                    </CCol>
                  </CRow>
                </CTabContent>
              </CTabs>
            </CModalBody>
            <CModalFooter>
              <CButton color="warning" onClick={() => setUpdatePre()}>
                Actualizar
              </CButton>
              <CButton color="danger" onClick={() => setMCotizaciones(false)}>
                Cerrar
              </CButton>
            </CModalFooter>
          </CModal>        
          </CRow>
        </>
        )}
      </CContainer>
  );
}

export default SearchFilters;
