import React, { useEffect, useState } from "react";
import '../Calidad/CrearLote.css';


const TomaDeMuestras = ({ onConfirm }) => {
  const [remision, setRemision] = useState('');
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [sampleType, setSampleType] = useState('cubo');

  // Carga de plantas desde la API
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const response = await fetch('/api/plants'); // TODO: reemplaza con tu endpoint real
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error('Error al obtener plantas:', error);
      }
    };

    loadPlants();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      remision,
      planta: selectedPlant,
      tipoMuestra: sampleType,
    };
    if (onConfirm) onConfirm(payload);
  };

  return (
    <section className="toma-de-muestras">
      <h2>Toma de muestras</h2>

      <form onSubmit={handleSubmit} className="toma-de-muestras__form">
        {/* Remisión */}
        <div className="form-group">
          <label htmlFor="remision">Remisión</label>
          <input
            id="remision"
            type="text"
            value={remision}
            onChange={(e) => setRemision(e.target.value)}
            placeholder="Ingresa la remisión"
            required
          />
        </div>

        {/* Filtro por planta */}
        <div className="form-group">
          <label htmlFor="planta">Planta</label>
          <select
            id="planta"
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona una planta
            </option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de muestra */}
        <fieldset className="form-group">
          <legend>Tipo de muestra</legend>
          <label>
            <input
              type="radio"
              name="sampleType"
              value="cubo"
              checked={sampleType === 'cubo'}
              onChange={() => setSampleType('cubo')}
            />
            Cubo
          </label>
          <label>
            <input
              type="radio"
              name="sampleType"
              value="cilindro"
              checked={sampleType === 'cilindro'}
              onChange={() => setSampleType('cilindro')}
            />
            Cilindro
          </label>
          <label>
            <input
              type="radio"
              name="sampleType"
              value="ambos"
              checked={sampleType === 'ambos'}
              onChange={() => setSampleType('ambos')}
            />
            Ambos
          </label>
        </fieldset>

        {/* Botón de confirmación */}
        <button type="submit" className="btn-confirmar">
          Confirmar búsqueda
        </button>
      </form>
    </section>
  );
};

export default TomaDeMuestras;
