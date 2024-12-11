import React, { useState } from 'react';
import './permisos.css';

function App() {
  // Inicializamos permisos y roles como objetos con nombre y tipo
  const initialPermissions = [
    { name: 'Ventas', type: 'permission' },
    { name: 'Finanzas', type: 'permission' },
    { name: 'Produccion', type: 'permission' },
    { name: 'Mantenimiento', type: 'permission' },
    { name: 'Admin', type: 'permission' },
    { name: 'Calidad', type: 'permission' },
    { name: 'Logistica', type: 'permission' },
    { name: 'Facturacion', type: 'permission' },
    { name: 'Indicadores', type: 'permission' },
  ];

  const initialRoles = [
    { name: 'Admin', type: 'role' },
    { name: 'AdminCICAT', type: 'role' },
    { name: 'AdminCOT', type: 'role' },
    { name: 'AdminQM', type: 'role' },
    { name: 'AdminQMPV', type: 'role' },
    { name: 'Bloquera', type: 'role' },
    { name: 'BodegaCA', type: 'role' },
    { name: 'Calidad', type: 'role' },
    { name: 'Contador Planta', type: 'role' },
    { name: 'Cordinador Calidad', type: 'role' },
    { name: 'Credito Cobranza', type: 'role' },
    { name: 'Cuentas Pagar', type: 'role' },
    { name: 'C y C', type: 'role' },
    { name: 'Direccion', type: 'role' },
    { name: 'Dosificador', type: 'role' },
    { name: 'Finanzas', type: 'role' },
    { name: 'Gerente Planta', type: 'role' },
    { name: 'Jefe Planta', type: 'role' },
    { name: 'Laboratorista', type: 'role' },
    { name: 'LOG', type: 'role' },
    { name: 'Mantenimiento', type: 'role' },
    { name: 'Operaciones', type: 'role' },
    { name: 'Programador', type: 'role' },
    { name: 'Recursos Humanos', type: 'role' },
    { name: 'Regional', type: 'role' },
    { name: 'Vendedor', type: 'role' },
    { name: 'Vendedor Externo', type: 'role' },
  ];

  const [permissions, setPermissions] = useState(initialPermissions);
  const [personItems, setPersonItems] = useState([]);
  const [roles, setRoles] = useState(initialRoles);

  const handleDragStart = (e, item) => {
    // Guardamos el nombre y tipo del ítem
    e.dataTransfer.setData('itemName', item.name);
    e.dataTransfer.setData('itemType', item.type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPanel) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData('itemName');
    const itemType = e.dataTransfer.getData('itemType');

    // Obtener el panel de origen buscando el ítem
    let sourcePanel = null;
    if (permissions.find((i) => i.name === itemName && i.type === itemType)) {
      sourcePanel = 'permissions';
    } else if (roles.find((i) => i.name === itemName && i.type === itemType)) {
      sourcePanel = 'roles';
    } else if (personItems.find((i) => i.name === itemName && i.type === itemType)) {
      sourcePanel = 'person';
    }

    // Si no se encontró el ítem en ningún panel, no hacemos nada
    if (!sourcePanel) return;

    // Evitar movimiento inválido:
    // - No mover permisos al panel de roles ni roles al panel de permisos
    if ((itemType === 'permission' && targetPanel === 'roles') ||
        (itemType === 'role' && targetPanel === 'permissions')) {
      alert('Movimiento no permitido.');
      return;
    }

    // Si el panel de origen y el destino son el mismo, no hacer nada
    if (sourcePanel === targetPanel) {
      return;
    }

    // Remover el ítem del panel de origen
    if (sourcePanel === 'permissions') {
      setPermissions((prev) => prev.filter((i) => i.name !== itemName || i.type !== itemType));
    } else if (sourcePanel === 'roles') {
      setRoles((prev) => prev.filter((i) => i.name !== itemName || i.type !== itemType));
    } else if (sourcePanel === 'person') {
      setPersonItems((prev) => prev.filter((i) => i.name !== itemName || i.type !== itemType));
    }

    // Agregar el ítem al panel de destino
    if (targetPanel === 'permissions') {
      setPermissions((prev) => [...prev, { name: itemName, type: itemType }]);
    } else if (targetPanel === 'person') {
      setPersonItems((prev) => [...prev, { name: itemName, type: itemType }]);
    } else if (targetPanel === 'roles') {
      setRoles((prev) => [...prev, { name: itemName, type: itemType }]);
    }
  };

  return (
    <div className="app-container">
      <h2>Asignación de Permisos y Roles</h2>
      <div className="container">
        {/* Panel de Permisos */}
        <div
          className="drop-zone"
          onDrop={(e) => handleDrop(e, 'permissions')}
          onDragOver={handleDragOver}
        >
          <h3>Permisos</h3>
          {permissions.map((item, index) => (
            <div
              key={index}
              className="draggable-item"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Panel de Persona */}
        <div
          className="drop-zone"
          onDrop={(e) => handleDrop(e, 'person')}
          onDragOver={handleDragOver}
        >
          <h3>Persona</h3>
          {personItems.map((item, index) => (
            <div
              key={index}
              className="draggable-item"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Panel de Roles */}
        <div
          className="drop-zone"
          onDrop={(e) => handleDrop(e, 'roles')}
          onDragOver={handleDragOver}
        >
          <h3>Roles</h3>
          {roles.map((item, index) => (
            <div
              key={index}
              className="draggable-item"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
