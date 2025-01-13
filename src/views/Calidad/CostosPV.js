import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import './CostosPV.css';

function SearchFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');

  // Ejemplo de columnas para la DataTable
  const columns = [
    {
      name: 'Encabezado 1',
      selector: (row) => row.encabezado1,
      sortable: true, // Podemos habilitar el ordenamiento
    },
    {
      name: 'Encabezado 2',
      selector: (row) => row.encabezado2,
      sortable: true,
    },
    {
      name: 'Encabezado 3',
      selector: (row) => row.encabezado3,
      sortable: true,
    },
  ];

  // Ejemplo de datos (puedes reemplazarlos con tu data real)
  const data = [
    { id: 1, encabezado1: 'Dato 1', encabezado2: 'Dato 2', encabezado3: 'Dato 3' },
    { id: 2, encabezado1: 'Dato 4', encabezado2: 'Dato 5', encabezado3: 'Dato 6' },
    { id: 3, encabezado1: 'Dato 7', encabezado2: 'Dato 8', encabezado3: 'Dato 9' },
  ];

  const handleSearch = () => {
    // Aquí puedes manejar la lógica de búsqueda con los 3 parámetros
    // Por ejemplo, hacer un fetch a tu API con {searchTerm, selectedDate, selectedPlant}
    console.log('Búsqueda con:', searchTerm, selectedDate, selectedPlant);
  };

  return (
    <div>
      <h2>Costos PV</h2>

      {/* Filtros */}
      <div className="filters">
        {/* Autocomplete */}
        <div className="filter-group">
          <label htmlFor="autocomplete">Autocomplete:</label>
          <input
            id="autocomplete"
            type="text"
            list="search-options"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe para autocompletar..."
          />
          <datalist id="search-options">
            <option value="Opción 1" />
            <option value="Opción 2" />
            <option value="Opción 3" />
            <option value="Opción 4" />
          </datalist>
        </div>

        {/* Selección de fecha */}
        <div className="filter-group">
          <label htmlFor="date">Fecha:</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Selección de planta */}
        <div className="filter-group">
          <label htmlFor="plant">Planta:</label>
          <select
            id="plant"
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
          >
            <option value="">Seleccionar planta</option>
            <option value="Planta A">Planta A</option>
            <option value="Planta B">Planta B</option>
            <option value="Planta C">Planta C</option>
          </select>
        </div>

        {/* Botón de búsqueda */}
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={data}
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
