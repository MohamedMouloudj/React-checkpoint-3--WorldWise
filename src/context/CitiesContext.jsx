import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      try {
        const abortController = new AbortController();
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities`, {
          signal: abortController.signal,
        });
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
        return () => {
          abortController.abort();
        };
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (id === currentCity.id) return;
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      alert("There was an error creating the city. Please try again.");
      dispatch({ type: "rejected", payload: error.message });
    }
  }
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      alert("There was an error deleting the city. Please try again.");
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
};

export { useCities, CitiesProvider };
