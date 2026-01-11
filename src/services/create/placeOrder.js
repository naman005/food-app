import { db } from "@/firebase/firebaseUtils";
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore"

export const placeOrder = async (restaurantId, cart, orderType, tableNo, totalAmount, setToken) => {
  if (cart.length === 0) return;

  const restaurantRef = doc(db, "restaurants", restaurantId);

  await updateDoc(restaurantRef, {
    token: increment(1),
  });

  const snap = await getDoc(restaurantRef);
  const tokenNo = snap.data().token;

  await addDoc(collection(db, "orders"), {
    restaurantId,
    token: tokenNo,
    items: cart,
    totalAmount,
    status: "PLACED",
    paymentStatus: "PENDING",
    orderType,
    tableNo: tableNo || 0,
    createdAt: serverTimestamp(),
  });

  setToken(tokenNo);
};