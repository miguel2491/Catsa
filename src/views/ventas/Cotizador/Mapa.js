import React, {useEffect, useState} from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine';
import Swal from "sweetalert2";
import {
  CRow,
} from '@coreui/react'
import '../../../estilos.css'

const Mapa = ({coords, cordsPlanta, markerPositionO, markerPositionR, onMarkerPositionO, onMarkerPositionR}) => {
    const [markerPosition, setPosition] = useState([{latitud:0,longitud:0}]);
    const [mpPlanta, setMPlanta] = useState([0,0]);
    const [markerCotizacion, setCotizacion] = useState([{latitud:0,longitud:0,tipo:''}]);
    const [markerPC, setMarkerP] = useState([{latitud:0,longitud:0}]);
    const [mapCenter, setMapCenter] = useState([19.023968543290614,-98.2954168461941])
    const [zoom, setZoom] = useState(6);
    const [locMarkerPosition, setLocMarkPos] = useState(markerPositionO)
    const [locMarkerCotizacion, setLocMarkCot] = useState(markerPositionR)
    
    useEffect(() => {
        //handleReset();
        if(cordsPlanta.Lat !== null && cordsPlanta.Lon !== null){
            //console.log('Coords en Step1:', cordsPlanta);
            const ld = parseFloat(cordsPlanta.Lat);
            const lg = parseFloat(cordsPlanta.Lon);
            if(mpPlanta[0] !== 0 && mpPlanta[1] !== 0){
                console.log("Ya contiene Planta")
                handleReset();
                getMpositionActual()
            }
            if (!isNaN(ld) && !isNaN(lg)) {
                setMPlanta([ld, lg]);  // Establece las coordenadas en el estado
                setCotizacion(prevState => [
                    ...prevState,  // Copiar el estado anterior
                    { latitud: ld, longitud: lg, tipo:'Planta' }  // Agregar un nuevo marcador
                ]);
            } else {
                console.error("Coordenadas inválidas:", cordsPlanta.Lat, cordsPlanta.Lon);
            }
            //console.log("SMAPA:",markerCotizacion)
        }
    },[cordsPlanta]);
    useEffect(() => {
        //console.log('Centro de planta actualizado:', mpPlanta, mapCenter);
        if(mpPlanta[0] !==  0 && mapCenter[0] !== 0){
            const distancia = calcularDistanciaLeaflet(mpPlanta[0], mpPlanta[1],mapCenter[0], mapCenter[1]);
            const distanciaKm = distancia/1000;
            //console.log(distanciaKm)
            if(distanciaKm > 30){
                Swal.fire("Advertencia", "Supera los 30Km, revisa los costos extras que se puedan aplicar", "warning")
            }
        }
    }, [mpPlanta]);
    useEffect(() => {
        getMpositionActual()
    }, []);
    //==============================================================
    const getMpositionActual = () =>{
        if (!navigator.geolocation) {
            Swal.fire("Error", "Tu navegador no soporta Geolocalización", "error")
            return
        }
        // Obtenemos la posición actual
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;
            const tipo = "Ubicacion"
            setMapCenter([latitud, longitud])
            setCotizacion(prevState => [
                ...prevState,  // Copiar el estado anterior
                { latitud: latitud, longitud: longitud, tipo:tipo }  // Agregar un nuevo marcador
            ]);
            //setCotizacion([{latitud, longitud,tipo}])
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
    }
    //==============================================================
    //--   AGREGAR MARCADOR CON LA LOCALIZACION               ------
    //==============================================================
    const handleDragEnd = (e) =>{
        const { lat, lng } = e.target.getLatLng();  // Obtener la nueva latitud y longitud
        setCotizacion(prevState => [
            { latitud: lat, longitud: lng, tipo:'Ubicación' }  // Actualizar el estado con el nuevo marcador
        ]);

        setLocMarkCot([{latitud:lat, longitud:lng}]);
        onMarkerPositionR([{latitud:lat, longitud:lng}])
    }
    const handleReset = () => {
        setCotizacion([{ latitud: 0, longitud: 0 }]); // Resetear a los valores iniciales
    };
    //==========================================================================
    const calcularDistanciaLeaflet = (lat1, lon1, lat2, lon2) => {
        const punto1 = L.latLng(lat1, lon1);
        const punto2 = L.latLng(lat2, lon2);
        return punto1.distanceTo(punto2); // Devuelve la distancia en metros
    };
    //==========================================================================
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
                center={mpPlanta} // Usamos el centro actualizado
                radius={30000} // Radio de 1000 metros (ajustar según lo necesites)
                color="blue"   // Color del borde
                fillColor="blue" // Color de relleno
                fillOpacity={0.1} // Opacidad del relleno
            />
            {markerCotizacion.map((point, index) => (
                <Marker key={index} position={[point.latitud, point.longitud]} draggable={true} eventHandlers={{dragend:handleDragEnd,}}>
                    <Popup>
                        <b>{point.tipo}</b><br />
                        Latitud: {point.latitud}<br />
                        Longitud: {point.longitud}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>        
    )
  };
  export default Mapa;