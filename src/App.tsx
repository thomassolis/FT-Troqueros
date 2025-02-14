import { Login } from "./components/pages/Login/Login.tsx"
import { Toaster } from "react-hot-toast"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home/Home.tsx";
import { CurrentCustomers } from "./components/pages/Customers/currentCustomers.tsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <div> <Toaster position="top-center" reverseOrder={false} /> </div>        
        <Routes>
          
          <Route path="/" element={<Login/>}> </Route>
          
          <Route path="/Troqueros/home" element={<Home />} />      

          <Route path="/Troqueros/Customers" element={<CurrentCustomers />} />  
        </Routes>
    </BrowserRouter>      
    </>
  )
}

export default App
