import axios from 'axios'
import {FormatoFca, Fnum} from './Tools'
import { format } from 'date-fns';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
import Swal from "sweetalert2";
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:5001/api/";
const baseUrlS="https://apicatsa2.catsaconcretos.mx:2533/api/";
const baseUrl2S="https://localhost:5001/api/";
//****************************************************************************************************************************************************************************** */
// LOGIN
// =================================================================
  //             OBTENER TOKEN GENÉRICO
  // =================================================================
  export async function GetToken() {
    const postData = { UserName: "ProCatsa", Password: "ProCatsa2024$." };
    const confi_ax = {
    //   headers: {
    //     "Content-Type": "application/json;charset=UTF-8",
    //     "Access-Control-Allow-Origin": "*",
    //   },
        headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.get("token"),
      },
    };
    try {
      const response = await axios.post(baseUrl + "Login/Login", postData, confi_ax);
      cookies.set("token", response.data, { path: "/" });
    } catch (error) {
      console.error("Error obteniendo token", error);
    }
  }
  export async function  GetUsuarios() {
    let confi_ax = {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        }
    };
    try {
      const response = await axios.post(baseUrl + "Usuarios/GetUsers", confi_ax);
        if (response.data && response.data.length > 0) {
            const obj = response.data;
            if(obj.length > 0)
            {
                return obj;
            }else{
                return false
            }
        }else{return false}
    } catch (error) {
      console.error("Ocurrio un Error", error);
    }
  }
