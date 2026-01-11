import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const getReadyOrders = (restaurantId, callback) => {
  if (!restaurantId) return;

  const q = query(
    collection(db, "orders"),
    where("restaurantId", "==", restaurantId),
    where("status", "==", "READY"),
    orderBy("token", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(orders);
  });

  return unsubscribe;
};
