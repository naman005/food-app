import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/firebase/firebaseUtils"

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export async function resetDailyTokenIfNeeded(restaurantId) {
  if (!restaurantId) return

  const restaurantRef = doc(db, "restaurants", restaurantId)
  const snap = await getDoc(restaurantRef)

  if (snap.empty) return;

  const data = snap.data()
  const tokenUpdatedAt = data.tokenUpdatedAt

  const lastUpdatedDate = tokenUpdatedAt.toDate()
  const today = new Date()

  if (!isSameDay(lastUpdatedDate, today)) {
    await updateDoc(restaurantRef, {
      token: 0,
      tokenUpdatedAt: serverTimestamp(),
    })
  }
}

