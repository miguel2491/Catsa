import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="ms-auto">
        <span className="me-1">PRO CATSA 2.0</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
