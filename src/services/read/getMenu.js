import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseUtils";

export const getMenu = async (restaurantId) => {
  if (!restaurantId) return;

  const catSnap = await getDocs(
    query(collection(db, "categories"), where("restaurantId", "==", restaurantId))
  );
  const categories = catSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const itemSnap = await getDocs(
    query(collection(db, "items"), where("restaurantId", "==", restaurantId))
  );
  const items = itemSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const optSnap = await getDocs(collection(db, "options"));

    const options = optSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

  return { categories, items, options };
};
