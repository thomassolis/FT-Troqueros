import { Login } from "./components/pages/Login/Login.tsx"
import { Toaster } from "react-hot-toast"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home/Home.tsx";
import { CurrentCustomers } from "./components/pages/Customers/currentCustomers.tsx";
import { AuthProvider } from "./context/auth/authProvider.tsx";
import { Layout } from "./components/layout/Layout.tsx";
import { VehicleParts } from "./components/pages/Vehicles/vehicleParts.tsx";
import { ChasisCreation } from "./components/pages/Vehicles/Chasis/ChasisCreation.tsx";
import { VehicleTypeProvider } from "./context/vehicleType/vehicleType.tsx";

function App() {

  return (
    <AuthProvider>
      <VehicleTypeProvider>
        <BrowserRouter>
          <div> <Toaster position="top-center" reverseOrder={false} /> </div>        
          <Routes>          
            <Route path="/" element={<Login />}/>                
            <Route path="/home" element={<Layout/>}>           
              <Route index element={<Home />}/>                
              <Route path="Customers" element={<CurrentCustomers />}/>                      

              <Route path="Vehicles">
                <Route index element={<VehicleParts />}/>
                <Route path=":selectedOption/create" element={<ChasisCreation />} /> 

                <Route path=":vehicleType/:vehicleID/modify" element={<ChasisCreation />} /> 

                <Route path=":vehicleType/:vehicleID/see" element={<ChasisCreation />} /> 
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>      
      </VehicleTypeProvider>
      
    </AuthProvider>
  )
}

export default App
