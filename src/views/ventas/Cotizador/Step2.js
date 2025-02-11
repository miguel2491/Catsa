import React, {useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DataTable from 'react-data-table-component';
import { formatCurrency } from '../../../Utilidades/Funciones';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormSelect,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilPlus } from '@coreui/icons'
import { Rol } from '../../../Utilidades/Roles'
import '../../../estilos.css'

const Step2 = ({ nextStep, previousStep, fuente, segmento, canal, productos, fData, updPData }) => {
    const animatedComponents = makeAnimated();
    const [dDetalle, setDataD] = useState([]); // Estado para almacenar los datos de Detalle
    const [productoBuscado, setProductoBuscado] = useState(""); 
    const [vMExtras, setMExtras] = useState(false);// Modal Extras
    const [aProductos, setProductos] = useState([]); 
    const [aExtras, setExtras] = useState([]); 
    //Seleccs
    const [selectedFuente, setSelectedFuente] = useState("-");
    const [selectedSegmento, setSelectedSegmento] = useState("-");
    const [selectedTCliente, setSelectedTCliente] = useState("-");
    const [selectedConcreto, setSelectedConcreto] = useState("-");
    const [selectedResistencia, setSelectedResistencia] = useState("-");
    const [selectedEdad, setSelectedEdad] = useState("-");
    const [selectedRev, setSelectedRev] = useState("-");
    const [selectedTMA, setSelectedTMA] = useState("-");
    const [selectedCol, setSelectedCol] = useState("-");
    // FILTROS ARRAY 
    const [filteredProductos, setFilteredProductos] = useState([]);
    const { cliente } = fData;
    const btnExtras = (Producto) => {
      setMExtras(true);
    }
    const columns = [
            {
                name: 'Acciones',
                selector: row => row.Producto,
                width:"80px",
                cell: (row) => (
                    <div>
                        <CButton
                            color="danger"
                            size="sm"
                            onClick={() => getDetalle(1)}
                            className="me-2"
                            title="Eliminar"
                        >
                            <CIcon icon={cilX} />
                        </CButton>
                    </div>
                ),
            },{
                name: 'M3',
                selector: row => row.CPC,
                width:"80px",
                cell: (row, index) => (
                  <input
                    type="number"
                    value={row.CPC}
                    onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
                    style={{ width: '100%' }}
                  />
                ),
            },{
                name: 'Producto',
                selector: row => row.Producto,
                sortable: true,
                grow: 1,
                width:"150px",
            },
            {
                name: 'Descripcion',
                width:"300px",
                selector: row => row.Descripcion,
            },
            {
              name: 'Cemento',
              width:"100px",
              selector: row => row.CPC,
            },
            {
              name: 'Agua',
              width:"150px",
              selector: row => row.H2O,
            },
            {
              name: 'Gravas',
              width:"150px",
              selector: row => row.GRAVAS,
            },
            {
              name: 'Arenas',
              width:"150px",
              selector: row => row.ARENAS,
            },
            {
              name: 'Aditivos',
              width:"150px",
              selector: row => row.ADITIVOS,
            },
            {
              name: 'Costo MP',
              width:"150px",
              selector: row => row.COSTO,
            },
            {
              name: 'MB Mínimo',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name: 'Costo Total',
              width:"150px",
              selector: row => row.COSTO,
            },
            {
              name: 'M3 Bomba',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name: 'Precio Bomba',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name: 'Extras',
              width:"150px",
              selector: row => row.CPC,
              cell: (row) => (
                <div>
                    <CButton
                        color="info"
                        onClick={() => btnExtras(row.Producto)}
                        size="sm"
                        className="me-2"
                        title="Extras"
                    >
                        <CIcon icon={cilPlus} />
                    </CButton>
                </div>
              ),
            },
            {
              name: 'Importe Extras',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name: 'Precio Sugerido + Extras',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name: 'Precio Sugerido m3',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name:'Precio Venta m3',
              with:"100px",
              cell: (row, index) => (
                <input
                  type="number"
                  value={row.CPC}
                  style={{ width: '100%' }}
                />
              ),
            },
            {
              name: '% Venta',
              width:"150px",
              selector: row => row.CPC,
              cell: (row, index) => (
                <input
                  type="number"
                  value={row.CPC}
                  onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
                  style={{ width: '100%' }}
                />
              ),
            },
            {
              name: 'Comisión',
              width:"150px",
              selector: row => row.CPC,
            },
            {
              name: 'Margen Bruto',
              width:"150px",
              selector: row => row.CPC,
            },
    ];
    const columnsEx = [
      {
        name: 'Acciones',
        selector: row => row.Id,
        width:"80px",
        cell: (row) => (
          <div>
              <CButton
                  color="danger"
                  onClick={() => getDetalle(1)}
                  size="sm"
                  className="me-2"
                  title="Eliminar"
              >
                  <CIcon icon={cilX} />
              </CButton>
          </div>
        ),
      },
      {
          name: 'Identificador',
          selector: row => row.Id,
          width:"80px",
      },
      {
        name: 'Concepto',
        selector: row => row.Id,
        width:"80px",
      },
      {
        name: 'Cantidad',
        selector: row => row.Id,
        width:"80px",
      },
      {
        name: 'Precio',
        selector: row => row.Id,
        width:"80px",
        cell: (row, index) => (
          <input
            type="number"
            value={row.Id}
            onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
            style={{ width: '100%' }}
          />
        ),
      }
    ];
    //************************************************************************************* */
    useEffect(()=>{    
          setSelectedFuente(fData.fuente)
          setSelectedSegmento(fData.segmento)
          updPData(fData.producto)
          setProductos(fData.producto)
          setFilteredProductos(fData.producto)
        },[]);
    //************************************************************************************* */
    const [sOProductos, setOProductos] = useState([]);
    
    const sProductos = (selected) =>{
      setOProductos(selected);
      if (Array.isArray(selected)) {
        // Selección múltiple
        const selectedValues = selected.map(option => option.value);
        getFindPro(selectedValues[selectedValues.length-1]);
      } else {
        // Selección única
        console.log('Valor seleccionado:', selected.value);
      }
    }
  
    function getFindPro(pro)
    {
      const productoBuscado = productos.filter(producto => producto.Producto === pro);
      setProductos(prevProductos => [...prevProductos, ...productoBuscado]);
      updPData(productoBuscado);
    }
  
    const oProductos = productos.map(item => ({
      value:item.Producto,
      label:item.Producto
    }))
    const [visible, setVisible] = useState(false)
    //**************************** HANDLES ********************************************************* */
    const handleEdit = (e, rowIndex) => {
      const updatedProductos = [...productos];
      updatedProductos[rowIndex].CPC = e.target.value; // Actualiza el valor de la columna CPC
      //setProductos(updatedProductos); // Actualiza el estado
    };
    const hFuente = (event) =>{
      setSelectedFuente(event.target.value);
    }
    const hSegmento = (event) =>{
      setSelectedSegmento(event.target.value);
    }
    const hTCliente = (event) =>{
      setSelectedTCliente(event.target.value);
    }
    const hConcreto = (event) =>{
      setSelectedConcreto(event.target.value);
      //console.log(oProductos)
      const filteredData = 'C' ? oProductos.filter(item => item.value.includes('C')) : oProductos;
      setFilteredProductos(filteredData)
      //console.log(filteredData)
    }
    const hResistencia = (event) =>{
      setSelectedResistencia(event.target.value);
      const filteredData = '200' ? filteredProductos.filter(item => item.value.includes('200')) : filteredProductos;
      setFilteredProductos(filteredData)
    }
    const hEdad = (event) =>{
      setSelectedEdad(event.target.value);
    }
    const hReve = (event) =>{
      setSelectedRev(event.target.value);
      const filteredData = '14' ? filteredProductos.filter(item => item.value.includes('14')) : filteredProductos;
      setFilteredProductos(filteredData)
    }
    const hTMA = (event) =>{
      setSelectedTMA(event.target.value);
      const filteredData = '10' ? filteredProductos.filter(item => item.value.includes('10')) : filteredProductos;
      setFilteredProductos(filteredData)
    }
    const hColocacion = (event) =>{
      setSelectedCol(event.target.value);
      console.log(filteredProductos)
      const filteredData = 'D' ? filteredProductos.filter(item => item.value.includes('D')) : filteredProductos;
      console.log(filteredData)
      setFilteredProductos(filteredData)
    }

    //*********************************************************************************************** */
    return(
      <div>
        <CCard>
          <CCardHeader>Paso 2</CCardHeader>
          <CCardBody>
            <CRow className='mt-2'>
              <CCol xs={6} md={4}>
                <label>Fuente:</label>
                <CFormSelect aria-label="Fuente" value={selectedFuente} onChange={hFuente}>
                  <option value="-">-</option>
                  {fuente.map((item, index) => (
                    <option key={index} value={item.IdFuente}>{item.Descripcion}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4}>
                <label>Segmento</label>
                <CFormSelect aria-label="Segmento" value={selectedSegmento} onChange={hSegmento}>
                  <option value="-">-</option>
                  {segmento.map((item, index) => (
                    <option key={index} value={item.IdSegmento}>{item.Descripcion}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4}>
                <label>Tipo de Cliente</label>
                <CFormSelect aria-label="Tipo de Cliente" value={selectedTCliente} onChange={hTCliente}>
                  <option value="-">-</option>
                  {canal.map((item, index) => (
                    <option key={index} value={item.IdCanal}>{item.Descripcion}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className='mt-2 mb-2'>
              <CCol xs={6} md={4} className='mt-3 mb-3'>
                <label>Concreto</label>
                <CFormSelect aria-label="Concreto" value={selectedConcreto} onChange={hConcreto}>
                  <option value="-">-</option>
                  <option value="C">Convencionales</option>
                  <option value="E">Estructurales</option>
                  <option value="R">Altas Resistencias</option>
                  <option value="MR">Pavimentos</option>
                  <option value="B">Baja Contracción</option>
                  <option value="A">Auto-Compactables</option>
                  <option value="M">Morteros</option>
                  <option value="L">Ligeros</option>
                  <option value="F">Rellenos Fluidos</option>
                  <option value="G">Ecológicos</option>
                  <option value="Q">Arquitectónicos</option>
                  <option value="D">Durables</option>
                  <option value="FL">Relleno Ligero</option>
                  <option value="O">Otros</option>
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-3 mb-3'>
                <label>Resistencia</label>
                <CFormSelect aria-label="Resistencia" value={selectedResistencia} onChange={hResistencia}>
                  <option value="-">-</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                  <option value="35">35</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                  <option value="42">42</option>
                  <option value="45">45</option>
                  <option value="48">48</option>
                  <option value="50">50</option>
                  <option value="55">55</option>
                  <option value="60">60</option>
                  <option value="65">65</option>
                  <option value="70">70</option>
                  <option value="75">75</option>
                  <option value="80">80</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                  <option value="250">250</option>
                  <option value="275">275</option>
                  <option value="300">300</option>
                  <option value="350">350</option>
                  <option value="400">400</option>
                  <option value="450">450</option>
                  <option value="500">500</option>
                  <option value="550">550</option>
                  <option value="600">600</option>
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-3 mb-3'>
                <label>Edad</label>
                <CFormSelect aria-label="Edad" value={selectedEdad} onChange={hEdad}>
                  <option value="-">-</option>
                  <option value="1">1 Día</option>
                  <option value="3">3 Días</option>
                  <option value="7">7 Días</option>
                  <option value="R">14 Días</option>
                  <option value="N">28 Días</option>
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-3 mb-3'>
                <label>Revenimiento</label>
                <CFormSelect aria-label="Revenimiento" value={selectedRev} onChange={hReve}>
                  <option value="-">-</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                  <option value="20">20</option>
                  <option value="22">22</option>
                  <option value="66">66</option>
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-3 mb-3'>
                <label>TMA</label>
                <CFormSelect aria-label="TMA" value={selectedTMA} onChange={hTMA}>
                  <option value="-">-</option>
                  <option value="05">05</option>
                  <option value="08">08</option>
                  <option value="10">10</option>
                  <option value="13">13</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="40">40</option>
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-3 mb-3'>
                <label>Colocación</label>
                <CFormSelect aria-label="Colocación" value={selectedCol} onChange={hColocacion}>
                  <option value="-">-</option>
                  <option value="D">Directo</option>
                  <option value="B">Bombeado</option>
                  <option value="L">Lanzado</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={6} className='mt-3 mb-3'>
                <label>Producto</label>
                <Select
                  className='sStyle'
                  styles={{'color':'black'}}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={filteredProductos}
                  onChange={sProductos}
                />
              </CCol>
            </CRow>
            <CRow>
                <CCol xs={12} md={12}>
                  <DataTable
                    columns={columns}
                    data={aProductos}  // Usamos los datos filtrados
                    pagination
                    persistTableHead
                    subHeader
                  />
                </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow className='mt-2 mb-2'>
              <CCol xs={4} md={4}>
                <button className='btn btn-warning' onClick={previousStep}>Anterior</button>
              </CCol>
              <CCol xs={6} md={6}>
                <button className='btn btn-success' onClick={nextStep}>Siguiente </button>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
        <CModal
            backdrop="static"
            visible={vMExtras}
            onClose={() => setMExtras(false)}
            aria-labelledby="STM"
            className='c-modal'
        >
          <CModalHeader>
              <CModalTitle id="stitle">Extras</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CRow>
            <CCol>
              <CFormSelect aria-label="Fuente">
                <option>-</option>
                <option value='1'>FIBRA</option>
              </CFormSelect>
            </CCol>
            <CCol>
              <CButton color='primary'>Agregar</CButton>
            </CCol>
          </CRow>
          <CRow className='mt-2'>
            <DataTable
              columns={columnsEx}
              data={aExtras}  // Usamos los datos filtrados
              pagination
              persistTableHead
              subHeader
            />
          </CRow>
          </CModalBody>
          <CModalFooter>
            <CRow className='w-100'>
              <CCol xs={6} md={6}>
                <CButton className='btn btn-primary' style={{'color':'white'}}>Aceptar <CIcon icon={cilCheck} className='me-2' /></CButton>
              </CCol>
              <CCol xs={6} md={6}>
                <CButton className='btn btn-danger' onClick={() => setMExtras(false)} style={{'color':'white'}}>Cerrar <CIcon icon={cilX} className='me-2' /></CButton>
              </CCol>
            </CRow>
          </CModalFooter>
        </CModal>
      </div>
    )
  };
  export default Step2;
