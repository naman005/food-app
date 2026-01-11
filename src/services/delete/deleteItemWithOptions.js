import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseUtils";

export async function deleteItemWithOptions(itemId) {
  if (!itemId) throw new Error("itemId is required");

  const batch = writeBatch(db);

  const itemRef = doc(db, "items", itemId);
  batch.delete(itemRef);

  const q = query(
    collection(db, "options"),
    where("itemId", "==", itemId)
  );

  const snap = await getDocs(q);

  snap.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
}
