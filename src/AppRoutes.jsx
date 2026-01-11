import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Home from "./pages/admin/Home";
import KitchenOrdersScreen from "./pages/admin/KitchenOrdersScreen";
import MenuSetupPage from "./pages/admin/MenuSetupPage";
import RestaurantMenu from "./pages/admin/RestaurantMenu";
import TokenQueue from "./pages/admin/TokenQueue";
import ProtectedRoute from "./ProtectedRoute";
import ClientHomePage from "./pages/client/ClientHomePage";
import { useRestaurant } from "./context/RestaurantContext";
import ClientRestaurantLoader from "./components/client/ClientRestaurantLoader";

const AppRoutes = () => {
  const restaurant = useRestaurant();

  if (!restaurant) return null; 

  const { restaurantId } = restaurant;
  
  return (
    <ReactRouterRoutes>
      {/* Auth Routes */}
      <Route path="/r/signup" element={<SignUp />} />
      <Route path="/r/signin" element={<SignIn />} />
      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
      <Route path="/r/onboard" element={<MenuSetupPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/r/menu" element={<RestaurantMenu restaurantId ={restaurantId} />} />
      <Route path="/r/kitchen" element={<KitchenOrdersScreen restaurantId={restaurantId} />} />
      <Route path="/r/token" element={<TokenQueue restaurantId={restaurantId} />} />
      </Route>
      {/* Client Routes */}
      <Route path="/c/:restaurantId" element={<ClientRestaurantLoader><ClientHomePage /></ClientRestaurantLoader>} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  );
};

export default AppRoutes;
