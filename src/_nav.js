import React,{useEffect, useState} from 'react'
import Cookies from 'universal-cookie';
import CIcon from '@coreui/icons-react'
import {
  cilCursor,
  cilDrop,
  cilCalendarCheck,
  cilWallet,
  cilUser,
  cilCalculator,
  cilCalendar,
  cilCheck,
  cilGlobeAlt,
  cilGraph
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import axios from 'axios';


const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
const nav_ = [];
if(cookies.get('menus') != undefined)
  {
    setMenus();
  }else{
    Menus();
  }
async function Menus(){
  try{
    let confi_ax = 
      {
        headers:
        {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          "Authorization": "Bearer "+cookies.get('token'),
        }
      }
      //=======================================================
      await axios.get(baseUrl+'Login/GetMenus',confi_ax)
      .then(response=>{
        cookies.set('menus', JSON.stringify(response), {path: '/'});
        return response.data;
      }).then(response=>{
        //console.log("=>");
      })
      .catch(err=>{
        if (err.response) {
          // El servidor respondió con un código de estado fuera del rango de 2xx
          console.error('Error de Respuesta:', err.response.data);
          //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          //setError('Error: No se recibió respuesta del servidor.');
        } else {
          // Algo sucedió al configurar la solicitud
          console.error('Error:', err.message);
          //setError(`Error: ${err.message}`);
        }
      })
      //=======================================================
  }catch(error){

  }
}

async function setMenus(){
  var obj = cookies.get('menus');
  for(var x = 0; x < obj.data.length; x++)
    {
      nav_.push({
        component: CNavTitle,
        name:obj.data[x].descripcion,
      })
      await SubMenus(obj.data[x].mnuId);
    }
}
async function SubMenus(idMnu){
  try{
    let confi_ax = 
      {
        headers:
        {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          "Authorization": "Bearer "+cookies.get('token'),
        }
      }
      //=======================================================
      await axios.get(baseUrl+'Login/GetSubMenus/'+idMnu,confi_ax)
      .then(response=>{
        
        cookies.set('SubMenus', JSON.stringify(response.data), {path: '/'});
        var obj = response.data;
        for(var z = 0; z < obj.length;z++)
        {
          nav_.push({
            component: CNavItem,
            name: 'Admin',
            to: '/Ventas/admin',
            icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
          })
        }
      }).then(response=>{
        
      })
      .catch(err=>{
        if (err.response) {
          // El servidor respondió con un código de estado fuera del rango de 2xx
          console.error('Error de Respuesta:', err.response.data);
          //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          //setError('Error: No se recibió respuesta del servidor.');
        } else {
          // Algo sucedió al configurar la solicitud
          console.error('Error:', err.message);
          //setError(`Error: ${err.message}`);
        }
      })
      //=======================================================
  }catch(error){

  }
}

  const _nav = [
    {
      component: CNavTitle,
      name: 'Ventas',
    },
    {
      component: CNavGroup,
      name: 'Cotizaciones',
      to: '/theme/admin',
      icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
      items:[
        {
          component: CNavItem,
          name: 'Lista Cotizaciones',
          to: '/ventas/LCotizacion',
          icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Lista PreCotizaciones',
          to: '/ventas/LPreCotizacion',
          icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Cotizador',
          to: '/ventas/Cotizador',
          icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        }
      ]
    },
    {
      component: CNavGroup,
      name: 'Pedidos',
      to: '/theme/admin',
      icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
      items:[
        {
          component: CNavItem,
          name: 'Ver Pedidos',
          to: '/logistica/LPedidos',
          icon: <CIcon icon={cilCheck} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Pedidos en línea',
          to: '/logistica/PLinea',
          icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
        }
      ]
    },
    {
      component: CNavTitle,
      name: 'Produccion',
    },
    {
      component: CNavGroup,
      name: 'Inventarios',
      to: '/Inventario',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'CICAT Resumen',
          to: '/Cicat/Resumen',
        }
      ],
    },
    {
      component: CNavTitle,
      name: 'Administración',
    },
    {
      component: CNavGroup,
      name: 'Usuarios',
      to: '/base',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Permisos',
          to: '/permisos/Permisos',
        }
      ],
    },
    {
      component: CNavGroup,
      name: 'Extras',
      to: '/utils',
      icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'PreCierres',
          to: '/utils/PreCierres',
        },
        {
          component: CNavItem,
          name: 'INTERFAZ INTELISIS',
          to: '/utils/InterfazIntelisis',
        },
        {
          component: CNavItem,
          name: 'Actualizar Producción',
          to: '/utils/UpdateProd',
        },
        {
          component: CNavItem,
          name: 'Actualizar MB',
          to: '/utils/UpdateMB',
        }
      ],
    },
    {
      component: CNavTitle,
      name: 'REPORTES',
    },
    {
      component: CNavGroup,
      name: 'Logistica',
      to: '/Logistica',
      icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Pedidos',
          to: '/reportes/PedidosMetraje',
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Calidad',
      to: '/Calidad',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Costos Productos',
          to: '/reportes/CostosProductos',
        },
      ],
    },
  ]
export default _nav;
