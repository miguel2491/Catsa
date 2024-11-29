
import axios from 'axios'
import {FormatoFca, Fnum} from './Tools'
import { format } from 'date-fns';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
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