// =================================================================
//                      INICIAR SESIÓN
// =================================================================
export async function Sesion(username, password) {
    
    try {
      const postData = { usuario: username, pass: password };
      const confi_ax = {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.get("token"),
        },
      };
      const response = await axios.post(baseUrl + "Login/GetUsuario", postData, confi_ax);
      const userInfo = response.data;
      return userInfo;
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire("Error", "Usuario/Contraseña incorrecta, vuelve a intentar", "error");
      return false;
    }
}
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
export function findLogin()
{
    const isLoggedIn = cookies.get('idUsuario') !== undefined;
      if (!isLoggedIn) {
        // Si no está logueado, redirige a la página de login
        return false;
      }
      // Si está logueado, renderiza el componente
      return true;
}
export async function getIdVendedor()
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
        const response = await axios.get(baseUrl+'Comercial/FindVendedor/'+cookies.get('idUsuario'), confi_ax);
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
export async function getNotificaciones()
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
        const response = await axios.get(baseUrl+'Login/GetNotificaciones/'+cookies.get('Usuario'), confi_ax);
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
export async function setNotificacion(id)
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
        const response = await axios.get(baseUrl+'Login/SetReadNotificacion/'+id, confi_ax);
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
export async function makeNotificacion(userDestino, categoria, titulo, desc, url)
{
    const fData = new FormData();
    fData.append("nO", JSON.stringify({
        usuarioCreo: cookies.get('Usuario'),
        usuarioDestino: userDestino,
        categoria: categoria,
        titulo: titulo,
        descripcion: desc,
        url: url,
    }));
    for (let pair of fData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
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
        const response = await axios.post(baseUrl+'Login/setNotificacion', confi_ax);
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
// DASHBOARD
export async function getPedidosD()
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
        const response = await axios.get(baseUrl+'Operaciones/GetPedidos/0', confi_ax);
        if (response.data && response.data.length > 0) {
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
export async function GetCotizacionesR()
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
        const response = await axios.get(baseUrl+'Comercial/GetCotizacionesR', confi_ax);
        if (response.data && response.data.length > 0) {
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
export async function getPedidosS()
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
        const response = await axios.get(baseUrl+'Operaciones/GetPedidos/1', confi_ax);
        if (response.data && response.data.length > 0) {
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
export async function getPedidosPS()
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
        const response = await axios.get(baseUrl+'Operaciones/GetPedidos/2', confi_ax);
        if (response.data && response.data.length > 0) {
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
export async function getPedidosM()
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
        const response = await axios.get(baseUrl+'Operaciones/GetPedidos/3', confi_ax);
        if (response.data && response.data.length > 0) {
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
export async function getPlantas() {
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
        const response = await axios.get(baseUrl+'Administracion/GetPlantas/'+cookies.get('Usuario'),confi_ax);
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
export async function getVendedores(planta) {
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
        const response = await axios.get(baseUrl+'Catalogo/GetVendedores/'+planta,confi_ax);
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
export async function getCategoriaVenta() {
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
        const response = await axios.get(baseUrl+'Catalogo/GetCategoriaVenta',confi_ax);
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
export async function getTutoriales() {
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
        const response = await axios.get(baseUrl+'Catalogo/GetVideos',confi_ax);
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
export async function setVideoUpload(data) {
    const fData = new FormData();
    fData.append("uV", JSON.stringify({
        titulo: data.titulo,
        categoria: data.categoria,
        descripcion: data.descripcion
    }));
    if (data.file) {
        // Ahora asegurémonos de agregarlo
        fData.append("video", data.file);
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
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+cookies.get('token'),
            },
        };
        
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Catalogo/SetVideo',fData,confi_ax);
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
export async function getCategoriasOC() {
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
        const response = await axios.get(baseUrl+'Comercial/GetCategoriasVentas', confi_ax);
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
export async function setCategorias(data) {
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
        const fData = new FormData();
        fData.append("vC", JSON.stringify({
            id: data.id,
            categoria: data.categoria,
            cantidad_min: data.cantidad_min,
            cantidad_max: data.cantidad_max,
            estatus: data.estatus,
            periodo:data.periodo,
            ejercicio:data.ejercicio
        }));
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+'Comercial/setCategoriaVen', data, confi_ax);
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
export async function getCatId(id) {
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
        const response = await axios.get(baseUrl+'Comercial/GetCategoriaId/'+id, confi_ax);
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
export async function delCatId(id) {
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
        const response = await axios.delete(baseUrl+'Comercial/GetDeleteCV/'+id, confi_ax);
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
export async function getPlantasOC(mes,periodo) {
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
        const response = await axios.get(baseUrl+'Comercial/GetObjComPlaGn/'+mes+','+periodo, confi_ax);
        console.log(response)
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
export async function getPlantasOCId(planta,mes,periodo) {
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
        const response = await axios.get(baseUrl+'Comercial/GetObjComPlanta/'+planta+','+mes+','+periodo, confi_ax);
        console.log(response)
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
export async function savePlaOC(data) {
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
        const fData = new FormData();
        fData.append("vC", JSON.stringify({
            id: data.id,
            planta: data.planta,
            mes: data.mes,
            periodo: data.periodo,
            TR: parseInt(data.TR),
            TB: parseInt(data.TB),
            obj_aju: parseFloat(data.obj_aju)
        }));
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+'Comercial/setObjComPla', data, confi_ax);
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
export async function delPlaOC(id) {
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
        const response = await axios.delete(baseUrl+'Comercial/GetDeleteObjComPla/'+id, confi_ax);
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
export async function  setEntradasD(planta, FI, FF) {
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
        const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',ED', confi_ax);
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

export async function getMovs(plantas, FI, FF)
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
        const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+plantas+','+fcaI+','+fcaF+',M', confi_ax);
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
        //const fcaI = FormatoFca(FI);
        //const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetInv/'+material+','+planta+','+FI+','+FF+',I', confi_ax);
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
export async function setRemFaltante(Id,Nr, planta, tipo, razon) {
    const usuario = cookies.get('Usuario');
    let nRe = Nr == '' ? 0:Nr;
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
        const response = await axios.get(baseUrl+'Operaciones/SetRemFal/'+Id+','+nRe+','+planta+','+tipo+','+cookies.get('Usuario')+','+razon, confi_ax);
        console.log(nRe,response)
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
    //PCancelados
export async function getCmbsAreas(tipos,id){
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
        const response = await axios.get(baseUrl+'Catalogo/GetCmb/'+tipos+","+id, confi_ax);
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
export async function getPCancelados(planta, FI, FF, tipo, estatus) {
    const fcaI = FormatoFca(FI);
    const fcaF = FormatoFca(FF);
    var urlB = tipo =="G" ? "GetPCanceladosGn/"+planta+','+fcaI+','+fcaF:"GetPCanceladosRh/"+planta+','+fcaI+','+fcaF+','+estatus;
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
        const response = await axios.get(baseUrl+'Operaciones/'+urlB, confi_ax);
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
export async function getPCanceladoI(id) {
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
        const response = await axios.get(baseUrl+'Operaciones/GetPCancelado/'+id, confi_ax);
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
export async function getPCanceladoGn(id) {
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
        const response = await axios.get(baseUrl+'Operaciones/GetPCanceladoGn/'+id, confi_ax);
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
export async function setTicketCancel(data, tipo) {
    const userID = cookies.get('idUsuario');
    data.userId = userID;
    if(tipo === '0'){
        delete data.id;
    }
    let usuario_ = cookies.get('Usuario') == undefined ? "-":cookies.get('Usuario');
    const fData = new FormData();
    fData.append("pC", JSON.stringify({
        id_cancelados: data.id_cancelados,
        id_ticket:data.id_ticket,
        usuarioCreo: usuario_,
        motivo: data.motivo,
        area: data.area,
        causa: data.causa,
        causante: data.causante,
        cantidad:data.cantidad ? data.cantidad:0,
        r_origen: data.remOrigen,
        r_destino: data.remDestino,
        comentario: data.Comentario,
        clave_planta:data.planta,
        precioConcreto:data.precioConcreto ? data.precioConcreto:0,
        costoMP:data.costoMP ? data.costoMP : 0,
        descripcion:data.Comentario
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
        const response = await axios.post(baseUrl+"Operaciones/setPCan", fData, confi_ax);
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
export async function answTicketCancel(data, tipo) {
    console.log(data)
    let usuario_respuesta = cookies.get('Usuario') == undefined ? "-":cookies.get('Usuario');
    const fData = new FormData();
    fData.append("pC", JSON.stringify({
        id_cancelados: data.id_cancelados,
        id_ticket:data.id_ticket,
        motivo: data.motivo,
        area: data.area,
        causa: data.causa,
        causante: data.causante,
        r_origen: data.remOrigen,
        r_destino: data.remDestino,
        comentario: data.Comentario,
        usuario_respuesta:usuario_respuesta,
        tipo_respuesta:data.Aceptacion,
        cantidad:data.cantidad ? data.cantidad:0,
        precioConcreto:data.precioConcreto ? data.precioConcreto:0,
        costoMP:data.costoMP ? data.costoMP : 0,
        historial:data.Historial,
        usuario_responsable:data.Responsable,
        costo: data.Costo
    }));
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
        const response = await axios.post(baseUrl+"Operaciones/resPCan", fData, confi_ax);
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
        console.log(response)
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
        descMant: data.descMant,
        respuesta:data.respuesta
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
 //REPORTES
export async function getOC(FI, FF) {
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
        const response = await axios.get(baseUrl+'Reportes/GetOCompras/'+fcaI+','+fcaF, confi_ax);
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
export async function getPV(FI, FF, PL) {
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
        //const fcaI = FormatoFca(FI);
        //const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Logistica/GetPedidosVenta/'+FI+','+FF+','+PL, confi_ax);
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
// CALIDAD
    //---ADMIN COSTOS PV
export async function getCostosPV(planta, FI) {
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
        //const fcaI = FormatoFca(FI);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Calidad/getDesign/'+planta+','+FI, confi_ax);
        console.log(response)
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
export  async function getCotizacionId(idCotizacion)
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
        const response = await axios.get(baseUrl+'Comercial/GetCotizacionId/'+idCotizacion, confi_ax);
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
export  async function getCotizacionPedido(idCotizacion)
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
        const response = await axios.get(baseUrl+'Comercial/GetCotizacionPedidos/'+idCotizacion, confi_ax);
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
export  async function setStatus(idCotizacion, estatus)
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
        const response = await axios.get(baseUrl+'Comercial/SetStatus/'+idCotizacion+','+estatus, confi_ax);
        var obj = response.data;
        if(obj)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export  async function getCotizacionExtra(idCotizacion)
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
        const response = await axios.get(baseUrl+'Comercial/GetCotizacionExtras/'+idCotizacion, confi_ax);
        var obj = response.data;
        if(obj)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export  async function getCotizacionLog(idCotizacion)
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
        const response = await axios.get(baseUrl+'Comercial/GetCotizacionLog/'+idCotizacion, confi_ax);
        var obj = response.data;
        if(obj)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export  async function getSegmentos()
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
        const response = await axios.get(baseUrl+'Comercial/GetAcciones', confi_ax);
        var obj = response.data;
        if(obj)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export  async function getSeguimientos(id)
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
        const response = await axios.get(baseUrl+'Comercial/GetSeguimientoCot/'+id, confi_ax);
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
export  async function getClienteCot(id)
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
        const response = await axios.get(baseUrl+'Comercial/GetClienteCot/'+id, confi_ax);
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
export  async function getObraCot(idC, idO)
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
        const response = await axios.get(baseUrl+'Comercial/GetObraCot/'+idO+'/'+idC, confi_ax);
        console.log(response)
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
export  async function getCliObras(idC, idO)
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
        const response = await axios.get(baseUrl+'Comercial/GetObraCot/'+id, confi_ax);
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
export  async function setVisitas(idCot, motivo, lat, lon)
{
    let usuario = cookies.get('Usuario');
    let fechaHra = format(new Date(),'yyyy-MM-dd HH:mm:ss');
    console.log("Registrar visita:", {
        usuario,
        motivo,
        idCot,
        lat,
        lon,
        fechaHra
    });
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
        const data = 
        {
            "id": 0,
            "motivo": motivo,
            "usuario":usuario,
            "fecha_visita":fechaHra.toString(),
            "id_cotizacion":idCot,
            "latitud":lat.toString(),
            "longitud":lon.toString()    
        } 
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.post(baseUrl+'Comercial/setVisitaCot', data, confi_ax);
        var obj = response.data;
        console.log(obj, obj.message)
        if(obj.message == "Creación exitosa.")
        {
            return true
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export  async function getVisitas(idC, motivo)
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
        const response = await axios.get(baseUrl+'Comercial/GetVsistas/'+idC+','+motivo, confi_ax);
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
export  async function getVolComision(planta,obra)
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
        const response = await axios.get(baseUrl+'Comercial/GetVolumenComision/'+planta+','+obra+','+cookies.get('Usuario'), confi_ax);
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
export async function getClientesCartera(planta) {
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
        const response = await axios.get(baseUrl+'Catalogo/GetClienteCartera/'+planta, confi_ax);
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
        const response = await axios.get(baseUrl+'Catalogo/GetObraCartera/'+nocliente+','+planta, confi_ax);
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
export async function getPedidosCot(id) {
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
        const response = await axios.get(baseUrl+'Comercial/GetPedidosCotizacion/'+id, confi_ax);
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
export async function getArchivo(id)
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
        const response = await axios.get(baseUrl+'Comercial/GetPedidoFile/'+id, confi_ax);
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
export  async function setCotizacion(json)
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
        const response = await axios.post(baseUrl+'Comercial/RecibirCotizacion', json, confi_ax);
        var obj = response.data;
        console.log(obj, obj.noCotizacion)
        if(obj.noCotizacion)
        {
            return obj.noCotizacion
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export  async function setPedidosCot(json)
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
        const response = await axios.post(baseUrl+'Comercial/RecibirPedidos', json, confi_ax);
        var obj = response.data;
        console.log(obj.length, obj)
        if(obj.length > 0)
        {
            return true
        }else{return false}
    } 
    catch(error)
    {
        return false;
    }    
}
export async function setEntradas(planta, FI, FF){
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
        const fcaI = format(FI, 'yyyy-MM-dd');
        const fcaF = format(FF, 'yyyy-MM-dd');
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',DE', confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{return false}
    } 
    catch(error)
    {
        return false
    }
}
//---OBJ COMERCIAL
export async function saveOCAs(data) {
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
        const response = await axios.post(baseUrl+'Comercial/setObjComerciales', data, confi_ax);
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
export async function getObjCom(mes,periodo,planta)
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
        const response = await axios.get(baseUrl+'Comercial/GetObjComercial/'+planta+','+mes+','+periodo, confi_ax);
        if (response.data && response.data.length > 0 ) {
            const obj = response.data;
            
            if(obj.length > 0)
            {
                return obj;
            }else{
                return false
            }
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
export async function GetObjComVendedor(mes,periodo,planta, vendedor)
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
        const response = await axios.get(baseUrl+'Comercial/GetObjComVendedor/'+mes+','+periodo+','+planta+','+vendedor, confi_ax);
        if (response.data && response.data.length > 0 ) {
            const obj = response.data;
            
            if(obj.length > 0)
            {
                return obj;
            }else{
                return false
            }
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
export async function GetObjComVId(id)
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
        const response = await axios.get(baseUrl+'Comercial/GetObjComVId/'+id, confi_ax);
        if (response.data && response.data.length > 0 ) {
            const obj = response.data;
            
            if(obj.length > 0)
            {
                return obj;
            }else{
                return false
            }
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
export async function setMBruto(ejercicio, mes)
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
        const response = await axios.get(baseUrl2+'Administracion/SetMB/'+ejercicio+','+mes, confi_ax);
        var obj = response.data;
        if(obj.length > 0)
        {
            return obj
        }else{
            return false
        }
    } 
    catch(error)
    {
        return false;
    }
}
export async function getCalendario(mes, periodo, tipo)
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
        const response = await axios.get(baseUrl2+'Catalogo/GetCalendario/'+mes+','+periodo+','+tipo, confi_ax);
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
// EXTRAS
export async function setIncidencia(incidencia, tipo) {
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
        const response = await axios.post(baseUrl+'ProCatsa/setIncidencias', incidencia,confi_ax);
        var obj = response.data;
        console.log(obj)
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
export async function getIncidencias(FI, FF) {
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
        // const fcaI = FormatoFca(FI);
        // const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'ProCatsa/GetIncidencias/'+FI+','+FF, confi_ax);
        var obj = response.data;
        console.log(obj)
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
export async function getIncidenciasId(id) {
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
        // const fcaI = FormatoFca(FI);
        // const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'ProCatsa/GetIncidenciaId/'+id, confi_ax);
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
export async function delInci(id) {
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
        // const fcaI = FormatoFca(FI);
        // const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'ProCatsa/DelIncidencia/'+id, confi_ax);
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
export async function getPreCierres(Planta, Periodo, Mes) {
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
        const response = await axios.get(baseUrl2+'Operaciones/GetPreCierreMensual/'+Planta+','+Periodo+','+Mes, confi_ax);
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
export async function setPreCierres(Planta, Periodo, Mes) {
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
        const response = await axios.get(baseUrl+'Operaciones/SetPreCierreMensual/'+planta+','+mes+','+periodo, confi_ax)
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
// ESTRUCTURA DE COSTOS
export async function getECostos(mes,periodo,tipo) {
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
        const response = await axios.get(baseUrl+'Catalogo/GetECostos/'+mes+','+periodo+','+tipo, confi_ax);
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
export async function setRF(data)
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
        const response = await axios.post(baseUrl+'Catalogo/SetREF', data, confi_ax);
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
export async function getRFs(ejercicio) {
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
        const response = await axios.get(baseUrl+'Catalogo/GetREF/'+ejercicio, confi_ax);
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
export async function getRFId(id) {
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
        const response = await axios.get(baseUrl+'Catalogo/GetREFId/'+id, confi_ax);
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
export async function getUVez(){
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
        const response = await axios.get(baseUrl+'Administracion/getBitacoraUpdPro', confi_ax);
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
        // const fcaI = FormatoFca(FI);
        // const fcaF = FormatoFca(FF);
        //------------------------------------------------------------------------------------------------------------------------------------------------------
        const response = await axios.get(baseUrl+'Operaciones/GetInv/'+material+','+planta+','+FI+','+FF+',C', confi_ax);
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
export async function getCotizacionP(FI, FF, planta) {
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
        const response = await axios.get(baseUrl+'Reportes/GetCotPed/'+fcaI+","+fcaF+","+planta, confi_ax);
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
export async function GetObjComGen(mes, periodo)
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
        const response = await axios.get(baseUrl+'Comercial/GetObjComGen/'+mes+','+periodo, confi_ax);
        if (response.data && response.data.length > 0 ) {
            const obj = response.data;
            
            if(obj.length > 0)
            {
                return obj;
            }else{
                return false
            }
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
//UTILITIES
export async function getPlantasList() {
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
        const response = await axios.get(baseUrl+'Administracion/GetPlantas/'+cookies.get('Usuario'), confi_ax);
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
// Función para formatear el número a formato de dinero
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN', // Cambia a la moneda que necesites
  }).format(value);
};
export const downloadCV = (e, dt, nameFile) => {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(dt);
    if (csv == null) return;

    const filename = nameFile+'.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};
export const convertArrayOfObjectsToCSV = (array) => {
    if (!array || !array.length) return null;
    const header = Object.keys(array[0]).join(','); // Extrae las claves como cabeceras
    const rows = array.map(obj => Object.values(obj).join(',')); // Mapea los valores en cada fila
    return [header, ...rows].join('\n'); // Une todo en una cadena CSV
};
export const fNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};
export const opcionesFca = {
    year: 'numeric', // '2-digit' para el año en dos dígitos
    month: '2-digit',   // 'numeric', '2-digit', 'short', 'long', 'narrow'
    day: '2-digit'   // 'numeric', '2-digit'
  };
export const fNumberCad = (number) => {
    return number.toString().padStart(2, '0');
};
export const formatResult = (item) => {
    return (
        <>
        <span style={{ display: 'block', textAlign: 'left', color:'black' }}>{item.name}</span>
        </>
    )
}
