import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, ZoomControl} from "react-leaflet";
import { useLocalCities } from "../contexts/LocalCitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import Button from "./Button";
import Sidebar from "./Sidebar";
import Flag from "./Flag";

function Map() {
  const { cities } = useLocalCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = useUrlPosition();
  const {
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  useEffect(function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]
  );

  useEffect(function(){
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])

  return (
    <>
    <Sidebar 
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen} 
    />

    <div className={styles.mapContainer}>
      <Button type='position' onClick={getPosition}>
        Use yor position
      </Button> 
      
      <MapContainer
        className={styles.map}
        center={[mapLat, mapLng]}
        zoom={10}
        zoomControl={false}
        scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        <ZoomControl position="topright" />
        {cities.map((city) => (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}>
              <Popup>
                  <span style={{ maxHeight: "2.8rem", height: "2.8rem" }}>
                    <Flag countryCode={city.countryCode} />
                  </span>
                  <span>{city.cityName}</span>
              </Popup>
            </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
        <ToggleSideBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
      </MapContainer>
    </div>
    </>
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

function ToggleSideBar({ setIsSidebarOpen }) {
  const handleClick = () => setIsSidebarOpen(true);

  useMapEvents({
    click: handleClick,
  });

  return null;
}

export default Map;
