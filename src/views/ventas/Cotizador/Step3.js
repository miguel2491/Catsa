
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
  CImage,
} from '@coreui/react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { getElementos, setCotizacion, setPedidosCot } from '../../../Utilidades/Funciones';
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch, cilTrash, cilPlus } from '@coreui/icons'
import { Rol } from '../../../Utilidades/Roles'
import '../../../estilos.css'
import Cookies from 'universal-cookie'

const Step3 = ({ previousStep, fData, pData, sucursal, onSave }) => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    //******************************************************************** VARS **************************************************************************************** */
    const [maskedValue, setMaskedValue] = useState('');
    const [price, setPrice] = useState('');
    const inputRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date());
    const [time, setTime] = useState(null);
    const [elementos, setElementos] = useState([]);
    const [sFPago, setFPago] = useState("-");
    const [cM3, setCM3] = useState("-");
    const [productos, setProductos] = useState(pData);
    const [idCot_, setIdCot_] = useState("-");
    //const [cotizacion, setCotizacion] = useState(fData);
    const [aPedido,setAPedido] = useState({
      Pago:'-'
    })
    //***************************************************************************************************************************************************************** */
    useEffect(() => {
      getElementos_();
      // const updCot = fData.map(coti => ({
      //   ...cotizacion
      // }));
      // const updData = pData.map(producto => ({
      //   ...producto
      // }));
      console.log(fData)
    },[pData]);
    //***************************************************************** FUNCIONES ***************************************************************************************** */
    async function getElementos_()
    {
      try{
        const elementos = await getElementos();
        if(elementos){
          setElementos(elementos);
        }    
      }catch(error){
        console.log(error)
        //Swal.fire("Error", "No se pudo obtener la información de Elementos a colar", "error");
      }
    }
    //***************************************************************************************************************************************************************** */
    const handleSave = () => {
      // Aquí puedes manejar la lógica para guardar los datos
      console.log("Guardando datos...", fData);
      const resulSend = {
        cP:{
          "idCotizacion": fData.idCotizacion,
          "planta": fData.planta,
          "noCliente":fData.noCliente,
          "noObra":fData.noObra,
          "Cliente":fData.Cliente,
          "Obra":fData.Obra,
          "Direccion":fData.Direccion,
          "contacto":fData.contacto,
          "idVendedor":fData.idVendedor,
          "usuarioCreo":fData.usuarioCreo,
          "flagIVA":0,
          "flagTotal":0,
          "flagCondiciones":0,
          "estatus":fData.estatus,
          "cotAnterior":fData.cotAnterior,
          "fuente":1,
          "coordenadaR":fData.coordenadaR,
          "coordenada":fData.coordenada,
          "flagObservaciones":0,
          "segmento":fData.segmento,
          "canal":fData.canal
        },
        td:{
          Cantidad:0,
          Producto:pData[0].Producto,
          MOP:0.0,
          M3Bomba:0.0,
          Bomba:0.0,
          Precio:0.0,
          MB:0.0,
          FlagVoBo:false,
          UsuarioAutoriza:null,
          Autoriza:0,
          Comentario:'-',
          FlagImprimir:false,
        },
        tE:{
          Producto: "",
          IdExtra: 0,
          Cantidad: 0.0,
          PrecioUser: 0.0
        }
      };
      const jsonCot =  JSON.stringify(resulSend,null,2);
      // Aquí iría la llamada a la API o la lógica de persistencia que necesites
      Swal.fire({
          title: 'Cargando...',
          text: 'Estamos obteniendo la información...',
          didOpen: () => {
              Swal.showLoading();  // Muestra la animación de carga
              saveCotizacion(jsonCot)
          }
      });
    };
    const saveCotizacion = async(jsonCot) =>{
      try{
        const ocList = await setCotizacion(jsonCot);
        console.log(ocList)
        if(ocList)
        {
          setIdCot_(parseInt(ocList))
          const rSendPList = pData.map((producto, index) =>{
            const rSendP = {
              "IdPedido": 0,
              "Planta": sucursal,
              "NoObra":producto.NoObra,
              "Producto":producto.Producto,
              "PrecioProducto":producto.PrecioProducto,
              "CantidadM3":producto.CantidadM3,
              "CodBomba":producto.CodBomba,
              "PrecioBomba":producto.PrecioBomba,
              "FechaHoraPedido":"2025-02-26T08:35:00",
              "TRecorrido":producto.TRecorrido,
              "M3Viaje":producto.M3Viaje,
              "Espaciado":producto.Espaciado,
              "UsuarioCreo":cookies.get('Usuario'),
              "UsuarioActualizo":producto.UsuarioActualizo,
              "FechaCreacion":"2025-02-21T08:35:00",
              "FechaActualizacion":"2025-02-21T01:00:00",
              "eliminar":0,
              "TDescarga":0,
              "Seguridad":1,
              "hrSalida":"2025-02-21T08:25:59",
              "PrecioExtra":0.0,
              "Observaciones":"-",
              "Crear":1,
              "Recibe":producto.Recibe,
              "Elemento":producto.Elemento,
              "Pago":producto.Pago,
              "Aumento":0,
              "activo":0,
              "AumentoMayor10":0,
              "CambioPrecio":0,
              "UTM":"19.26093,-98.89102",
              "PlantaEnvio":sucursal,
              "S_Bomba":0,
              "Archivos":0, 
              "TReal":"0",
              "Distancia":"0",
              "idCotizacion":parseInt(ocList)
            };
            return rSendP;
          });
          savePedidos(rSendPList);
        }
        //console.log(pData)
      }catch(error){
        Swal.close();
        Swal.fire("Error", "No se pudo obtener la información", "error");
      }
    }
    const savePedidos = async(jsP) =>{
      const jsonPed =  JSON.stringify(jsP,null,2);
      console.log(jsonPed)
      try{
          const ocList = await setPedidosCot(jsonPed);
          if(ocList)
          {
            Swal.close();
            Swal.fire({
              title: "Correcto",
              text: "Se creo la Cotización #"+idCot_,
              icon: "success"
            });
            navigate('/ventas/LCotizacion');
          }
      }catch(error){
        Swal.close();
        Swal.fire({
            title: "ERROR",
            text: "Ocurrio un error, vuelve a intentarlo",
            icon: "error"
        });
      }
    }
    //******************************************************************** HANDLE ****************************************************************************************
    const hFPago = (e, index) => {
      // const updatedData = [...pData];
      // updatedData[index].Pago = e.target.value;  // Actualizamos el valor de FormaPago
      // setPData(updatedData);  // Actualizamos el estado
      const newProductos = [...pData];
      newProductos[index].Pago = e.target.value;
      setProductos(newProductos);
    }
    const hSolicitante = (e, index) => {
      const newProductos = [...pData];
      newProductos[index].Recibe = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(newProductos);  // Actualizamos el estado
    }
    const hTelefono = (e, index) => {
      const newProductos = [...pData];
      newProductos[index].Telefono = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(newProductos);  // Actualizamos el estado
    }
    const hCantidadM3 = (e, index) => {
      const newProductos = [...pData];
      newProductos[index].CantidadM3 = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(newProductos);  // Actualizamos el estado
    }
    const hElementoColar = (e, index) => {
      const newProductos = [...pData];
      newProductos[index].Elemento = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(newProductos);  // Actualizamos el estado
    }
    const hTBomba = (e, index) => {
      const newProductos = [...pData];
      newProductos[index].CodBomba = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(newProductos);  // Actualizamos el estado
    }
    const hPrecioConcreto = (e, index) => {
      const newProductos = [...pData];
      newProductos[index].PrecioProducto = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(newProductos);  // Actualizamos el estado
    }
    const hPrecioExtra = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].PrecioExtra = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(updatedData);  // Actualizamos el estado
    }
    const hPrecioBomba = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].PrecioBomba = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(updatedData);  // Actualizamos el estado
    }
    const hSubtotal = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].PrecioProducto = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(updatedData);  // Actualizamos el estado
    }
    const hTotal = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].PrecioProducto = e.target.value;  // Actualizamos el valor de FormaPago
      setProductos(updatedData);  // Actualizamos el estado
    }
    const hFcaEntrega = (e, index) => {
      const fca = e.target.value;
      const [fecha_, hora_] = fca.split("T");
      const updatedData = [...pData];
      updatedData[index].FechaHoraPedido = fca; 
      setProductos(updatedData);  // Actualizamos el estado
    }
    const hHraEntrega = (e, index) => {
      const fca = e.target.value;
      const [fecha_, hora_] = fca.split("T");
      const updatedData = [...pData];
      updatedData[index].HoraPedido = fcahora_; 
      setProductos(updatedData);  // Actualizamos el estado
    }
    const hMViaje = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].M3Viaje = e.target.value; 
      setProductos(updatedData); 
    }
    const hTRecorrido = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].TRecorrido = e.target.value; 
      setProductos(updatedData); 
    }
    const hTDescarga = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].TDescarga = e.target.value; 
      setProductos(updatedData); 
    }
    const hFEnvio = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].Espaciado = e.target.value; 
      setProductos(updatedData); 
    }
    const hObservaciones = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].Observaciones = e.target.value; 
      setProductos(updatedData); 
    }
    const hRecibeObra = (e, index) => {
      const updatedData = [...pData];
      updatedData[index].Recibe = e.target.value; 
      setProductos(updatedData); 
    }
    const handleClockCh = (value) => {
      const newProductos = [...pData];
      newProductos[index].Hora = value;
      setTime(value);
      console.log('Hora seleccionada:', value ? value.format('HH:mm') : 'No seleccionada');
    }
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
    //****************************************************************************************************************************************************************************** */
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
    const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
      <CFormInput {...props} ref={inputRef} />
    ))
    //*********************************************************************************************************************************************************************************** */
    return(
      <div>
        <CCard>
          <CCardHeader>Paso 3</CCardHeader>
          <CCardBody>
            <CRow className='mt-3'>
              <CTabs activeItemKey={1}>
                <CTabList variant='tabs'>
                  {pData.map((producto, index) =>(
                    <CTab itemKey={producto.Producto} key={index}>{producto.Producto}</CTab>
                  ))}
                </CTabList>
                <CTabContent>
                  {pData.map((producto2, index) =>(
                    <CTabPanel className='p-3' key={index} itemKey={producto2.Producto}>
                      <CRow>
                        <CCol xs={6} md={2}>
                          <label>Forma de pago</label>
                          <CFormSelect size="sm" className="mb-3" value={producto2.Pago} onChange={(e) => hFPago(e, index)}>
                            <option value="-">-</option>
                            <option value="Contado">Contado</option>
                            <option value="Credito">Crédito</option>
                            <option value="Anticipo">Anticipo</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <label>Nombre del Solicitante</label>
                          <CFormInput placeholder='Nombre Solicitante' value={producto2.Recibe} onChange={(e)=>hSolicitante(e, index)} />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Teléfono</label>
                          <CFormInputWithMask 
                            mask="000 000 0000"
                            value={producto2.Telefono}
                            onChange={(e) => hTelefono(e, index)}
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
                          <CFormInput value={producto2.CantidadM3} onChange={(e) => hCantidadM3(e, index)} />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Elemento a colar</label>
                          <CFormSelect size="sm" className="mb-3" value={producto2.Elemento} onChange={(e)=>hElementoColar(e, index)}>
                            <option value="-">-</option>
                            {elementos.map((item, index) => (
                              <option key={index} value={item.descripcion}>{item.descripcion}</option>
                            ))}
                          </CFormSelect>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Tipo Bomba: </label>
                          <CFormSelect size="sm" className="mb-3" value={producto2.CodBomba} onChange={(e)=>{hTBomba(e, index)}}>
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
                            value={producto2.PrecioProducto}  // Usamos el valor de la máscara
                            onChange={(e) => {hPrecioConcreto(e, index)}}
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
                            value={producto2.PrecioExtra}  // Usamos el valor de la máscara
                            onChange={(e)=>hPrecioExtra(e, index)}
                            onBlur={handleBlurMK}  // Aplicamos la máscara al perder el foco
                          />
                        </CCol>
                        <CCol xs={6} md={2}>
                          <label>Precio Bomba P/U</label><CFormInput
                            ref={inputRef}
                            id="price"
                            name="price"
                            value={producto2.PrecioBomba}  // Usamos el valor de la máscara
                            onChange={(e)=>hPrecioBomba(e, index)}
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
                            value={producto2.M3Viaje}  // Usamos el valor de la máscara
                            onChange={(e)=>hMViaje(e, index)}
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
                            value={producto2.Observaciones}
                            onChange={(e)=>hObservaciones(e,index)}
                          ></CFormTextarea>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <CFormLabel htmlFor="xm">Recibe en Obra</CFormLabel>
                          <CFormInput type="text" id="robra" placeholder="-" value={producto2.Recibe} onChange={(e)=>hRecibeObra(e, index)} />
                        </CCol>
                        {(!producto2.Archivos) && (
                        <CCol xs={6} md={3}>
                          <div className="mb-3">
                            <CFormInput type="file" id="formFile" label="Examinar" />
                          </div>
                        </CCol>
                        )}
                        {(producto2.Archivos) && (
                        <CCol xs={6} md={3}>
                          {/* <CImage rounded thumbnail src={`http://apicatsa.catsaconcretos.mx:2543/Uploads/DocPedidos/${producto2.IdPedido}/${producto2.IdPedido}.png`} width={500} height={320} /> */}
                        </CCol>
                        )}
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
                <button className='btn btn-warning btnW' onClick={previousStep}>Anterior</button>
              </CCol>
              <CCol xs={6} md={6}>
                <button className='btn btn-success btnW' onClick={handleSave}>Finalizar</button>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </div>
    )
  };
export default Step3;