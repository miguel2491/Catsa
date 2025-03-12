import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

import { GetUsuarios } from '../../../Utilidades/Funciones';
const Usuarios = ({ usuarioSel, onCambioUsuario }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sugerencias, setSugerencias] = useState([]);

  useEffect(() => {
    const savedUsuarios = cookies.get('usuarios');
    if (savedUsuarios) {
      const parsedUsuarios = JSON.parse(savedUsuarios);
      setUsuarios(parsedUsuarios);
    } else {
      getUsuarios_();
    }
  }, []);

  const getUsuarios_ = async() => {
    try {
      const ocList = await GetUsuarios();
      if(ocList)
      {
        cookies.set('usuarios', JSON.stringify(data), { path: '/' });
        setUsuarios(data); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const valor = e.target.value;
    setFiltro(valor);

    if (valor.trim() === '') {
      setSugerencias([]);
      return;
    }

    // Filtrar usuarios que coincidan con el texto
    const sugerenciasFiltradas = usuarios.filter(u =>
      u.UserName.toLowerCase().includes(valor.toLowerCase())
    );
    setSugerencias(sugerenciasFiltradas);
  };

  const seleccionarUsuario = (usuario) => {
    // Llamamos al callback para actualizar el usuario seleccionado en App
    onCambioUsuario(usuario.UserId);
    // Ajustamos el filtro al nombre seleccionado y vaciamos sugerencias
    setFiltro(usuario.UserName);
    setSugerencias([]);
  };

  return (
    <div>
      <label>Seleccione Usuario:</label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={filtro}
          onChange={handleChange}
          placeholder="Escriba para filtrar usuarios..."
        />
        {sugerencias.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 999,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            margin: 0,
            padding: '5px',
            width: '100%'
          }}>
            {sugerencias.map((usuario, index) => (
              <li
                key={index}
                style={{ cursor: 'pointer', padding: '5px' }}
                onClick={() => seleccionarUsuario(usuario)}
              >
                {usuario.UserName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
