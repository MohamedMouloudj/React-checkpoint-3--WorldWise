import styles from "./CityList.module.css";
import Message from "../Message";
import Spinner from "../Spinner";
import CityItem from "./CityItem";
import { useCities } from "../../context/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) {
    return <Spinner />;
  }
  if (!cities?.length) {
    return <Message message=" Add your first city from the map" />;
  }
  return (
    <ul className={styles.cityList}>
      {cities?.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  );
}

export default CityList;
