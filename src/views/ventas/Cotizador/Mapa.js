import React, {useEffect, useState, useRef} from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import {
  CRow,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCheck, cilX, cilSearch, cilTrash, cilPlus } from '@coreui/icons'
import { Rol } from '../../../Utilidades/Roles'
import '../../../estilos.css'

const Mapa = ({coords}) => {
    const [map, setMap] = useState(null);
    const [locationO, setLocationO] = useState({
      latitude: null,
      longitude: null,
      error: null
    });
    const [location, setLocation] = useState({
      latitude: null,
      longitude: null,
      error: null
    });
    const [markerPosition, setMarkerPosition] = useState({
      lat: null,
      lng: null,
    });
    const [aDatos, setSave] = useState({
      cliente:null,
      obra:null,
      coords:null
    });
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            //const [lat, lon] = coords.split(",");
            console.log(coords)
            if(coords.length > 5){
              const [lat, lon] = coords.split(",");
              setLocation({
                latitude: parseFloat(lat),//lat,
                longitude: parseFloat(lon),//lon
                error: null
              });
            }
            else if(coords.length > 0 && coords.length < 5)
            {
              const [lat, lon] = coords.split(",");
              console.log(lat)
              if(lat != "0"){
                setLocation({
                  latitude: 19.033171714176245,//lat,
                  longitude: -98.30718927809613,//lon
                  error: null
                });
              }else{
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  error: null
                });  
              }
            }else{
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null
              });
              console.log(location)
            }
            console.log(location)
          },
          (error) => {
            setLocation({
              latitude: null,
              longitude: null,
              error: error.message
            });
          }
        );
      } else {
        setLocation({
          latitude: null,
          longitude: null,
          error: "Geolocation is not supported by this browser."
        });
      }
    }, []);
  
    if (location.error) {
      return <p>Error: {location.error}</p>;
    }
    const onMarkerDragEnd = (e) => {
      // Actualizar las coordenadas del marcador cuando se haya dejado de arrastrar
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      setLocation({
        latitude: lat,
        longitude: lng,
        error: null
      });
      console.log("Nuevo marcador en:", lat, lng);
      //console.log(locationO);
    };
    //AIzaSyCmR8S151uu3BTA7Mgtpl6-TBA3_U8HjGQ
    if (location.latitude && location.longitude) {
      return (
        // <LoadScript googleMapsApiKey="AIzaSyCxaRbEHBInFto-cnzDgPzqZuaVmllksOE">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={{ lat: location.latitude, lng: location.longitude }}
            zoom={14}
          >
            <Marker 
              position={{ lat: location.latitude, lng: location.longitude }} 
              draggable={true}  // Hacer que el marcador sea arrastrable
              onDragEnd={onMarkerDragEnd} />
          </GoogleMap>
        // </LoadScript>
      );
    }
    return <p>Loading...</p>;
  };
  export default Mapa;