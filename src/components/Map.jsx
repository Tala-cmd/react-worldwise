import { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent, useMapEvents } from 'react-leaflet';

import styles from './Map.module.css'
import { useCities } from '../contexts/CitiesContext';


function Map() {
  const { cities, getFlag } = useCities();

  const [mapPosition, setMapPosition] = useState([40, 0]);

  const [searchParams] = useSearchParams();
  const mapLat = searchParams.get('lat');
  const mapLng = searchParams.get('lng');

  useEffect(function(){
    if(mapLat && mapLng) setMapPosition([mapLat, mapLng])
  
  }, [mapLat, mapLng])

  return (
    <div className={styles.mapContainer}>
      <MapContainer 
        className={styles.map} 
        center={mapPosition} 
        zoom={6} 
        scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />

  {cities.map((city)=>
    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
      <Popup>
        <span>{getFlag(city.emoji)}</span>
        <span>{city.cityName}</span>
      </Popup>
    </Marker>
    )
  }

  <ChangeCenter position={mapPosition} />
  <DetectClick />

  </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }){
  const map = useMap();
  map.setView(position)
  return null
}

function DetectClick(){
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}

export default Map