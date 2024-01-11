import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CitiesProvider } from "../contexts/CitiesContext";
import { AuthProvider } from "../contexts/FakeAuthContext";
import ProtectedRoute from "../pages/ProtectedRoute";

import CityList from "./CityList";
import CountryList from "./CountryList"; 
import City from "./City";
import Form from "./Form";
import SpinnerFullPage from "./SpinnerFullPage";

// import Product from "../pages/Product";
// import Homepage from "../pages/Homepage";
// import Pricing from "../pages/Pricing";
// import PageNotFound from "../pages/PageNotFound";
// import AppLayout from "../pages/AppLayout";
// import Login from "../pages/Login";


const Homepage = lazy(()=> import('../pages/Homepage'))
const Product = lazy(()=> import('../pages/Product'))
const Pricing = lazy(()=> import('../pages/Pricing'))
const Login = lazy(()=> import('../pages/Login'))
const AppLayout = lazy(()=> import('../pages/AppLayout'))
const PageNotFound = lazy(()=> import('../pages/PageNotFound'))

// Before using bundle 
// dist/assets/index-DpLTSLv6.css   47.50 kB │ gzip:  11.51 kB
// dist/assets/index-aG-R6P7X.js   533.31 kB │ gzip: 150.74 kB

//const BASE_URL = "http://localhost:8000";

function App() {
  
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                <Route index element={<Homepage />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="product" element={<Product />} />
                <Route path="login" element={<Login />} />

                <Route path="app" element={<ProtectedRoute> <AppLayout /> </ProtectedRoute>}>
                    <Route index element={<Navigate to="cities" replace/>} />
                    <Route path="cities" element={<CityList />} />
                    <Route path='cities/:id' element={<City />} />
                    <Route path="countries" element={<CountryList />} />
                    <Route path="form" element={<Form />} />
                </Route>

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
