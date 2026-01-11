import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const toggleIsAvailable = async (itemId, toggle) => {
  const itemRef = doc(db, "items", itemId);

  await updateDoc(itemRef, {
    isAvailable: !toggle,
  });
};
