import React, {useEffect, useState} from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine';
import {
  CRow,
} from '@coreui/react'
import '../../../estilos.css'

const Mapa = ({coords, markerPositionO, markerPositionR, onMarkerPositionO, onMarkerPositionR}) => {
    const [markerPosition, setPosition] = useState([{latitud:0,longitud:0}]);
    const [markerCotizacion, setCotizacion] = useState([{latitud:0,longitud:0}]);
    const [markerPC, setMarkerP] = useState([{latitud:0,longitud:0}]);
    const [mapCenter, setMapCenter] = useState([19.023968543290614,-98.2954168461941])
    const [zoom, setZoom] = useState(14);
    const [locMarkerPosition, setLocMarkPos] = useState(markerPositionO)
    const [locMarkerCotizacion, setLocMarkCot] = useState(markerPositionR)
    
      useEffect(() => {
        if (!navigator.geolocation) {
            Swal.fire("Error", "Tu navegador no soporta Geolocalización", "error")
            return
        }
        // Obtenemos la posición actual
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;
            setMapCenter([latitud, longitud])
            // setPosition(prevState =>[
            //     ...prevState,
            //     {latitud, longitud}
            // ])
            // setCotizacion(prevState=>[
            //     ...prevState,
            //     {latitud, longitud}
            // ])
            // setMarkerP(prevState=>[
            //     ...prevState,
            //     {latitud, longitud}
            // ])
            setCotizacion([{latitud, longitud}])
            setPosition([{latitud, longitud}])
            setMarkerP([{latitud, longitud}])
            setLocMarkPos([{latitud, longitud}])
            setLocMarkCot([{latitud, longitud}])
            onMarkerPositionO([{latitud, longitud}])
            onMarkerPositionR([{latitud, longitud}])
        },
        (error) => {
            Swal.fire("Error al obtener ubicación", error.message, "error")
        }
        )
    }, []);
    //==============================================================
    //--   AGREGAR MARCADOR CON LA LOCALIZACION               ------
    //==============================================================
    const handleDragEnd = (e) =>{
        const { lat, lng } = e.target.getLatLng();  // Obtener la nueva latitud y longitud
        setCotizacion([{latitud:lat, longitud:lng}]);  // Actualizar el estado de cotización 
        setLocMarkCot([{latitud:lat, longitud:lng}]);
        onMarkerPositionR([{latitud:lat, longitud:lng}])
    }
    //==============================================================
    return (
        <MapContainer
            center={mapCenter} // Centro de México como ejemplo
            zoom={zoom}
            style={{ height: '400px', width: '100%' }}
            id="map"
            whenCreated={(map) =>{
                map.on('moveend', () =>{
                setMapCenter(map.getCenter());
                });
            }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
                center={mapCenter} // Usamos el centro actualizado
                radius={30000} // Radio de 1000 metros (ajustar según lo necesites)
                color="blue"   // Color del borde
                fillColor="blue" // Color de relleno
                fillOpacity={0.1} // Opacidad del relleno
            />
            {markerCotizacion.map((point, index) => (
                <Marker key={index} position={[point.latitud, point.longitud]} draggable={true} eventHandlers={{dragend:handleDragEnd,}}>
                    <Popup>
                        <b>Visita {index + 1}</b><br />
                        Latitud: {point.latitud}<br />
                        Longitud: {point.longitud}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>        
    )
  };
  export default Mapa;