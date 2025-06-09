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
import { SeeChasis } from "./components/pages/Vehicles/SeeInformation/SeeChasisInfo.tsx";
import { SearchValueProvider } from "./context/searchValueForFilter/searchValue.tsx";
import { NotFoundPage } from "./components/pages/NotFound/NotFoundPage.tsx";
import { DriversCreation } from "./components/pages/Drivers/DriversCreation.tsx";


function App() {

  return (
    <AuthProvider>
      <VehicleTypeProvider>
        <SearchValueProvider>
          <BrowserRouter>
            <div> <Toaster position="top-center" reverseOrder={false} /> </div>        
            <Routes>          
              <Route path="/" element={<Login />}/>                
              <Route path="/home" element={<Layout/>}>           
                <Route index element={<Home />}/>                

                <Route path="Customers" >
                  <Route index element={<CurrentCustomers />}/>
                  <Route path="create" element={<ChasisCreation />} /> 
                  <Route path=":clienteID/see" element={<SeeChasis />} /> 
                  <Route path=":clienteID/modify" element={<ChasisCreation />} /> 
                </Route>

                <Route path="Drivers" >
                  <Route index element={<CurrentCustomers />}/>
                  <Route path="create" element={<DriversCreation />} />
                  <Route path=":driverID/see" element={<SeeChasis />} />
                  <Route path=":driverID/modify" element={<DriversCreation />} />  
                </Route> 

                <Route path="Vehicles">
                  <Route index element={<VehicleParts />}/>
                  <Route path=":selectedOption/create" element={<ChasisCreation />} /> 

                  <Route path=":vehicleType/:vehicleID/modify" element={<ChasisCreation />} /> 

                  <Route path=":vehicleType/:vehicleID/see" element={<SeeChasis />} /> 
                </Route>

                <Route path="Services" >
                  <Route index element={<CurrentCustomers />}/>
                  <Route path="create" element={<DriversCreation />} />
                </Route> 

                <Route path="Providers" >
                  <Route index element={<CurrentCustomers />}/>
                  <Route path="create" element={<DriversCreation />} />
                  <Route path=":providerID/see" element={<SeeChasis />} />
                  <Route path=":providerID/modify" element={<DriversCreation />} />  
                </Route> 


              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>      
        </SearchValueProvider>
      </VehicleTypeProvider>
      
    </AuthProvider>
  )
}

export default App
