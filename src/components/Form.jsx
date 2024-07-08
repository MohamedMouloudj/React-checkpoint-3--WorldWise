// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";

const getYear = (date) => date.getFullYear();
const range = (start, end, step) =>
  Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const getMonth = (date) => date.getMonth();

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const years = range(1990, getYear(new Date()) + 1, 1);

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  cityName: "",
  country: "",
  date: new Date(),
  notes: "",
  emoji: "",
  geoError: "",
  isLoadingGeocode: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "cityName":
      return { ...state, cityName: action.payload };
    case "country":
      return { ...state, country: action.payload };
    case "date":
      return { ...state, date: action.payload };
    case "notes":
      return { ...state, notes: action.payload };
    case "emoji":
      return { ...state, emoji: convertToEmoji(action.payload) };
    case "geoError":
      return { ...state, geoError: action.payload };
    case "isLoadingGeocode":
      return { ...state, isLoadingGeocode: action.payload };
    default:
      return state;
  }
};

function Form() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const [
    { cityName, country, date, notes, emoji, geoError, isLoadingGeocode },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!lat || !lng) return;
    async function fetchCity() {
      try {
        dispatch({ type: "isLoadingGeocode", payload: true });
        dispatch({ type: "geoError", payload: "" });
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();

        if (!data.countryCode) {
          throw new Error("Appearently, this is not a city '-'");
        }

        dispatch({
          type: "cityName",
          payload: data.city || data.locality || "",
        });
        dispatch({ type: "country", payload: data.countryName || "" });
        dispatch({ type: "emoji", payload: data.countryCode });
      } catch (error) {
        dispatch({ type: "geoError", payload: error.message });
      } finally {
        dispatch({ type: "isLoadingGeocode", payload: false });
      }
    }
    fetchCity();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat: Number(lat), lng: Number(lng) },
    };
    await createCity(newCity);
    navigate("/app");
  }

  if (isLoadingGeocode) {
    return <Spinner />;
  }

  if (!lat || !lng) {
    console.log("No lat or lng");
    return <Message message="Start by selecting a position on the map" />;
  }

  if (geoError) {
    return <Message message={geoError} />;
  }

  return (
    <form
      className={`${styles.form} ${isLoading && styles.loading}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "cityName", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          renderCustomHeader={({ changeYear, changeMonth, date }) => (
            <div
              style={{
                margin: 5,
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
          isClearable
          selected={date}
          onChange={(date) => dispatch({ type: "date", payload: date })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Click to select a date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          rows={3}
          id="notes"
          onChange={(e) => dispatch({ type: "notes", payload: e.target.value })}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
