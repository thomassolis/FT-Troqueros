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
import { DynamicRequestsProvider } from "./context/Requests/DynamicRequestsOptions.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute/protectedRoute.tsx";

function App() {

  return (
    <AuthProvider>
      <VehicleTypeProvider>
        <SearchValueProvider>
          <DynamicRequestsProvider>          
            <BrowserRouter>
              <div> <Toaster position="top-center" reverseOrder={false} /> </div>        
              <Routes>          
                <Route path="/" element={<Login />}/>   

                {/* <ProtectedRoute> */}

                <Route element={<ProtectedRoute/>}>
                  <Route path="/home" element={<Layout/>}>           
                    <Route index element={<Home />}/>              

                    <Route path="completeRequestHistory" >
                      <Route index element={<Home />}/>
                    </Route>  

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

                    <Route path="Request/create" >
                      <Route index element={<DriversCreation />}/>                    
                    </Route> 

                    <Route path='Request/edit' >
                      <Route path=":requestID" element={<DriversCreation />}/>                    
                    </Route> 


                  </Route>
                </Route>                                 

                {/* </ProtectedRoute>   */}

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter> 
          </DynamicRequestsProvider>     
        </SearchValueProvider>
      </VehicleTypeProvider>
      
    </AuthProvider>
  )
}

export default App
