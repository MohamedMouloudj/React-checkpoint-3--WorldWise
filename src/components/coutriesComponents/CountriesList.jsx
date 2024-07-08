import styles from "./CountriesList.module.css";
import Message from "../Message";
import Spinner from "../Spinner";
import CountryItem from "./CountryItem";
import { useCities } from "../../context/CitiesContext";

function CountriesList() {
  const { cities, isLoading } = useCities();
  if (isLoading) {
    return <Spinner />;
  }
  if (!cities?.length) {
    return <Message message=" Add your first city from the map" />;
  }

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((e) => e.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries?.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountriesList;
