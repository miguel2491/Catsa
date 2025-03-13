import React, { useState } from "react";
import "./AddObjCom.css";

function ObjetivoComercial() {
  // -------------------------------
  // ESTADOS
  // -------------------------------
  // Campos principales
  const [asesor, setAsesor] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [mes, setMes] = useState("");
  const [planta, setPlanta] = useState("");

  // Estados para sugerencias
  const [showAsesorSug, setShowAsesorSug] = useState(false);
  const [filteredAsesor, setFilteredAsesor] = useState([]);

  const [showPeriodoSug, setShowPeriodoSug] = useState(false);
  const [filteredPeriodo, setFilteredPeriodo] = useState([]);

  const [showMesSug, setShowMesSug] = useState(false);
  const [filteredMes, setFilteredMes] = useState([]);

  const [showPlantaSug, setShowPlantaSug] = useState(false);
  const [filteredPlanta, setFilteredPlanta] = useState([]);

  // Campos para modificar / agregar
  const [objetivoDG, setObjetivoDG] = useState("");
  const [perspectivaComercial, setPerspectivaComercial] = useState("");
  const [proyeccionComercial, setProyeccionComercial] = useState("");
  const [proyeccionComercialDIREC, setProyeccionComercialDIREC] =
    useState("");

  const [busquedaCompletada, setBusquedaCompletada] = useState(false);

  // -------------------------------
  // FUNCIONES DE AUTOCOMPLETADO
  // -------------------------------
  const handleChangeAsesor = async (e) => {
    const entrada = e.target.value;
    setAsesor(entrada);

    if (entrada.length === 0) {
      setShowAsesorSug(false);
      return;
    }

    try {
      // Llamada a la API para obtener asesores
      const response = await fetch(
        `https://api.miapp.com/asesores?search=${entrada}`
      );
      if (!response.ok) throw new Error("Error al obtener asesores");
      const data = await response.json();

      setFilteredAsesor(data);
      setShowAsesorSug(true);
    } catch (error) {
      console.error(error);
      setShowAsesorSug(false);
    }
  };

  const selectAsesor = (valor) => {
    setAsesor(valor);
    setShowAsesorSug(false);
  };

  // -- Periodo
  const handleChangePeriodo = async (e) => {
    const entrada = e.target.value;
    setPeriodo(entrada);

    if (entrada.length === 0) {
      setShowPeriodoSug(false);
      return;
    }

    try {
      // Llamada a la API para obtener periodos
      const response = await fetch(
        `https://api.miapp.com/periodos?search=${entrada}`
      );
      if (!response.ok) throw new Error("Error al obtener periodos");
      const data = await response.json();

      setFilteredPeriodo(data);
      setShowPeriodoSug(true);
    } catch (error) {
      console.error(error);
      setShowPeriodoSug(false);
    }
  };

  const selectPeriodo = (valor) => {
    setPeriodo(valor);
    setShowPeriodoSug(false);
  };

  // -- Mes
  const handleChangeMes = async (e) => {
    const entrada = e.target.value;
    setMes(entrada);

    if (entrada.length === 0) {
      setShowMesSug(false);
      return;
    }

    try {
      // Llamada a la API para obtener meses
      const response = await fetch(
        `https://api.miapp.com/meses?search=${entrada}`
      );
      if (!response.ok) throw new Error("Error al obtener meses");
      const data = await response.json();

      setFilteredMes(data);
      setShowMesSug(true);
    } catch (error) {
      console.error(error);
      setShowMesSug(false);
    }
  };

  const selectMes = (valor) => {
    setMes(valor);
    setShowMesSug(false);
  };

  // -- Planta
  const handleChangePlanta = async (e) => {
    const entrada = e.target.value;
    setPlanta(entrada);

    if (entrada.length === 0) {
      setShowPlantaSug(false);
      return;
    }

    try {
      // Llamada a la API para obtener plantas
      const response = await fetch(
        `https://api.miapp.com/plantas?search=${entrada}`
      );
      if (!response.ok) throw new Error("Error al obtener plantas");
      const data = await response.json();

      setFilteredPlanta(data);
      setShowPlantaSug(true);
    } catch (error) {
      console.error(error);
      setShowPlantaSug(false);
    }
  };

  const selectPlanta = (valor) => {
    setPlanta(valor);
    setShowPlantaSug(false);
  };

  // -------------------------------
  // FUNCIONES DE BÚSQUEDA Y GUARDAR
  // -------------------------------
  const handleSearch = () => {
    console.log("Buscando con:", asesor, periodo, mes, planta);
    // lógica de búsqueda o llamada a tu API real
    // filtrar datos, traer un registro específico, etc.

    setBusquedaCompletada(true);
  };

  const handleSave = () => {
    const dataAGuardar = {
      asesor,
      periodo,
      mes,
      planta,
      objetivoDG,
      perspectivaComercial,
      proyeccionComercial,
      proyeccionComercialDIREC,
    };
    console.log("Guardando los siguientes datos:", dataAGuardar);


    // fetch('https://api.miapp.com/objetivo-comercial', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataAGuardar)
    // })
    // .then(response => response.json())
    // .then(resultado => console.log(resultado))
    // .catch(error => console.error(error));
  };

  // -------------------------------
  // RENDERIZADO
  // -------------------------------
  return (
    <div className="container">
      <h2 className="heading">Agregar Objetivo Comercial</h2>

      {/* Sección de Búsqueda en una sola línea */}
      <div className="searchSection">
        {/* ASESOR */}
        <div className="formGroup">
          <label className="label">Asesor</label>
          <input
            className="input"
            type="text"
            value={asesor}
            onChange={handleChangeAsesor}
            placeholder="Nombre del asesor"
          />
          {/* Sugerencias Asesor */}
          {showAsesorSug && filteredAsesor.length > 0 && (
            <ul className="suggestionsList">
              {filteredAsesor.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => selectAsesor(item)}
                  className="suggestionItem"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PERIODO */}
        <div className="formGroup">
          <label className="label">Periodo</label>
          <input
            className="input"
            type="text"
            value={periodo}
            onChange={handleChangePeriodo}
            placeholder="Ej. 2023 - 2024"
          />
          {/* Sugerencias Periodo */}
          {showPeriodoSug && filteredPeriodo.length > 0 && (
            <ul className="suggestionsList">
              {filteredPeriodo.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => selectPeriodo(item)}
                  className="suggestionItem"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* MES */}
        <div className="formGroup">
          <label className="label">Mes</label>
          <input
            className="input"
            type="text"
            value={mes}
            onChange={handleChangeMes}
            placeholder="Ej. Enero, Febrero..."
          />
          {/* Sugerencias Mes */}
          {showMesSug && filteredMes.length > 0 && (
            <ul className="suggestionsList">
              {filteredMes.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => selectMes(item)}
                  className="suggestionItem"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PLANTA */}
        <div className="formGroup">
          <label className="label">Planta</label>
          <input
            className="input"
            type="text"
            value={planta}
            onChange={handleChangePlanta}
            placeholder="Nombre de planta"
          />
          {/* Sugerencias Planta */}
          {showPlantaSug && filteredPlanta.length > 0 && (
            <ul className="suggestionsList">
              {filteredPlanta.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => selectPlanta(item)}
                  className="suggestionItem"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="buttonSearch" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {/* Mostramos esta sección solo si la búsqueda se ha completado */}
      {busquedaCompletada && (
        <div>
          <h3 className="sectionTitle">Modificar Datos</h3>

          <div className="formGroup">
            <label className="label">Objetivo DG:</label>
            <input
              className="input"
              type="text"
              value={objetivoDG}
              onChange={(e) => setObjetivoDG(e.target.value)}
              placeholder="Ingresa el objetivo DG"
            />
          </div>

          <div className="formGroup">
            <label className="label">Perspectiva Comercial:</label>
            <input
              className="input"
              type="text"
              value={perspectivaComercial}
              onChange={(e) => setPerspectivaComercial(e.target.value)}
              placeholder="Ingresa perspectiva comercial"
            />
          </div>

          <div className="formGroup">
            <label className="label">Proyección Comercial:</label>
            <input
              className="input"
              type="text"
              value={proyeccionComercial}
              onChange={(e) => setProyeccionComercial(e.target.value)}
              placeholder="Ingresa proyección comercial"
            />
          </div>

          <div className="formGroup">
            <label className="label">Proyección Comercial DIREC:</label>
            <input
              className="input"
              type="text"
              value={proyeccionComercialDIREC}
              onChange={(e) => setProyeccionComercialDIREC(e.target.value)}
              placeholder="Ingresa proyección comercial DIREC"
            />
          </div>

          {/* Botón Guardar */}
          <button className="button" onClick={handleSave}>
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}

export default ObjetivoComercial;
