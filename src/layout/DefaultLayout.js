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
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">CoreUI for React.js</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>Hello, world! This is a toast message.</CToastBody>
    </CToast>
  )
  useEffect(()=>{
    console.log(cookies.get('token'));
    if(cookies.get('token') == undefined)
    {
      cookies.remove('token', {path: '/'});
      navigate('/login');
    }
    addToast(exampleToast)
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
