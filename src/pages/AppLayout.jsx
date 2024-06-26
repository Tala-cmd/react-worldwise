import Map from "../components/Map"
import styles from './AppLayout.module.css'
import User from "../components/User"
import { CitiesProvider } from "../contexts/CitiesContext"

function AppLayout() {
  return (
    

    
    <div className={styles.app}>
      <Map />
      <User />
    </div>
    

  )
}

export default AppLayout