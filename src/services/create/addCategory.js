import {
  collection,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseUtils";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export async function addCategory({
  restaurantId,
  category,
}) {
  if (!restaurantId) throw new Error("restaurantId required");
  if (!category.name) throw new Error("Category name required");

  const batch = writeBatch(db);

  const categoryRef = doc(collection(db, "categories"));
  batch.set(categoryRef, {
    restaurantId,
    name: category.name,
  });

  for (const item of category.items) {
    if (!item.name) return;

    if (!item.imageFile) {
      throw new Error(`Image required for item: ${item.name}`);
    }

    const itemImageUrl = await uploadToCloudinary(item.imageFile);

    const itemRef = doc(collection(db, "items"));
    batch.set(itemRef, {
      restaurantId,
      categoryId: categoryRef.id,
      name: item.name,
      foodType: item.foodType,
      basePrice: Number(item.basePrice || 0),
      imageUrl: itemImageUrl,
      isAvailable: true,
    });

    item.options.forEach((opt) => {
      if (!opt.name) return;

      const optionRef = doc(collection(db, "options"));
      batch.set(optionRef, {
        restaurantId,
        itemId: itemRef.id,
        name: opt.name,
        price: Number(opt.price || 0),
      });
    });
  }

  await batch.commit();
}
