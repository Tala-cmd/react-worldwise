import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUlrPosition } from "../hooks/useUrlPosition";

import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import Button from "./Button";

function Map() {
  const { cities, getFlag } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = useUlrPosition();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  
  useEffect(function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]
  );

  useEffect(function(){
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && 
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use yor position'}
        </Button> 
      }
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}>
              <Popup>
                  <span>{getFlag(city.emoji)}</span>
                  <span>{city.cityName}</span>
              </Popup>
            </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  });
}

export default Map;
