import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./Form.module.css";
import Flag from "./Flag";
import { useLocalCities } from "../contexts/LocalCitiesContext";


const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client?'
function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, getCity, currentCity } = useLocalCities();
  
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [searchParams] = useSearchParams();
  
  const id = searchParams.get("id");

  

  function resetForm() {
    setCityName("");
    setCountry("");
    setCountryCode("");
    setDate(new Date());
    setNotes("");
  }

  useEffect(function(){

    if(!lat && !lng) return;
    
    async function fetchCityData(){
      try{
        setIsLoadingGeocoding(true);
        setGeocodingError('')
        const res = await fetch(`${BASE_URL}latitude=${lat}&longitude=${lng}`); // HERE
        const data = await res.json();

        if(!data.countryCode){
          throw new Error("That doesn't seem to be a city. Click somewhere else😊")
        }

        setCityName(data.city || data.locality || '')
        setCountry(data.countryName || '')
        setCountryCode(data.countryCode || "");

      } catch (err){
        setGeocodingError(err.message)
      } finally{
        setIsLoadingGeocoding(false)
      }
    }
    fetchCityData();
  },[lat, lng])

  useEffect(
    function () {
      if (!id) return;

      getCity(id);

      const { cityName, country, countryCode, date, notes } = currentCity;
      setCityName(cityName);
      setCountry(country);
      setCountryCode(countryCode);
      setDate(new Date(date));
      setNotes(notes);
    },
    [id, getCity, currentCity]
  );

  async function handleSubmit(e){
    e.preventDefault()
    
    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      countryCode,
      date,
      notes,
      position: {lat, lng}
    }

    await createCity(newCity)
    
    resetForm();
    navigate("/app/cities");
  }

  if(!lat && !lng) return <Message message='Start by clicking somewhere on the map!' />
  if(isLoadingGeocoding) return <Spinner />
  if(geocodingError) return <Message message={geocodingError} />

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="cityName">City name</label>
          <input
              id="cityName"
              onChange={(e) => setCityName(e.target.value)}
              value={cityName}
          />
          <span className={styles.flag}><Flag countryCode={countryCode} /></span>
        </div>

        <div className={styles.row}>
          <label htmlFor="date">When did you go to {cityName} / {country}?</label>
          <DatePicker 
            id='date'
            onChange={(date) => setDate(date)} 
            selected={date} 
            dateFormat="dd/MM/yyyy"/>
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes about your trip to {cityName}</label>
          <textarea
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
              maxLength="200"
          />
        </div>

        <div className={styles.buttons}>
          <Button type="primary">Add</Button>
          <BackButton />
        </div>
    </form>
  );
}

export default Form;
