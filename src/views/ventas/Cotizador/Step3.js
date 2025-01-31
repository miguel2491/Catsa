
import React, {useEffect, useState, useRef} from 'react'
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import { IMaskMixin } from 'react-imask'
import IMask from 'imask'
import {
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CFormCheck,
  CFormTextarea,
  CFormLabel,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CTab,
  CTabs,
  CTabContent,
  CTabList,
  CTabPanel,
} from '@coreui/react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { getElementos } from '../../../Utilidades/Funciones';
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch, cilTrash, cilPlus } from '@coreui/icons'
import { Rol } from '../../../Utilidades/Roles'
import '../../../estilos.css'

const Step3 = ({ previousStep, formData, pData, onSave }) => {
    const navigate = useNavigate();
    const [maskedValue, setMaskedValue] = useState('');
    const [price, setPrice] = useState('');
    const inputRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date());
    const [time, setTime] = useState(null);
    const [elementos, setElementos] = useState([]);
    const handleClockCh = (value) => {
      setTime(value);
      console.log('Hora seleccionada:', value ? value.format('HH:mm') : 'No seleccionada');
    }
    const handleSave = () => {
      // Aquí puedes manejar la lógica para guardar los datos
      console.log("Guardando datos...", formData, pData);

      // Aquí iría la llamada a la API o la lógica de persistencia que necesites
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        setTimeout(() => { Swal.close(); navigate('/ventas/LCotizacion');},3000)
    };
    // Configuración de la máscara
    const priceMask = {
      mask: Number,  // Solo números permitidos
      thousandsSeparator: ',',  // Separador de miles
      radix: '.',  // Separador decimal
      scale: 2,  // Para permitir 2 decimales
      normalizeZeros: true,  // Normaliza los ceros decimales
      padFractionalZeros: true,  // Agrega ceros después de la coma decimal si es necesario
      min: 0, // Asegura que el número no sea negativo
    };
    
    const handleChangeMK = (e) => {
      const value = e.target.value.replace(/[^0-9.,]/g, '');  // Reemplazar cualquier carácter no numérico
      setMaskedValue(value);
    };
  
    const handleBlurMK = () => {
      if (inputRef.current) {
        const masked = IMask(inputRef.current, priceMask);
        const maskedValue = masked.value;
        setMaskedValue(maskedValue);
        // Aquí convertimos el valor a número para que puedas usarlo para guardarlo
        const numericValue = masked.unmaskedValue;
        setPrice(numericValue); // Guardamos el valor numérico sin formato
      }
    };
    async function getElementos_()
    {
      try{
        const elementos = await getElementos();
        console.log(elementos)
        if(elementos){
          setElementos(elementos);
        }    
      }catch(error){
        console.log(error)
        //Swal.fire("Error", "No se pudo obtener la información de Elementos a colar", "error");
      }
    }
    const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
      <CFormInput {...props} ref={inputRef} />
    ))
    useEffect(() => {
      getElementos_()
    },[]);
    
    return(
      <div>
        <CCard>
          <CCardHeader>Paso 3</CCardHeader>
          <CCardBody>
            <CRow className='mt-3'>
              <CTabs activeItemKey={1}>
                <CTabList variant='tabs'>
                  {pData.map((producto, index) =>(
                    <CTab itemKey={producto.Producto}>{producto.Producto}</CTab>
                  ))}
                </CTabList>
                <CTabContent>
                  {pData.map((producto2, index) =>(
                    <CTabPanel className='p-3' itemKey={producto2.Producto}>
                      <CRow>
                        <CCol xs={6} md={2}>
                          <label>Forma de pago</label>
                          <CFormSelect size="sm" className="mb-3" aria-label="Small select example">
                            <option>-</option>
                            <option value="1">Contado</option>
                            <option value="2">Crédito</option>
                            <option value="3">Anticipo</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <label>Nombre del Solicitante</label>
                          <CFormInput placeholder='Nombre Solicitante' />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Teléfono</label>
                          <CFormInputWithMask 
                            mask="000 000 0000"
                          />
                        </CCol>
                        <CCol xs={6} md={4} className='p-4'>
                          <CFormCheck inline id="inlineCheckbox1" value="Alkon" label="Alkon" />
                          <CFormCheck inline id="inlineCheckbox2" value="Bloqueado" label="Bloqueado" />
                          <CFormCheck inline id="inlineCheckbox3" value="Seguridad" label="Seguridad" />
                        </CCol>
                      </CRow>
                      <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={2}>
                          <label>Tipo Producto</label>
                          <CFormInput disabled value={producto2.Producto} />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Metros Cúbicos</label>
                          <CFormInput />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Elemento a colar</label>
                          <CFormSelect size="sm" className="mb-3" aria-label="Small select example">
                            <option>-</option>
                            {elementos.map((item, index) => (
                              <option key={index} value={item.id}>{item.descripcion}</option>
                            ))}
                          </CFormSelect>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Tipo Bomba: </label>
                          <CFormSelect size="sm" className="mb-3" aria-label="Small select example">
                            <option>-</option>
                            <option value="1">Bomba Pluma</option>
                            <option value="2">Bomba Estacionaria</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Precio Concreto P/U</label>
                          <CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={maskedValue}  // Usamos el valor de la máscara
                            onChange={handleChangeMK}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                      </CRow>
                      <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={2}>
                          <label>Precio Extra</label>
                          <CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={maskedValue}  // Usamos el valor de la máscara
                            onChange={handleChangeMK}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Precio Bomba P/U</label><CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={maskedValue}  // Usamos el valor de la máscara
                            onChange={handleChangeMK}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Subtotal</label>
                          <CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={maskedValue}  // Usamos el valor de la máscara
                            onChange={handleChangeMK}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Total</label>
                          <CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={maskedValue}  // Usamos el valor de la máscara
                            onChange={handleChangeMK}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Fecha Entrega</label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            timeCaption="Hora"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Seleccionar hora"
                          />
  
                        </CCol>
                      </CRow>
                      <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={2}>
                          <label>Hora Llegada</label><br/>
                          <TimePicker
                            className='clockSel'
                            showSecond={false}  // Deshabilitar la selección de segundos
                            value={time}
                            onChange={handleClockCh}
                            format="HH:mm"
                            minuteStep={5}  // Configura los minutos a intervalos de 5 minutos
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>M3 Viaje</label>
                          <CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={maskedValue}  // Usamos el valor de la máscara
                            onChange={handleChangeMK}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Tiempo Recorrido</label><br/>
                          <TimePicker
                            className='clockSel'
                            showSecond={false}  // Deshabilitar la selección de segundos
                            value={time}
                            onChange={handleClockCh}
                            format="HH:mm"
                            minuteStep={5}  // Configura los minutos a intervalos de 5 minutos
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Tiempo Descarga</label>
                          <TimePicker defaultValue={moment()} showMinute={false} />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Frecuencia de Envío</label>
                          <TimePicker defaultValue={moment()} showMinute={false} />
                        </CCol>
                      </CRow>
                      <CRow className='mt-2 mb-2'>
                        <CCol xs={6} md={4}>
                          <label>Observaciones</label>
                          <CFormTextarea
                            className="mb-3"
                            placeholder="Observaciones"
                          ></CFormTextarea>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <CFormLabel htmlFor="xm">Recibe en Obra</CFormLabel>
                          <CFormInput type="text" id="robra" placeholder="-" aria-describedby="-" />
                        </CCol>
                        <CCol xs={6} md={3}>
                          <div className="mb-3">
                            <CFormInput type="file" id="formFile" label="Examinar" />
                          </div>
                        </CCol>
                      </CRow>
                    </CTabPanel>
                  ))}
                </CTabContent>
              </CTabs>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol xs={6} md={6}>
                <button className='btn btn-warning' onClick={previousStep}>Anterior</button>
              </CCol>
              <CCol xs={6} md={6}>
                <button className='btn btn-success' onClick={handleSave}>Finalizar</button>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </div>
    )
  };
export default Step3;