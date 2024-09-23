import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";
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
                    
                console.log(plantas_);
            }else{
                getPlantas();
            }
            
            function getPlantas()
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
                          //=======================================================
                          axios.get(baseUrl2+'Administracion/GetPlantas/'+cookies.get('Usuario'),confi_ax)
                          .then(response=>{
                            cookies.set('plantas', JSON.stringify(response), {path: '/'});
                            return response.data;
                          }).then(response=>{
                            console.log("=>");
                          })
                          .catch(err=>{
                            if (err.response) {
                              // El servidor respondió con un código de estado fuera del rango de 2xx
                              console.error('Error de Respuesta:', err.response.data);
                              //setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
                            } else if (err.request) {
                              // La solicitud fue realizada pero no se recibió respuesta
                              //setError('Error: No se recibió respuesta del servidor.');
                            } else {
                              // Algo sucedió al configurar la solicitud
                              console.error('Error:', err.message);
                              //setError(`Error: ${err.message}`);
                            }
                          })
                          //=======================================================
                      }catch(error){
                        console.log(error);
                      }
            }
    });
}
