import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import StepWizard from "react-step-wizard";
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'

import {
  CContainer,
  CRow,
  CCol,
  CFormSelect,
  CButton,
  CFormInput,
  CFormCheck,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
const animatedComponents = makeAnimated();

//STEPS
const Step1 = ({ nextStep }) => {
  const [plantasSel , setPlantas] = useState('');
  const [vFechaI, setFechaIni] = useState(null);
  const mCambio = (event) => {
    setPlantas(event.target.value);
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  return(
    <div>
      <h2>Paso 1</h2>
      <CRow className='mt-2'>
        <CCol xs={3}>
          <label>N. Cotización</label>
        </CCol>
        <CCol xs={3}>
          <Plantas  
            mCambio={mCambio}
            plantasSel={plantasSel}
          />
        </CCol>
        <CCol xs={3}>
          <FechaI 
              vFechaI={vFechaI} 
              cFechaI={cFechaI} 
          />
        </CCol>
      </CRow>
      <CRow className='mt-2'>
        <CCol xs={2}>
          <label>Datos</label>
          <p>Opción 1</p>
        </CCol>
        <CCol xs={2}>
          <label>Fijos</label>
        
        </CCol>
        <CCol xs={2}>
          <label>Corporativo</label>
        </CCol>
        <CCol xs={2}>
          <label>MOP</label>
        </CCol>
        <CCol xs={2}>
          <label>Costo de Diesel / Tiempo de Ciclo</label>
        </CCol>
      </CRow>
      <CRow className='mt-2'>
        <CCol xs={2}>
          <label>Cliente</label>
        </CCol>
        <CCol xs={2}>
          <label>Nuevo</label>
        </CCol>
        <CCol xs={2}>
          <label>Prospecto</label>
        </CCol>
      </CRow>
      <CRow className='mt-2'>
        <CCol xs={2}>
          <label>Obra</label>
        </CCol>
        <CCol xs={2}>
          <label>Nuevo</label>
        </CCol>
        <CCol xs={2}>
          <label>Ver Cliente</label>
        </CCol>
      </CRow>
      <CRow className='mt-4'>
        <CCol xs={3}>
          <button className='btn btn-success' onClick={nextStep}>Siguiente </button>
        </CCol>
      </CRow>
    </div>
  );
};

const Step2 = ({ nextStep, previousStep }) => {
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  const [visible, setVisible] = useState(false)
  return(
    <div>
      <h2>Paso 2</h2>
      <CRow>
        <CCol xs={2}>
          <CFormSelect aria-label="Fuente">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3" disabled>Three</option>
          </CFormSelect>
        </CCol>
        <CCol xs={2}>
          <CFormSelect aria-label="Segmento">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3" disabled>Three</option>
          </CFormSelect>
        </CCol>
        <CCol xs={2}>
          <CFormSelect aria-label="Tipo de Cliente">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3" disabled>Three</option>
          </CFormSelect>
        </CCol>
        <CCol xs={6}>
          <CRow>
            <CCol xs={3}>
              <CButton color="primary">Diseña tu Producto</CButton>
            </CCol>
            <CCol xs={2}>
              <CButton color="primary">Limpiar</CButton>
            </CCol>
            <CCol xs={2}>
              <CButton color="primary">Exportar</CButton>
            </CCol>
            <CCol xs={1}>
              <CButton color="success">Guardar</CButton>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <hr/>
      <CRow className='mt-3'>
        <CCol xs={6}>
          <CRow>
            <CCol xs={2}>
              <CFormSelect aria-label="Concreto">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3" disabled>Three</option>
              </CFormSelect>
            </CCol>
            <CCol xs={2}>
              <CFormSelect aria-label="Resistencia">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3" disabled>Three</option>
              </CFormSelect>
            </CCol>
            <CCol xs={2}>
              <CFormSelect aria-label="Edad">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3" disabled>Three</option>
              </CFormSelect>
            </CCol>
            <CCol xs={2}>
              <CFormSelect 
                aria-label="Revenimiento"
                options={[
                  'Open this select menu',
                  { label: 'One', value: '1' },
                  { label: 'Two', value: '2' },
                  { label: 'Three', value: '3', disabled: true }
                ]}
              />
            </CCol>
            <CCol xs={2}>
              <CFormSelect 
                aria-label="TMA"
                options={[
                  'Open this select menu',
                  { label: 'One', value: '1' },
                  { label: 'Two', value: '2' },
                  { label: 'Three', value: '3', disabled: true }
                ]}
              />
            </CCol>
            <CCol xs={2}>
              <CFormSelect 
                aria-label="Colocación"
                options={[
                  'Open this select menu',
                  { label: 'One', value: '1' },
                  { label: 'Two', value: '2' },
                  { label: 'Three', value: '3', disabled: true }
                ]}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className='mt-2'>
        <CCol xs={4}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            // defaultValue={options}
            isMulti
            options={options}
          />
        </CCol>
      </CRow>                  
      <hr/>
      <CRow className='mt-3'>
        <CCol xs={12}>
          <CTable responsive style={{fontSize:'10px'}}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope='col'></CTableHeaderCell>
                <CTableHeaderCell scope='col'>M3</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Producto</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Descripción</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Cemento</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Agua</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Gravas</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Arenas</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Aditivos</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Costo MP</CTableHeaderCell>
                <CTableHeaderCell scope='col'>MB Minimo</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Costo Total</CTableHeaderCell>
                <CTableHeaderCell scope='col'>M3 Bomba</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Precio Bomba</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Extras</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Importes Extras</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Precio Sugerido + Extras</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Precio Sugerido M3</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Precio Venta m3</CTableHeaderCell>
                <CTableHeaderCell scope='col'>% Venta</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Comisión</CTableHeaderCell>
                <CTableHeaderCell scope='col'>Margen Bruto</CTableHeaderCell>
                <CTableHeaderCell scope='col'></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell colSpan={1}>
                  <CFormInput
                    type="email"
                    id="exampleFormControlInput1"
                    placeholder="name@example.com"
                    size='sm'
                  />
                </CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}>Extra</CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
                <CTableDataCell colSpan={1}></CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>          
      <hr />
      <CRow className='mt-3'>
        <CCol xs={2}>
          <button className='btn btn-warning ml-3' onClick={previousStep}>Anterior</button>
        </CCol>
        <CCol xs={1}>
          <button className='btn btn-primary' onClick={()=> setVisible(!visible)}>Finalizar</button>
            <CModal
                backdrop="static"
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
              >
                <CModalHeader>
                  <CModalTitle id="StaticBackdropExampleLabel">Modal title</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  I will not close if you click outside me. Don't even try to press escape key.
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                  <CButton color="primary">Save changes</CButton>
                </CModalFooter>
              </CModal>
        </CCol>
      </CRow>
    </div>
  )
};

const Step3 = ({ previousStep }) => {
  return(
    <div>
      <h2>Paso 3</h2>
      <p>¡Has completado el asistente!</p>
      <button className='btn btn-warning' onClick={previousStep}>Anterior</button>
      <button className='btn btn-success'>Finalizar</button>
    </div>
  )
};
//------------------------------------------------------------------------MODAL--------------------------------------------------------
const Modal = () =>{
  return(
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Modal title</CModalTitle>
      </CModalHeader>
      <CModalBody>
        I will not close if you click outside me. Don't even try to press escape key.
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  )
};
//-------------------------------------------------------------------------------------------------------------------------------------
const Cotizador = () => {
  
  return(
    <CContainer fluid>
      <StepWizard>
        <Step1 />
        <Step2 />
      </StepWizard>
    </CContainer>
  )  
}

export default Cotizador