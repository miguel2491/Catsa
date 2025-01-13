import axios from 'axios'
import {FormatoFca, Fnum} from './Tools'
import { format } from 'date-fns';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
//****************************************************************************************************************************************************************************** */
// LOGIN
export async function getRol()
    {
      try{
        let confi_ax = 
          {
            headers:
            {
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              "Authorization": "Bearer "+cookies.get('token'),
            }
        }
        const response = await axios.get(baseUrl+'Login/GetUserRol/'+cookies.get('idUsuario'), confi_ax);
        cookies.set('roles', JSON.stringify(response.data), {path: '/'});
        //getPermisos();
      }
      catch(error)
      {
        console.log(error);
      }finally{
    
      }
    }
export async function getPermisos()
{
    try{
    let confi_ax = 
        {
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+cookies.get('token'),
        }
    }
    const response = await axios.get(baseUrl+'Login/GetUserRol/'+cookies.get('idUsuario'), confi_ax);
    cookies.set('permisos', JSON.stringify(response), {path: '/'});
    getPermisos();
    }
    catch(error)
    {
    console.log(error);
    }finally{

    }
}
//****************************************************************************************************************************************************************************** */
// CATALOGOS
export async function getElementos() {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Catalogo/GetElementos', confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
//****************************************************************************************************************************************************************************** */
//LOGISTICA
    // Pedidos
    export async function getPedidos(planta) {
        try
        {
            let confi_ax = {
                headers:
                {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer "+cookies.get('token'),
                },
            };
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const response = await axios.get(baseUrl+'Logistica/GetPedidosAc/'+planta+","+cookies.get('Usuario')+"?Tipo=S", confi_ax);
            if (response.data && response.data.length > 0 && response.data[0].Rows) {
                const obj = response.data[0].Rows;
                if(obj.length > 0)
                {
                    return obj;
                }else{return false}
            }else{return false}
        } 
        catch(error)
        {
            return false
        }
    }
//****************************************************************************************************************************************************************************** */
// OPERACIONES
    // CICAT
export async function getResInv(material, FI, FF, planta) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetInv/'+material+','+planta+','+fcaI+','+fcaF+',I', confi_ax);
        if (response.data && response.data.length > 0 && response.data[0].Rows) {
            const obj = response.data[0].Rows;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getSimuladorInv(planta, FI, FF) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'CB/GetSimulador/'+planta+','+fcaI+','+fcaF, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getSimuladorPro(planta) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetSimProducto/'+planta+',0,0', confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getSimuladorProInd(planta, producto) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetSimProducto/'+planta+','+producto+',1', confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getRemFaltante(planta, FI, FF) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetRemFal/'+planta+','+fcaI+','+fcaF, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function setRemFaltante(Id,Nr, planta, tipo) {
    const usuario = cookies.get('Usuario');
    if(usuario.length == 0)
    {
        return false;
    }
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/SetRemFal/'+Id+','+Nr+','+planta+','+tipo+','+cookies.get('Usuario'), confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
    // MANTENIMIENTO
export async function getOCompras(planta, FI, FF) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetOCompra/'+planta+','+fcaI+','+fcaF, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getVehiculos(planta, grupo) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetVehiculo/'+planta+','+grupo+',0', confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function setOCompra(data, tipo) {
    var Truta = tipo === '0' ? 'Operaciones/setOCompras':'Operaciones/updOCompras';
    const userID = cookies.get('idUsuario');
    data.userId = userID;
    if(tipo === '0'){
        delete data.id;
    }
    console.log(data)
    const fData = new FormData();
    fData.append("oC", JSON.stringify({
        id: data.id,
        userId: cookies.get('idUsuario'),
        planta: data.planta,
        fecha: data.fecha,
        nFactura: data.nFactura,
        descripcion: data.descripcion,
        tipoMant: data.tipoMant,
        idVehiculo: data.idVehiculo,
        descMant: data.descMant
    }));
    if (data.file) {
        // Ahora asegurémonos de agregarlo
        fData.append("image", data.file);
    } else {
        console.log("No se encontró el archivo en data.file");
    }
    for (let pair of fData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+Truta, fData, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function setStatusOC(id, tipo) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+"Operaciones/EstatusOC/"+id+","+tipo, confi_ax);
        return response.data
    } 
    catch(error)
    {
        return false
    }
}
export async function getOComprasInd(id) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetOCompraInd/'+id, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function delOCompra(id) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+"Operaciones/delOCompras/"+id, confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function addNFac(id, nFac) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const data = {
            'id':id,
            'nFactura':nFac
        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+"Operaciones/setNFac", data, confi_ax);
        const {message} = response.data;
        var band = false;
        // Validar el mensaje de la respuesta y mostrar el mensaje correspondiente
        if (message === "Actualización exitosa.") {
            band = true;
        }
        return band
    } 
    catch(error)
    {
        return false
    }
}
//****************************************************************************************************************************************************************************** */
// VENTAS
    //---COTIZADOR
