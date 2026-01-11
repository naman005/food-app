import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const markPaymentDone = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    paymentStatus: "PAID",
  });
};
