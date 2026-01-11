import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const getKitchenOrders = (restaurantId, callback, setLoading) => {
  if (!restaurantId) return;

  const q = query(
    collection(db, "orders"),
    where("restaurantId", "==", restaurantId),
    where("status", "in", ["PLACED", "READY"]),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(orders);
    setLoading(false);
  });

  return unsubscribe;
};
