import React,{ useRef, useState, useEffect } from 'react'
import axios from "axios";
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import {baseUrl} from '../Utilidades/Tools'

const DefaultLayout = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [roles, setRoles] = useState(null);
  
  useEffect(()=>{
    if(cookies.get('token') === undefined)
    {
      cookies.remove('token', {path: '/'});
      navigate('/login');
      return;
    }
    const cRoles = cookies.get('roles'); 
    if(!cRoles)
    {
      getRol();
    }
    else if (roles !== cRoles)
    {
      setRoles(cRoles);
    }
    
  }, [navigate]);
  
    async function getRol()
    {
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
        const response = await axios.get(baseUrl+'Login/GetUserRol/'+cookies.get('idUsuario'), confi_ax);
        cookies.set('roles', JSON.stringify(response.data), {path: '/'});
        //getPermisos();
      }
      catch(error)
      {
        console.log(error);
      }finally{
    
      }
    }
    async function getPermisos()
    {
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
        const response = await axios.get(baseUrl+'Login/GetUserRol/'+cookies.get('idUsuario'), confi_ax);
        cookies.set('permisos', JSON.stringify(response), {path: '/'});
        console.log(response.data);
        getPermisos();
      }
      catch(error)
      {
        console.log(error);
      }finally{
    
      }
    }
  return (
    <div>
     <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
