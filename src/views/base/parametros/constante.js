import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getPlantas } from '../../../../Utilidades/Funciones';

const cookies = new Cookies();
const plantas_ = [];


const PlantasC = () => {
    const [aplantas_, setaplantas_] = useState([]);
    useEffect(()=>{
        if(cookies.get('plantas') != null)
        {
          var obj = cookies.get('plantas');
          obj = obj.data;
          for(var x = 0; x < obj.length; x++)
          {
              plantas_.push({
                  "IdPlanta":obj[x].IdPlanta,
                  "Planta":obj[x].Planta
              });
          }     
        }else{
            getPlantas_();
        }
    });
}

const getPlantas_ = async() =>{
  try{
    const ocList = await getPlantas();
    if(ocList)
    {
      cookies.set('plantas', JSON.stringify(ocList), {path: '/'});
    }
    //=======================================================
  }catch(error){
    console.log(error);
  }
}