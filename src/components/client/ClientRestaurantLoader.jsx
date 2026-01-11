import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRestaurant } from "@/context/RestaurantContext";

export default function ClientRestaurantLoader({ children }) {
  const { restaurantId } = useParams();
  const { setClientRestaurantId } = useRestaurant();

  useEffect(() => {
    if (restaurantId) {
      setClientRestaurantId(restaurantId);
    }
  }, [restaurantId]);

  return children;
}
