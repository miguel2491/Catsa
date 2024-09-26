import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import {
  CContainer,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

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

const Cotizador = () => {
    const [toast, addToast] = useState(0)
    const toaster = useRef()

return (
    <>
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <CContainer fluid>
            <h1>Cotizador</h1>
        </CContainer>
    </>
    )
}
export default Cotizador