import { db } from './src/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function testFetch() {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    console.log("Fetch successful! exists:", docSnap.exists());
    process.exit(0);
  } catch (error) {
    console.error("Fetch failed:", error);
    process.exit(1);
  }
}

testFetch();
