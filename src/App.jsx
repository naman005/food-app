import { BrowserRouter, useParams } from "react-router-dom"
import { RestaurantProvider } from "@/context/RestaurantContext";
import { useAuth } from "./context/AuthContext";
import AppRoutes from "./AppRoutes"
import { Toaster } from "sonner";

function App() {
  const { user, isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
    <RestaurantProvider user={user} isLoggedIn={isLoggedIn}>
      <Toaster />
      <AppRoutes />
    </RestaurantProvider>
    </BrowserRouter>
  )
}

export default App
