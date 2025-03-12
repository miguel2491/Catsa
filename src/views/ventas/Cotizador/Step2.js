import React, {useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DataTable from 'react-data-table-component';
import { formatCurrency, fNumber, getVolComision } from '../../../Utilidades/Funciones';
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

const Step2 = ({ nextStep, previousStep, fuente, segmento, canal, productos, extras, fDPlanta, fData, updPData, onUpdateFCData }) => {
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
    const [selectedProductos, setSelectedProductos] = useState([]);
    //Costos
    const [MOP1, setCMOP] = useState();
    const [CMP, setCMP] = useState();
    const [Cindirectos, setCIndirectos] = useState();
    const [CTotal, setCTotal] = useState();
    const [M3Bomba, setM3Bomba] = useState();
    const [PBomba, setPBomba] = useState();
    const [PVenta, setPVenta] = useState();
    const [PorcVenta, setPorcVenta] = useState();
    const [comision, setComision] = useState();
    const [MB, setMB] = useState();
    const [cExtras, setcExtras] = useState([]);
    const [sExtra, setSExtra] = useState();
    const [dtExtras, setDTExtras] = useState([]);
    // FILTROS ARRAY 
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [fProductos, setFProductos] = useState([]);
    const [sOProductos, setOProductos] = useState([]);
    const [sComisiones, setComisiones] = useState([]);
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
                            onClick={() => DeletePro(row.Producto)}
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
                    value="1.0"
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
              selector: row => fNumber(row.CPC),
            },
            {
              name: 'Agua',
              width:"100px",
              selector: row => fNumber(row.H2O),
            },
            {
              name: 'Gravas',
              width:"100px",
              selector: row => fNumber(row.GRAVAS),
            },
            {
              name: 'Arenas',
              width:"100px",
              selector: row => fNumber(row.ARENAS),
            },
            {
              name: 'Aditivos',
              width:"100px",
              selector: row => fNumber(row.ADITIVOS),
            },
            {
              name: 'Costo MP',
              width:"120px",
              selector: row => {
                const auxcp = row.COSTO;
                const CP = formatCurrency(auxcp);
                setCMP(CP)
                return CP
              },
            },
            {
              name: 'MB Mínimo',
              width:"120px",
              selector: row => formatCurrency(Cindirectos),
            },
            {
              name: 'Costo Total',
              width:"150px",
              selector: row => {
                const aux = row.COSTO + Cindirectos;
                setCTotal(aux);
                const auxT = formatCurrency(aux);
                return auxT;
              },
            },
            {
              name: 'M3 Bomba',
              width:"120px",
              cell: (row, index) => (
                <input
                  type="number"
                  value="0.0"
                  onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
                  style={{ width: '100%' }}
                />
              ),
            },
            {
              name: 'Precio Bomba',
              width:"100px",
              cell: (row, index) => (
                <input
                  type="number"
                  value="0.0"
                  onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
                  style={{ width: '100%' }}
                />
              ),
            },
            {
              name: 'Extras',
              width:"80px",
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
              width:"120px",
              selector: row => fNumber(row.CPC),
            },
            {
              name: 'Precio Sugerido + Extras',
              width:"120px",
              selector: row => {
                const aux = ((row.COSTO + Cindirectos) / (100 - MOP1)) * 100;
                const psm3 = formatCurrency(aux);
                return psm3;
              },
            },
            {
              name: 'Precio Sugerido m3',
              width:"120px",
              selector: row => {
                const aux = ((row.COSTO + Cindirectos) / (100 - MOP1)) * 100;
                const psm3 = formatCurrency(aux);
                return psm3;
              },
            },
            {
              name:'Precio Venta m3',
              with:"100px",
              selector: row=>{
                const aux = ((row.COSTO + Cindirectos) / (100 - MOP1)) * 100;
                const psm3 = formatCurrency(aux);
                return psm3;
              },
              cell: (row, index) => {
                const pv = ((row.COSTO + Cindirectos) / (100 - MOP1)) * 100;
                const aux = Number(pv.toFixed(2));
                return(
                  <input
                    type="number"
                    value={aux}
                    onChange={(e) => handleEdit(e, index)}
                    style={{ width: '100%' }}
                  />
                );
              },
            },
            {
              name: '% Venta',
              width:"120px",
              selector: row => {
                return MOP1;
              },
              cell: (row, index) => (
                <input
                  type="number"
                  value={MOP1}
                  onChange={(e) => handleEdit(e, index)} // Maneja el cambio de valor
                  style={{ width: '100%' }}
                />
              ),
            },
            {
              name: 'Comisión',
              width:"150px",
              selector: row => {
                return comision
              },
            },
            {
              name: 'Margen Bruto',
              width:"150px",
              selector: row => MB,
            },
    ];
    const columnsEx = [
      {
        name: ' ',
        selector: row => row.IdExtra,
        width:"80px",
        cell: (row) => (
          <div>
              <CButton
                  color="danger"
                  onClick={() => deleteExtra(row.IdExtra)}
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
          selector: row => row.IdExtra,
          width:"120px",
      },
      {
        name: 'Concepto',
        selector: row => row.Descripcion,
        width:"250px",
      },
      {
        name: 'Cantidad',
        selector: row => row.CantMin,
        width:"80px",
      },
      {
        name: 'Precio',
        selector: row => row.Costo,
        width:"100px",
        cell: (row, index) => (
          <input
            type="number"
            value={row.Costo}
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
          setFProductos(fData.producto)
          setcExtras(extras)
    },[]);
    useEffect(()=>{
      console.log(extras)
      setcExtras(extras)
      //filterProductos(selectedConcreto);
    },[extras])

    useEffect(()=>{
      filterProductos(selectedConcreto);
    },[selectedConcreto])
    
    useEffect(()=>{
      filterProductos(selectedResistencia);
    },[selectedResistencia])

    useEffect(()=>{
      filterProductos(selectedEdad);
    },[selectedEdad])

    useEffect(()=>{
      filterProductos(selectedRev);
    },[selectedRev])
    
    useEffect(()=>{
      filterProductos(selectedTMA);
    },[selectedTMA])
    
    useEffect(()=>{
      filterProductos(selectedCol);
    },[selectedCol])

    useEffect(() => {
      let F = fDPlanta.fijos;
      let C = fDPlanta.corporativo;
      let D = fDPlanta.diesel;
      const totalIndirecto = F+C+D; 
      setCMOP(fDPlanta.MOP)
      setCIndirectos(totalIndirecto)
      getComision_();
      
    }, [fDPlanta]); 
    //******************************************************************************************************************** */
    const getComision_ = async () => {
        try {
            const comisiones = await getVolComision('PUE1','-');
            if (comisiones) {  
              setComisiones(comisiones)
            }
        } catch (error) {
            console.error("No se pudo obtener ID VENDEDOR");
        }
      };
    //******************************************************************************************************************** */
    const sProductos = (selected) =>{
      setOProductos(selected);
      if (Array.isArray(selected)) {
        // Selección múltiple
        const selectedValues = selected.map(option => option.value);
        getFindPro(selectedValues[selectedValues.length-1]);
        console.log(selectedValues[selectedValues.length-1])
      } else {
        // Selección única
        console.log('Valor seleccionado:', selected.value);
      }
    }
    function getFindPro(pro)
    {
      setSelectedProductos(pro)
      const productoBuscado = productos.filter(producto => producto.Producto === pro);
      console.log(productoBuscado)
      setProductos(prevProductos => [...prevProductos, ...productoBuscado]);
      updPData(productoBuscado);
      const CostoMP = productoBuscado[0].COSTO;
      const Precio = ((CostoMP + Cindirectos) / (100-MOP1)) * 100;
      setCMP(Precio);
      const dtCom2 = sComisiones[1].Rows;
      const dtCom3 = sComisiones[2].Rows;
      const MB = Precio - CostoMP;
      cComision(dtCom2[0], dtCom3[0], MB)
    }
    const cComision = async(tCom, tCom2, MB)=>{
      const auxMB = fNumber(MB.toFixed(2))
      const MBAux = auxMB
      setMB(MBAux)
      console.log(MB, tCom)
      if(MB >= tCom.P3MAX)
      {
        const auxCom = tCom2.P3MIN;
        const valor = parseFloat(auxCom.toFixed(2)); 
        setComision(valor)
      }
      else if(MB >= tCom.P3MIN)
      {
        setComision(tCom2.P2MAX)
      }
      else if(MB >= tCom.P2MAX)
      {
        setComision(tCom2.P2MIN)
      }
      else if(MB >= tCom.P2MIN)
      {
        setComision(tCom2.P1MAX)
      }
      else if(MB >= tCom.P1MAX)
      {
        setComision(tCom2.P1MIN)
      }
      else if(MB >= tCom.P1MIN)
      {
        setComision(tCom2.MBDIR)
      }
    }
    const oProductos = productos.map(item => ({
      value:item.Producto,
      label:item.Producto
    }))
    const DeletePro = async(producto)=>{
      setProductos((prevState) => prevState.filter((item) => item.Producto !== producto));
    };
    const deleteExtra = async(id)=>{
      setDTExtras((prevState) => prevState.filter((item) => item.IdExtra !== id))
    }
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
    //**************************************************************************************************************** */
    const hConcreto = (event) =>{
      const aux = event.target.value;
      setSelectedConcreto(aux);
      filterProductos(aux);
    }
    const hResistencia = (event) =>{
      const aux = event.target.value;
      setSelectedResistencia(aux);
      filterProductos(aux);
    }
    const hEdad = (event) =>{
      const aux = event.target.value;
      setSelectedEdad(aux);
      filterProductos(aux);
    }
    const hReve = (event) =>{
      const aux = event.target.value;
      setSelectedRev(aux);
      filterProductos(aux);
    }
    const hTMA = (event) =>{
      const aux = event.target.value;
      setSelectedTMA(event.target.value);
      filterProductos(aux);
    }
    const hColocacion = (event) =>{
      const aux = event.target.value;
      setSelectedCol(aux);
      filterProductos(aux)
    }
    const chExtra = (event) => {
      const id = event.target.value;
      const vExtra = cExtras.filter(cExtras => 
        cExtras.IdExtra === parseInt(id) 
      );
      setSExtra(vExtra)
    };
    const addExtras = () =>{
      setDTExtras((prevData) => [...prevData, ...sExtra])
    };
    //************************************************************************************************ */
    const filterProductos = (aux) =>{
      const auxStr = String(aux);
      if(!auxStr || auxStr === "-")
      {
        setFilteredProductos(productos)
      }
      const fProd = oProductos.filter(item => {
        return (
          (!selectedConcreto || selectedConcreto === "-" || (item.value && item.value.toString().includes(selectedConcreto))) &&
          (!selectedResistencia || selectedResistencia === "-" || (item.value && item.value.toString().includes(selectedResistencia))) &&
          (!selectedEdad || selectedEdad === "-" || (item.value && item.value.toString().includes(selectedEdad))) &&
          (!selectedRev || selectedRev === "-" || (item.value && item.value.toString().includes(selectedRev))) &&
          (!selectedTMA || selectedTMA === "-" || (item.value && item.value.toString().includes(selectedTMA))) &&
          (!selectedCol || selectedCol === "-" || (item.value && item.value.toString().includes(selectedCol))) //&&
          //(item.value && item.value.toString().includes(aux)) // Siempre se filtra por `aux`
        );
      });        
      setFilteredProductos(fProd)
    };
    const hnextStep = ()=>{
      onUpdateFCData({
        fuente:selectedFuente,
        segmento:selectedSegmento,
        canal:selectedTCliente,
      });
      
      nextStep();
    }
    //*********************************************************************************************** */
    return(
      <div>
        <CCard>
          <CCardHeader>Paso 2</CCardHeader>
          <CCardBody>
            <CRow className='mt-2 mb-2'>
              <CCol xs={6} md={4} className='mt-2 mb-2'>
                <label>Fuente:</label>
                <CFormSelect aria-label="Fuente" value={selectedFuente} onChange={hFuente}>
                  <option value="-">-</option>
                  {fuente.map((item, index) => (
                    <option key={index} value={item.IdFuente}>{item.Descripcion}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-2 mb-2'>
                <label>Segmento</label>
                <CFormSelect aria-label="Segmento" value={selectedSegmento} onChange={hSegmento}>
                  <option value="-">-</option>
                  {segmento.map((item, index) => (
                    <option key={index} value={item.IdSegmento}>{item.Descripcion}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={6} md={4} className='mt-2 mb-2'>
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
                  closeMenuOnSelect={true}
                  components={animatedComponents}
                  isMulti
                  options={filteredProductos}
                  onChange={sProductos}
                  value={selectedProductos}
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
                <button className='btn btn-warning btnW' onClick={previousStep}>Anterior</button>
              </CCol>
              <CCol xs={6} md={6}>
                <button className='btn btn-success btnW' onClick={hnextStep}>Siguiente </button>
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
            <CCol xs={10} md={8}>
              <CFormSelect aria-label="Fuente" onChange={chExtra}>
                <option>-</option>
                {cExtras.map((extra, index) =>(
                  <option value={extra.IdExtra} key={index}>{extra.Descripcion}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs={2} md={4}>
              <CButton color='primary' onClick={() => addExtras()}>Agregar</CButton>
            </CCol>
          </CRow>
          <CRow className='mt-2'>
            <DataTable
              columns={columnsEx}
              data={dtExtras}  // Usamos los datos filtrados
              pagination
              persistTableHead
              subHeader
            />
          </CRow>
          </CModalBody>
          <CModalFooter>
            <CRow className='w-100'>
              <CCol xs={6} md={6}>
                <CButton className='btn btn-primary' style={{'color':'white'}} onClick={() => setMExtras(false)}>Aceptar <CIcon icon={cilCheck} className='me-2' /></CButton>
              </CCol>
            </CRow>
          </CModalFooter>
        </CModal>
      </div>
    )
  };
  export default Step2;
