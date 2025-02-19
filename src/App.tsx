import { Login } from "./components/pages/Login/Login.tsx"
import { Toaster } from "react-hot-toast"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home/Home.tsx";
import { AuthProvider } from "./context/auth/authProvider.tsx";
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div> <Toaster position="top-center" reverseOrder={false} /> </div>        
        <Routes>
          
          <Route path="/" element={<Login/>}> </Route>

          <Route>
            <Route path="/home" element={<Home />} /> </Route>      
        </Routes>
      </BrowserRouter>      
    </AuthProvider>
  )
}

export default App
