import React,{ useRef, useState, useEffect } from 'react'
import axios from "axios";
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { NavProvider } from '../components/NavContext'
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
    
  }, [navigate]);
  
    
  return (
    <div>
     <NavProvider>
      <AppSidebar />
     </NavProvider> 
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
