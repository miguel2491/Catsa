import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { convertArrayOfObjectsToCSV, getCostosPV, getPlantas } from '../../Utilidades/Funciones';
import './Formulaciones.css';

function SearchFilters() {
  // Estado para la planta seleccionada
  const [selectedPlant, setSelectedPlant] = useState('');

  // Estado para la lista de plantas
  const [opPlants, setPlantas_] = useState([]);

  // Estados para la DataTable
  const [dtDesigns, setDTDesigns] = useState([]);
  const [exDes, setExDes] = useState([]);

  // Definición de columnas para la DataTable
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

  // Cargar opciones de plantas al montar el componente
  useEffect(() => {
    getPlantasOp();
  }, []);

  const getPlantasOp = async () => {
    try {
      const ocList = await getPlantas();
      if (ocList) {
        setPlantas_(ocList);
      }
      Swal.close();
    } catch (error) {
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información de plantas", "error");
    }
  };

  // Evento que se llama al presionar "Buscar"
  const handleSearch = () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Estamos obteniendo la información...',
      didOpen: () => {
        Swal.showLoading();
        getCostosPV_();
      }
    });
  };

  // Llamada a la función que obtiene los datos (filtrando por planta)
  const getCostosPV_ = async () => {
    try {
      const ocList = await getCostosPV(selectedPlant);
      if (ocList) {
        setDTDesigns(ocList);
        setExDes(ocList);
      }
      Swal.close();
    } catch (error) {
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  };

  return (
    <div>
      <h2>Formulaciones</h2>

      {/* Filtros */}
      <div className="filters">
        {/* Selección de planta */}
        <div className="filter-group">
          <label htmlFor="plant">Planta:</label>
          <select
            id="plant"
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
          >
            <option value="">Seleccionar planta</option>
            {opPlants.map(planta => (
              <option value={planta.IdPlanta} key={planta.ID}>{planta.Planta}</option>
            ))}
          </select>
        </div>

        {/* Botón de búsqueda */}
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={dtDesigns}
          keyField="id"
          pagination
          responsive
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
}

export default SearchFilters;