export  async function getPrecios(planta)
  {
    try
        {
            let confi_ax = 
                {
                headers:
                {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer "+cookies.get('token'),
                }
            }
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            await axios.get(baseUrl+'Comercial/GetPreciosPla/'+'C,ti,'+planta+',2024-10-31,1932.65', confi_ax)
            .then(response=>{
              var obj = response.data;
              var tOne = obj[0].Rows;
              var tTwo = obj[1].Rows;
              var tThree = obj[2].Rows;
              var tFour = obj[3].Rows;
              var tFive = obj[4].Rows;
              var tSix = obj[5].Rows;
                setDatosPla(tOne)
                setDatosMop(tTwo);
                setDFuente(tFour);
                setTC(tSix);
                //Swal.fire("CORRECTO", "PARTE1", "success");
                //return response.data;
            })
            .catch(err=>{
                if (err.response) {
                    // El servidor respondió con un código de estado fuera del rango de 2xx
                    console.error('Error de Respuesta:', err.response.data);
                } else if (err.request) {
                    // La solicitud fue realizada pero no se recibió respuesta
                    console.error('Error de Solicitud:', err.request);
                } else {
                    // Algo sucedió al configurar la solicitud
                    console.error('Error:', err.message);
                }
            })    
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            console.error(error);
        }
}
export  async function GetCotizaciones(FI, FF,planta)
{
    console.log(FI,FF,planta)
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetCotizaciones/'+fcaI+","+fcaF+","+cookies.get('Usuario')+","+planta, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
//--
export async function getClientesCot(planta) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetClientesCot/'+planta, confi_ax);
        if (response.data && response.data.length > 0) {
            return response.data;
        }else{
            return false
        }
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
export async function getObrasCot(planta, nocliente) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetObraCot/'+planta+','+nocliente, confi_ax);
        if (response.data && response.data.length > 0) {
                return response.data;
        }else{
            return false
        }
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
export async function getProyeccion(FI, FF, planta, Tipo) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetAsesores/'+fcaI+','+fcaF+','+planta+',0', confi_ax);
        if (response.data && response.data.length > 0 && response.data[0].Rows) {
            const objPlanta = response.data[0].Rows;
            const objAsesores = response.data[1].Rows;
            if(objPlanta.length > 0 && objAsesores.length > 0)
            {
                return {
                    planta: {
                        data: objPlanta,
                        totalCount: objPlanta.length
                    },
                    asesores: {
                        data: objAsesores,
                        totalCount: objAsesores.length
                    }
                };
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getAllVendedores() {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Usuarios/GetVendedores', confi_ax);
        if (response.data.length > 0) {
            return response.data;
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
export async function getClientesAsesor(codigoV) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetCartera/'+codigoV, confi_ax);
        if (response.data && response.data.length > 0) {
            return response.data;
        }else{return false}
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
export async function getCostoP(planta) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetPreProPla/'+planta, confi_ax);
        if (response.data && response.data.length > 0) {
            return response.data;
        }else{return false}
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
export async function getDatosPlanta(planta, fecha, cpc)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetDatosPlanta/C,'+planta+','+cookies.get('Usuario')+','+fecha+','+cpc, confi_ax);
        if (response.data && response.data.length > 0)
        {
            const objAutoriza = response.data[0].Rows;
            const objCostoExtra = response.data[1].Rows;
            const objComisiones = response.data[2].Rows;
            const objOrigen = response.data[3].Rows;
            const objSegmento = response.data[4].Rows;
            const objCanal = response.data[5].Rows;
            return {
                autoriza: {
                    data: objAutoriza,
                    totalCount: objAutoriza.length
                },
                costo_extra: {
                    data: objCostoExtra,
                    totalCount: objCostoExtra.length
                },
                comisiones: {
                    data: objComisiones,
                    totalCount: objComisiones.length
                },
                origen: {
                    data: objOrigen,
                    totalCount: objOrigen.length
                },
                segmento: {
                    data: objSegmento,
                    totalCount: objSegmento.length
                },
                canal: {
                    data: objCanal,
                    totalCount: objCanal.length
                }
            };
        }else{
            return false
        }
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
export async function getProspectos_() {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Comercial/GetProspectos/0,'+cookies.get('Usuario'), confi_ax);
        if (response.data && response.data.length > 0) {
            return response.data;
        }else{
            return false
        }
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
//****************************************************************************************************************************************************************************** */
// INTERFAZ
  // CB
export async function getProductoIF(planta, FI)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Inte/GetAlkonPr/'+planta+','+fcaI, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getAlkon(FI)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'CB/GetSendAlkon/'+fcaI, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getObras(noCliente)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'CB/GetObras/'+NoCliente, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
        console.log(error);
    }
}
export async function getProducto(Producto)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'CB/GetProducto/'+Producto, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
        console.log(error);
    }
}
export async function resetCliente(noCliente, Enviado, Eliminar)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
            data: {
                NoCliente: noCliente,
                Enviado: Enviado,
                Eliminar: Eliminar,
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.put(baseUrl+'CB/setObra', confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
        console.log(error);
    }
}
export async function resetProducto(Planta, Producto, Enviado, Eliminar)
{
    try
    {
        const data = {
            'Planta':Planta,
            'Item_Code':Producto,
            'Enviado':Enviado,
            'Eliminar':Eliminar,
        }
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
            
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+'CB/setProductoSend', data, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
        console.log(error);
    }
}
//****************************************************************************************************************************************************************************** */
// Intelisis
export async function getBitacoraI(FI)
{
    
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Inte/GetBitacoraCISA/'+fcaI, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
        console.log(error);
    }
}
export async function getMovimientos(FI)
{
    
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Inte/GetMovimientosBitacora/'+fcaI, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getProductosI()
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Inte/GetArticulos', confi_ax);
        
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getMaterialesI(Producto)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Inte/GetArticuloMaterial/'+Producto, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}  
//****************************************************************************************************************************************************************************** */
// Configuraciones
export async function getPlantasCon()
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'CB/GetPlantas', confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getPlantaCB(planta)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'CB/GetPlantaCB/'+planta, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function setPlantaCB(planta)
{
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const data = {
            "Planta":planta
        }
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+'CB/SetPlantasCB', data, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
//--------------------
export async function getResInvCB(material, FI, FF, planta) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        const fcaI = FormatoFca(FI);
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetInv/'+material+','+planta+','+fcaI+','+fcaF+',C', confi_ax);
        var obj = response.data[0].Rows;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
//****************************************************************************************************************************************************************************** */
//REPORTES
export async function getPedidoInd(npedido) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Logistica/GetPedidoI/'+npedido, confi_ax);
        var obj = response.data[0]?.Rows;
        if(obj && obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getObraInd(obra, planta) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Logistica/GetObra/'+obra+","+planta, confi_ax);
        var obj = response.data[0]?.Rows;
        if(obj && obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getComisionesR(mes, periodo) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Reportes/GetComisionesR/'+mes+","+periodo+",0,0", confi_ax);
        var obj = response.data;
        if(obj && obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
export async function getDetalleComR(mes, periodo, usuario) {
    try
    {
        let confi_ax = {
            headers:
            {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Reportes/GetComisionesR/'+mes+","+periodo+",1,"+usuario, confi_ax);
        var obj = response.data;
        if(obj && obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }
}
//****************************************************************************************************************************************************************************** */
//UTILITIES
// Función para formatear el número a formato de dinero
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN', // Cambia a la moneda que necesites
  }).format(value);
};

export const convertArrayOfObjectsToCSV = (array) => {
    if (!array || !array.length) return null;
    const header = Object.keys(array[0]).join(','); // Extrae las claves como cabeceras
    const rows = array.map(obj => Object.values(obj).join(',')); // Mapea los valores en cada fila
    return [header, ...rows].join('\n'); // Une todo en una cadena CSV
};
