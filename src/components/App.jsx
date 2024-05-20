import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/FakeAuthContext";
import ProtectedRoute from "../pages/ProtectedRoute";
import AppLayout from "../pages/AppLayout";

import CityList from "./CityList";
import City from "./City";
import Form from "./Form";
import SpinnerFullPage from "./SpinnerFullPage";
import { LocalCitiesProvider } from "../contexts/LocalCitiesContext";
import CountryList from "./CountryList"; 

const Homepage = lazy(()=> import('../pages/Homepage'))
const Product = lazy(()=> import('../pages/Product'))
const Pricing = lazy(()=> import('../pages/Pricing'))
const PageNotFound = lazy(()=> import('../pages/PageNotFound'))
const Login = lazy(()=> import('../pages/Login'))

function App() {
  
  return (
    <AuthProvider>
      <LocalCitiesProvider>
        <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                <Route index element={<Homepage />} />
                <Route path="product" element={<Product />} />
                <Route path="pricing" element={<Pricing />} />
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
      </LocalCitiesProvider>
    </AuthProvider>
  );
}

export default App;
