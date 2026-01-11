import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseUtils";

export const getRestaurantConfig = async (restaurantId) => {
  if (!restaurantId) return;

  const docRef = doc(db, "restaurants", restaurantId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;

  const data = snap.data();

  if (!data.config) return;

  return data.config;
};
