import { createContext, useContext, useState, useEffect } from "react";
import { getRestaurantId } from "@/utils/getRestaurantId";
import { getMenu } from "@/services/read/getMenu";
import { getRestaurantConfig } from "@/utils/getRestaurantConfig";

const RestaurantContext = createContext();

export const useRestaurant = () => useContext(RestaurantContext);

export const RestaurantProvider = ({ user, isLoggedIn, children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [clientRestaurantId, setClientRestaurantId] = useState(null);
  const [restaurantConfig, setRestaurantConfig] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    const cachedRestaurantId = localStorage.getItem("restaurantId");
    const cachedClientRestaurantId = localStorage.getItem("clientRestaurantId");
    const cachedConfig = localStorage.getItem("restaurantConfig");
    const cachedMenu = localStorage.getItem("menu");

    if (cachedRestaurantId) setRestaurantId(cachedRestaurantId);
    if (cachedClientRestaurantId) setClientRestaurantId(cachedClientRestaurantId);
    if (cachedConfig) setRestaurantConfig(JSON.parse(cachedConfig));
    if (cachedMenu) setMenu(JSON.parse(cachedMenu));
  }, []);


  useEffect(() => {
    const fetchRestaurantAdmin = async () => {
      if (!isLoggedIn || !user) {
        setLoadingRestaurant(false);
        setLoadingMenu(false);
        return;
      }

      if (restaurantId && menu && restaurantConfig) {
        setLoadingRestaurant(false);
        setLoadingMenu(false);
        return;
      }

      const restId = await getRestaurantId(user);
      setRestaurantId(restId);
      localStorage.setItem("restaurantId", restId);

      const restConfig = await getRestaurantConfig(restId);
      setRestaurantConfig(restConfig);
      localStorage.setItem("restaurantConfig", JSON.stringify(restConfig));

      const fetchedMenu = await getMenu(restId); 
      setMenu(fetchedMenu);
      localStorage.setItem("menu", JSON.stringify(fetchedMenu));
      
      setLoadingRestaurant(false);
      setLoadingMenu(false);
    };

    fetchRestaurantAdmin();
  }, [user, isLoggedIn]);

  useEffect(() => {
    const fetchRestaurantClient = async () => {
      if (isLoggedIn || user) {
        setLoadingRestaurant(false);
        setLoadingMenu(false);
        return;
      }

      if (!clientRestaurantId) {
        setLoadingRestaurant(false);
        setLoadingMenu(false);
        return;
      } 

      localStorage.setItem("clientRestaurantId", clientRestaurantId);

      if (menu && restaurantConfig) {
        setLoadingRestaurant(false);
        setLoadingMenu(false);
        return;
      }

      const restConfig = await getRestaurantConfig(clientRestaurantId);
      setRestaurantConfig(restConfig);
      localStorage.setItem("restaurantConfig", JSON.stringify(restConfig));

      const fetchedMenu = await getMenu(clientRestaurantId); 
      setMenu(fetchedMenu);
      localStorage.setItem("menu", JSON.stringify(fetchedMenu));

      setLoadingMenu(false);
    }
    fetchRestaurantClient();
  }, [clientRestaurantId]);

  return (
    <RestaurantContext.Provider
      value={{ restaurantId, restaurantConfig, menu, setClientRestaurantId, loadingRestaurant, loadingMenu }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
