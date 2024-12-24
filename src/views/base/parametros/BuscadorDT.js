import React from 'react';
import { CInputGroup, CFormInput, CButton } from '@coreui/react';
import {CIcon} from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const BuscadorDT = ({value, onChange, onSearch, placeholder="Buscar..."}) => {    
    return (
        
        <CInputGroup className="mb-3 mt-3">
        <CFormInput 
          placeholder={placeholder}
          value={value} 
          onChange={onChange} // Función para manejar cambios en el input
        />
        <CButton 
          type="button" 
          color="success" 
          className="btn-primary" 
          onClick={onSearch} // Función para manejar el evento de búsqueda
          style={{ 'color': 'white' }} 
          variant="outline"
        >
          <CIcon icon={cilSearch} className="me-2" />
        </CButton>
      </CInputGroup>
    );
  };
  
  export default BuscadorDT;

