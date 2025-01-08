import React, { useState, useEffect } from 'react';
import './permisos.css';
import axios from 'axios';
import Usuarios from '../base/parametros/Usuarios.js';

function App() {
  // ENDPOINTS
  const baseUrl = "http://apicatsa.catsaconcretos.mx:2543/api/";
  const getRolesUser = (userId) => axios.get(`${baseUrl}Usuarios/GetRolesUser/${userId}`);
  const getPermisosUser = (userId) => axios.get(`${baseUrl}Usuarios/GetPermisosUser/${userId}`);

  // Nuevos endpoints globales
  const getAllPermisos = () => axios.get(`${baseUrl}Usuarios/GetPermisos`);
  const getAllRoles = () => axios.get(`${baseUrl}Login/GetRoles`);

  // Estados globales con todos los roles y permisos disponibles (cargados al montar)
  const [allPermissions, setAllPermissions] = useState([]);
  const [allRoles, setAllRoles] = useState([]);

  // Estados de los paneles. 
  // - permissions: los que se muestran en el panel de permisos
  // - roles: los que se muestran en el panel de roles
  // - personItems: items asignados al usuario seleccionado
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [personItems, setPersonItems] = useState([]);

  // Estado para el usuario seleccionado (userId)
  const [usuarioSel, setUsuarioSel] = useState('');

  // 1) Al **montar** el componente, llamamos a ambas APIs (GetPermisos y GetRoles)
  // para tener los catálogos completos.
  useEffect(() => {
    // Llamamos a ambas en paralelo
    Promise.all([getAllPermisos(), getAllRoles()])
      .then(([permisosResp, rolesResp]) => {
        // permisosResp.data => [
        //   { id, id_rol, descripcion, categoria, estatus },
        //   ...
        // ]
        const todosLosPermisos = permisosResp.data.map((p) => ({
          id: p.id,
          name: p.descripcion,
          type: 'permission'
        }));

        // rolesResp.data => [
        //   { roleId, roleName, ... },
        //   ...
        // ]
        const todosLosRoles = rolesResp.data.map((r) => ({
          id: r.roleId,
          name: r.roleName,
          type: 'role'
        }));

        // Guardamos en estados globales
        setAllPermissions(todosLosPermisos);
        setAllRoles(todosLosRoles);

        // Inicializamos los paneles con todo el catálogo
        setPermissions(todosLosPermisos);
        setRoles(todosLosRoles);
      })
      .catch((error) => {
        console.error('Error cargando roles/permisos globales:', error);
      });
  }, []);

  // 2) Cada vez que cambia el usuario seleccionado, cargamos los roles y permisos 
  // que YA tiene (para ponerlos en el panel de "Persona").
  useEffect(() => {
    if (!usuarioSel) {
      // Si no hay usuario seleccionado, limpiamos el panel Persona
      setPersonItems([]);
      return;
    }

    // Cargamos roles/permisos del usuario
    Promise.all([
      getRolesUser(usuarioSel),
      getPermisosUser(usuarioSel),
    ])
      .then(([rolesResp, permsResp]) => {
        // rolesResp.data => [ { RoleId, RoleName }, ... ]
        const userRoles = rolesResp.data.map(r => ({
          id: r.RoleId,
          name: r.RoleName,
          type: 'role'
        }));

        // permsResp.data => [ { PermissionId, PermissionName }, ... ]
        const userPerms = permsResp.data.map(p => ({
          id: p.PermissionId,
          name: p.PermissionName,
          type: 'permission'
        }));

        // Asignamos al panel de Persona (unimos roles + permisos del user)
        setPersonItems([...userRoles, ...userPerms]);

        // OPCIONAL: Remover del panel "general" (roles/permisos) 
        // lo que el usuario ya tiene para evitar duplicados.
        setRoles(allRoles.filter(
          (rol) => !userRoles.some((ur) => ur.name === rol.name)
        ));

        setPermissions(allPermissions.filter(
          (perm) => !userPerms.some((up) => up.name === perm.name)
        ));
      })
      .catch(error => {
        console.error('Error cargando roles/permisos del usuario:', error);
        setPersonItems([]);
      });

  // Agregamos al array de dependencias: 
  // - usuarioSel, para recargar cada vez que cambie 
  // - allRoles y allPermissions, para tener datos correctos al filtrar
  }, [usuarioSel, allRoles, allPermissions]);

  // Callback: cuando el autocomplete de usuario cambia
  const handleCambioUsuario = (userId) => {
    setUsuarioSel(userId);

    // Cada vez que se cambie de usuario, restauramos 
    // los catálogos completos a los paneles principales.
    setPermissions(allPermissions);
    setRoles(allRoles);
  };

  // DRAG & DROP
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('itemName', item.name);
    e.dataTransfer.setData('itemType', item.type);
    if (item.id) {
      e.dataTransfer.setData('itemId', item.id);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPanel) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData('itemName');
    const itemType = e.dataTransfer.getData('itemType');
    const itemId = e.dataTransfer.getData('itemId');

    // Determinar panel de origen
    let sourcePanel = null;
    if (permissions.find((i) => i.name === itemName && i.type === itemType)) {
      sourcePanel = 'permissions';
    } else if (roles.find((i) => i.name === itemName && i.type === itemType)) {
      sourcePanel = 'roles';
    } else if (personItems.find((i) => i.name === itemName && i.type === itemType)) {
      sourcePanel = 'person';
    }

    if (!sourcePanel) return;

    // Evitar movimiento inválido
    if ((itemType === 'permission' && targetPanel === 'roles') ||
        (itemType === 'role' && targetPanel === 'permissions')) {
      alert('Movimiento no permitido.');
      return;
    }

    if (sourcePanel === targetPanel) {
      return;
    }

    // 1) Remover del panel de origen
    if (sourcePanel === 'permissions') {
      setPermissions(prev => prev.filter((i) => i.name !== itemName || i.type !== itemType));
    } else if (sourcePanel === 'roles') {
      setRoles(prev => prev.filter((i) => i.name !== itemName || i.type !== itemType));
    } else if (sourcePanel === 'person') {
      setPersonItems(prev => prev.filter((i) => i.name !== itemName || i.type !== itemType));
    }

    // 2) Agregar al panel de destino
    if (targetPanel === 'permissions') {
      setPermissions(prev => [...prev, { id: itemId, name: itemName, type: itemType }]);
    } else if (targetPanel === 'person') {
      if (!usuarioSel) {
        alert('Primero seleccione un usuario antes de asignar elementos.');
        return;
      }
      setPersonItems(prev => [...prev, { id: itemId, name: itemName, type: itemType }]);
      // Aquí podrías llamar a una API para asignar el rol/permiso al usuario
    } else if (targetPanel === 'roles') {
      setRoles(prev => [...prev, { id: itemId, name: itemName, type: itemType }]);
    }
  };

  return (
    <div className="app-container">
      <h2>Asignación de Permisos y Roles</h2>

      {/* Sección de usuario */}
      <div className="user-section">
        <Usuarios usuarioSel={usuarioSel} onCambioUsuario={handleCambioUsuario} />
      </div>

      <div className="container">
        {/* Panel de Permisos (dinámico desde la API GetPermisos) */}
        <div
          className="drop-zone"
          onDrop={(e) => handleDrop(e, 'permissions')}
          onDragOver={handleDragOver}
        >
          <h3>Permisos</h3>
          {permissions.map((item, index) => (
            <div
              key={index}
              className={`draggable-item draggable-permission`}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Panel de Persona (roles + permisos que tiene el user) */}
        <div
          className="drop-zone"
          onDrop={(e) => handleDrop(e, 'person')}
          onDragOver={handleDragOver}
        >
          <h3>Persona {usuarioSel ? `(Usuario ID: ${usuarioSel})` : ''}</h3>
          {personItems.map((item, index) => (
            <div
              key={index}
              className={
                item.type === 'permission'
                  ? 'draggable-item draggable-permission'
                  : 'draggable-item draggable-role'
              }
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Panel de Roles (dinámico desde la API GetRoles) */}
        <div
          className="drop-zone"
          onDrop={(e) => handleDrop(e, 'roles')}
          onDragOver={handleDragOver}
        >
          <h3>Roles</h3>
          {roles.map((item, index) => (
            <div
              key={index}
              className={`draggable-item draggable-role`}
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
