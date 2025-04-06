import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { convertArrayOfObjectsToCSV, getCostosPV, getPlantas } from '../../Utilidades/Funciones';
import './CostosPV.css';
import { CRow } from '@coreui/react';
import { cilSearch } from '@coreui/icons';

const SearchFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [plantasSel , setPlantas] = useState('');
  // **************************************************************************************************************************************************************
  const [showP, setShowP] = useState(false);
  // **************************************************************************************************************************************************************
  // ARRAYS
  const [dtDesigns, setDTDesigns] = useState([]);
  const [exDes, setExDes] = useState([]);
  // **************************************************************************************************************************************************************
  const mCambio = (event) => {
    const pla = event.target.value; 
    setPlantas(pla);
  };
  //Buscador
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('');
  const columns = [
    {
      name: 'Planta',
      selector: (row) => row.Planta,
      sortable: true,
    },
    {
      name: 'Mezcla',
      selector: (row) => row.Mezcla,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.Descripcion,
      sortable: true,
    },
    {
      name: 'UOM',
      selector: (row) => row.UOM,
      sortable: true,
    },
    {
      name: 'Fecha Modificación',
      selector: (row) => row.UOM,
      sortable: true,
    },
    {
      name: 'Material',
      selector: (row) => row.Material,
      sortable: true,
    },
    {
      name: 'Cantidad',
      selector: (row) => row.Cantidad,
      sortable: true,
    },
    {
      name: 'Unidad',
      selector: (row) => row.Unidad,
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
        const ocList = await getPlantas();
        console.log(ocList)
        if(ocList)
        {
          setPlantas_(ocList);
        }
        Swal.close();
    }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  }
  // **************************************************************************************************************************************************************
  const handleSearch = () => {
    console.log('Búsqueda con:', selectedDate, selectedPlant);
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading();
            getCostosPV_()
        }
    });
  };
  const getCostosPV_ = async () => {
    try{
        const ocList = await getCostosPV(selectedPlant, selectedDate);
        console.log(ocList)
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
  const fDesign = dtDesigns.filter(item => {
      // Filtrar por planta, interfaz y texto de búsqueda
      return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.Mezcla.includes(fText) || item.Material.includes(fText);
  });
  // **************************************************************************************************************************************************************
  return (
    <>
      <CContainer fluid>
        <h3>Costos PV </h3>
        <CRow className='mt-3 mb-3'>
          <CCol xs={6} md={2}>
            
          </CCol>
          {showP && (
            <>
              <CCol xs={6} md={2}>
                <Plantas  
                  mCambio={mCambio}
                  plantasSel={plantasSel}
                />
              </CCol>
            </>
          )}
          <CCol xs={6} md={2} lg={2} className='mt-4'>
            <CButton color='primary' onClick={getPlantasOp} style={{'color':'white'}} > 
              <CIcon icon={cilSearch} />
              Buscar
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </>
    // <div>  
    //   <h2>Costos PV</h2>
    //   {/* Filtros */}
    //   <div className="filters">
    //     {/* Autocomplete */}
    //     <div className="filter-group">
    //       <label htmlFor="autocomplete">Autocomplete:</label>
    //       <input
    //         id="autocomplete"
    //         type="text"
    //         list="search-options"
    //         value={vBPlanta} onChange={onFindBusqueda} onSearch={fBusqueda}
    //         placeholder="Escribe para autocompletar..."
    //       />
    //     </div>

    //     {/* Selección de fecha */}
    //     <div className="filter-group">
    //       <label htmlFor="date">Fecha:</label>
    //       <input
    //         id="date"
    //         type="date"
    //         value={selectedDate}
    //         onChange={(e) => setSelectedDate(e.target.value)}
    //       />
    //     </div>

    //     {/* Selección de planta */}
    //     <div className="filter-group">
    //       <label htmlFor="plant">Planta:</label>
    //       <select
    //         id="plant"
    //         value={selectedPlant}
    //         onChange={(e) => setSelectedPlant(e.target.value)}
    //       >
    //         <option value="">Seleccionar planta</option>
    //         {opPlants.map(planta =>(
    //             <option value={planta.IdPlanta} key={planta.ID}>{planta.Planta}</option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* Botón de búsqueda */}
    //     <button onClick={handleSearch}>Buscar</button>
    //   </div>

    //   {/* Data Table */}
    //   <div className="table-container">
    //     <DataTable
    //       columns={columns}
    //       data={fDesign}
    //       keyField="id"
    //       pagination
    //       responsive
    //       highlightOnHover
    //       pointerOnHover
    //     />
    //   </div>
    // </div>
  );
}

export default SearchFilters;
