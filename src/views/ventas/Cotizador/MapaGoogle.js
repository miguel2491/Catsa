import React, {useEffect, useState} from 'react'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-time-picker/assets/index.css';
import {
  CRow,
} from '@coreui/react'
import '../../../estilos.css'

const Mapa = ({coords}) => {
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
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation({
                latitude: parseFloat(lat),//lat,
                longitude: parseFloat(lon),//lon
                error: null
              });
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
    
    useEffect(() => {
      if (coords && coords.length > 5) {
        const [lat, lon] = coords.split(',');
        setLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          error: null,
        });
      }
    },[coords]);

    useEffect(() =>{
      if (window.google && window.google.maps) {
        setIsScriptLoaded(true);  // La API ya está cargada
      }else{
        const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCxaRbEHBInFto-cnzDgPzqZuaVmllksOE&libraries=places`;
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
      }
    }, [])

    const onMarkerDragEnd = (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      //setMarkerPosition({ lat, lng });
      setLocation({
        latitude: lat,
        longitude: lng,
        error: null
      });
      console.log("Nuevo marcador en:", lat, lng);
      //console.log(locationO);
    };
    
    if (location.error) {
      return <p>Error: {location.error}</p>;
    }
    //AIzaSyCmR8S151uu3BTA7Mgtpl6-TBA3_U8HjGQ
    if(!location.latitude || !location.longitude){
      return <p>cargando...</p>;
    }

    return isScriptLoaded ? (
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
        ):(
          <LoadScript googleMapsApiKey="AIzaSyCxaRbEHBInFto-cnzDgPzqZuaVmllksOE" onLoad={() => setIsScriptLoaded(true)}>
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
          </LoadScript>
      );
  };
  export default Mapa;