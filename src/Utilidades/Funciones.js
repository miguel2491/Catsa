
import axios from 'axios'
import {FormatoFca, Fnum} from './Tools'
import { format } from 'date-fns';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
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
    console.log(response.data);
    getPermisos();
    }
    catch(error)
    {
    console.log(error);
    }finally{

    }
}
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
                //console.log(obj);
                if(obj.length > 0)
                {
                    return obj;
                }else{return false}
            }else{return false}
        } 
        catch(error)
        {
            console.log(error);
            return false
        }
    }
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
            //console.log(obj);
            if(obj.length > 0)
            {
                return obj;
            }else{return false}
        }else{return false}
    } 
    catch(error)
    {
        console.log(error);
        return false
    }
}
// VENTAS
    //---COTIZADOR
export  async function getPrecios(planta)
  {
    console.log(planta);
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
                console.log(obj);
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
//--
export async function getClientesCot(planta, cliente) {
    console.log(planta, cliente)
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
        const response = await axios.get(baseUrl+'Comercial/GetClientesCot/'+planta+','+cliente, confi_ax);
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
export async function getObrasCot(planta, obra) {
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
        const response = await axios.get(baseUrl+'Comercial/GetObraCot/'+planta+','+obra, confi_ax);
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
        console.log(response.data);
        if (response.data && response.data.length > 0 && response.data[0].Rows) {
            const objPlanta = response.data[0].Rows;
            const objAsesores = response.data[1].Rows;
            console.log(objPlanta, objAsesores);
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
        console.log(error);
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
        console.log(error);
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
// INTERFAZ
  // 
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
        console.log(obj);
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
        console.log(error);
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
        console.log(obj);
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
        console.log(obj);
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
        console.log(obj);
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
        console.log(obj);
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
        console.log(error);
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
        console.log(obj);
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
        console.log(obj);
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
        console.log(error);
    }
}
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(obj)
        if(obj && obj.length > 0)
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
//UTILITIES
// Función para formatear el número a formato de dinero
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN', // Cambia a la moneda que necesites
  }).format(value);
};

