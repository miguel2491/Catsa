import React,{useEffect, useState, useRef} from 'react'
import {
    CToast,
    CToastBody,
    CToastClose,
    CToastHeader,
    CToaster
  } from '@coreui/react'
  const Modale = ({titulo}) => {
    const [toast, addToast] = useState(0)
    const toaster = useRef()
    return (
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
        <strong className="me-auto">{titulo}</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>Hello, world! This is a toast message.</CToastBody>
    </CToast>
    )
  }
  export default Modale

