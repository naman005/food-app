import {
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseUtils";

export async function updateItemPrices({
  itemId,
  basePrice,
  options,
}) {
  if (!itemId) throw new Error("itemId required");

  const batch = writeBatch(db);

  const itemRef = doc(db, "items", itemId);
  batch.update(itemRef, {
    basePrice: Number(basePrice || 0),
  });

  options.forEach((opt) => {
    if (!opt.id) return;

    const optionRef = doc(db, "options", opt.id);
    batch.update(optionRef, {
      price: Number(opt.price || 0),
    });
  });

  await batch.commit();
}
