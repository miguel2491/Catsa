import React, {useEffect, useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import {
  CForm,
  CContainer,
  CButton,
  CFormSelect,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CFormInput,
  CInputGroup,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import TabEdicion from '../base/tables/TabEdi'

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
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(null);

    const mCambio = (event) => {
      setPlantas(event.target.value);
    };
    const cFechaI = (fecha) => {
      setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };

    const animatedComponents = makeAnimated();
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]
    const SelecTest = () => (
      <Select closeMenuOnSelect={false}
      components={animatedComponents}
      // defaultValue={[colourOptions[4], colourOptions[5]]}
      isMulti
      options={options} />
    )
return (
    <>
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <CContainer fluid>
            <h1>Cotizador</h1>
            <CForm>
              <CRow>
                <CCol sm="auto">
                  <Plantas  
                    mCambio={mCambio}
                    plantasSel={plantasSel}
                  />
                </CCol>
                <CCol sm="auto">
                  <CFormInput type='email' id='txtNombre' label='No Cotización' />
                </CCol>
                <CCol>
                  <FechaI 
                    vFechaI={vFechaI} 
                    cFechaI={cFechaI} 
                  />
                </CCol>
                <CCol sm="auto">Datos</CCol>
                <CCol sm="auto">
                  <CContainer>
                    <CRow>
                      <CCol sm="auto">Fijos</CCol>
                      <CCol sm="auto"><label name="txtFijos">-</label></CCol>
                    </CRow>
                  </CContainer>
                </CCol>
                <CCol sm="auto">
                  <CContainer>
                    <CRow>
                      <CCol sm="auto">Corporativo</CCol>
                      <CCol sm="auto"><label name="txtCorporativo">-</label></CCol>
                    </CRow>
                  </CContainer>
                </CCol>
                <CCol sm="auto">
                  <CContainer>
                    <CRow>
                      <CCol sm="auto">MOP</CCol>
                      <CCol sm="auto"><label name="txtMOP">-</label></CCol>
                    </CRow>
                  </CContainer>
                </CCol>
                <CCol sm="auto">
                  <CContainer>
                    <CRow>
                      <CCol sm="auto">Costo de Diesel / Tiempo Ciclo</CCol>
                      <CCol sm="auto"><label name="txtTD">-</label></CCol>
                    </CRow>
                  </CContainer>
                </CCol>
              </CRow>
              <hr />
              <CRow>
                <CCol sm="auto">
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder="Cliente" aria-label="Cliente" aria-describedby="button-addon2"/>
                    <CButton type="button" color="secondary" variant="outline" id="btnBCliente">
                      Buscar<CIcon />
                    </CButton>
                  </CInputGroup>
                </CCol>
                <CCol sm="auto">
                  <CFormCheck id="chkNuevoCliente" label="Nuevo" />
                </CCol>
                <CCol sm="auto">
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder="Obra" aria-label="Obra" aria-describedby="button-addon2"/>
                    <CButton type="button" color="secondary" variant="outline" id="btnBObra">
                      Buscar<CIcon />
                    </CButton>
                  </CInputGroup>
                </CCol>
                <CCol sm="auto">
                  <CFormCheck id="chkNuevaObra" label="Nueva" />
                </CCol>
                <CCol sm="auto">
                  <CButton color="primary">Ver Cliente</CButton>
                </CCol>
              </CRow>
              <hr />
              <CRow>
                <CCol sm="auto">
                  <CFormSelect 
                    label="Fuente"
                    options={[
                      { label: 'One', value: '1' },
                      { label: 'Two', value: '2' },
                      { label: 'Three', value: '3', disabled: true }
                    ]}
                  />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                    label="Segmento"
                    options={[
                      { label: 'One', value: '1' },
                      { label: 'Two', value: '2' },
                      { label: 'Three', value: '3', disabled: true }
                    ]}
                  />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                    label="Tipo de Cliente"
                    options={[
                      { label: 'One', value: '1' },
                      { label: 'Two', value: '2' },
                      { label: 'Three', value: '3', disabled: true }
                    ]}
                  />
                </CCol>
                <CCol sm="auto">
                  <CButton type="button" color="secondary" variant="outline" id="btnBCliente">
                    DISEÑA TU PRODUCTO
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton type="button" color="secondary" variant="outline" id="btnBCliente">
                    LIMPIAR
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton type="button" color="secondary" variant="outline" id="btnBCliente">
                    EXPORTAR
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton color="danger" id="btnBCliente">
                    EXTRAS SERVICIO
                  </CButton>
                </CCol>
                <CCol sm="auto">
                  <CButton color="primary" id="btnBCliente">
                    GUARDAR
                  </CButton>
                </CCol>
              </CRow>
              <hr />
              <CRow>
                <CCol md="auto">
                    <SelecTest />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                      label="Concreto"
                      options={[
                        { label: 'One', value: '1' },
                        { label: 'Two', value: '2' },
                        { label: 'Three', value: '3', disabled: true }
                      ]}
                    />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                      label="Resistencia"
                      options={[
                        { label: 'One', value: '1' },
                        { label: 'Two', value: '2' },
                        { label: 'Three', value: '3', disabled: true }
                      ]}
                    />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                      label="Edad"
                      options={[
                        { label: 'One', value: '1' },
                        { label: 'Two', value: '2' },
                        { label: 'Three', value: '3', disabled: true }
                      ]}
                    />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                      label="Revenimiento"
                      options={[
                        { label: 'One', value: '1' },
                        { label: 'Two', value: '2' },
                        { label: 'Three', value: '3', disabled: true }
                      ]}
                    />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                      label="TMA"
                      options={[
                        { label: 'One', value: '1' },
                        { label: 'Two', value: '2' },
                        { label: 'Three', value: '3', disabled: true }
                      ]}
                    />
                </CCol>
                <CCol sm="auto">
                  <CFormSelect 
                      label="Colocación"
                      options={[
                        { label: 'One', value: '1' },
                        { label: 'Two', value: '2' },
                        { label: 'Three', value: '3', disabled: true }
                      ]}
                    />
                </CCol>
              </CRow>
              <hr/>
              <CRow>
                <TabEdicion titulo={"Edi"} />
              </CRow>
            </CForm>
        </CContainer>
    </>
    )
}
export default Cotizador