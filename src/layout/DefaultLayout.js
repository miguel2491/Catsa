import React,{ useRef, useState, useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import{
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster
}from '@coreui/react'

const DefaultLayout = () => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const cookies = new Cookies();
  const navigate = useNavigate();

  const exampleToast = (
    <CToast title="CoreUI for React.js">
      <CToastHeader closeButton>
        <strong className="me-auto">Catsa</strong>
      </CToastHeader>
      <CToastBody></CToastBody>
    </CToast>
  )
  useEffect(()=>{
    if(cookies.get('token') == undefined)
    {
      cookies.remove('token', {path: '/'});
      navigate('/login');
    }
  },[]);
  return (
    <div>
      <CToaster ref={toaster} push={toast} placement="top-end" />
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
