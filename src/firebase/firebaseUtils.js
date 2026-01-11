import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./config";

const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseAuth, db };