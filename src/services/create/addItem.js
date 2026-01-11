import { db } from "@/firebase/firebaseUtils";
import {
  collection,
  doc,
  writeBatch,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export async function addItem({
  restaurantId,
  categoryId,
  name,
  foodType,
  basePrice,
  imageFile,
  options = [],
}) {
  if (!restaurantId) throw new Error("restaurantId required");
  if (!categoryId) throw new Error("categoryId required");
  if (!name) throw new Error("Item name required");
  if (!imageFile) throw new Error(`Item image URL required for ${name}`);

  const imageUrl = await uploadToCloudinary(imageFile);

  if (!imageUrl) throw new Error("Image upload failed");

  const itemRef = doc(collection(db, "items"));

  const batch = writeBatch(db);

  batch.set(itemRef, {
    restaurantId,
    categoryId,
    name,
    foodType,
    basePrice: Number(basePrice),
    imageUrl,
    isAvailable: true,
  });

  options.forEach((opt) => {
    if (!opt.name) return;

    const optionRef = doc(collection(db, "options"));

    batch.set(optionRef, {
      restaurantId,
      itemId: itemRef.id,
      name: opt.name,
      price: Number(opt.price || 0),
    });
  });

  await batch.commit();
}
