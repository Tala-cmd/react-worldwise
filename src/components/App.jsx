import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Product from "../pages/Product";
import Homepage from "../pages/Homepage";
import Pricing from "../pages/Pricing";
import PageNotFound from "../pages/PageNotFound";
import AppLayout from "../pages/AppLayout";
import Login from "../pages/Login";
import CityList from "./CityList";
import CountryList from "./CountryList";
import City from "./City";
import Form from "./Form";
import { CitiesProvider } from "../contexts/CitiesContext";
import { AuthProvider } from "../contexts/FakeAuthContext";

//const BASE_URL = "http://localhost:8000";

function App() {
  
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="product" element={<Product />} />
              <Route path="login" element={<Login />} />

              <Route path="app" element={<AppLayout />}>
                  <Route index element={<Navigate to="cities" replace/>} />
                  <Route path="cities" element={<CityList />} />
                  <Route path='cities/:id' element={<City />} />
                  <Route path="countries" element={<CountryList />} />
                  <Route path="form" element={<Form />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
