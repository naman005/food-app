import { 
    query,
    collection,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseUtils";

export const getRestaurantId = async (user) => {
    if(!user) return;
    
    const q = query(
      collection(db, "restaurants"),
      where("createdBy", "==", user.uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) return;

    const restaurantId = snap.docs[0].id;

    return restaurantId;  
}