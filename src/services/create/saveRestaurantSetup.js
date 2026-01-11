import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const saveRestaurantSetup = async ({
  restaurantName,
  restaurantConfig,
  categories,
  userId,
}) => {
  if (!restaurantName) {
    throw new Error("Restaurant name is required");
  }

  if (!restaurantConfig) {
    throw new Error("Restaurant Configuration is required");
  }

  if (!categories?.length) {
    throw new Error("At least one category is required");
  }

  const batch = writeBatch(db);

  const restaurantRef = doc(collection(db, "restaurants"));
  const restaurantId = restaurantRef.id;

  batch.set(restaurantRef, {
    name: restaurantName,
    config: restaurantConfig,
    createdBy: userId,
    createdAt: serverTimestamp(),
    token: 0,
    tokenUpdatedAt: serverTimestamp(),
  });

  categories.forEach((category) => {
    if (!category.name) {
      throw new Error("Category name is required");
    }

    const categoryRef = doc(collection(db, "categories"));

    batch.set(categoryRef, {
      restaurantId,
      name: category.name,
    });

    category.items.forEach((item) => {
      if (!item.name) {
        throw new Error("Item name is required");
      }

      if (!item.imageUrl) {
        throw new Error(`Item image URL required for ${item.name}`);
      }

      const itemRef = doc(collection(db, "items"));

      batch.set(itemRef, {
        restaurantId,
        categoryId: categoryRef.id,
        name: item.name,
        foodType: item.foodType,
        basePrice: Number(item.basePrice || 0),
        imageUrl: item.imageUrl,
        isAvailable: true,
      });

      item.options.forEach((option) => {
        if (!option.name) return;

        const optionRef = doc(collection(db, "options"));

        batch.set(optionRef, {
          restaurantId,
          itemId: itemRef.id,
          name: option.name,
          price: Number(option.price || 0),
        });
      });
    });
  });

  await batch.commit();
  return restaurantId;
};
