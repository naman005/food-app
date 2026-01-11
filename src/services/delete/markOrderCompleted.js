import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const markOrderCompleted = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  await deleteDoc(orderRef);
};
