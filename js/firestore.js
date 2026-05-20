/**
 * Global Query Pipeline Interface Engine
 * Architectural responsibility: Facilitate data manipulation routines across target collections.
 */

import { db } from "../firebase/config.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const FirestoreEngine = {
  // Push standard dictionary items natively into cloud indexes
  async pushDocument(targetCollection, assetPayload) {
    try {
      const contextRef = collection(db, targetCollection);
      return await addDoc(contextRef, {
        ...assetPayload,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error(`Database atomic insertion error inside collection [${targetCollection}]:`, err);
      throw err;
    }
  },

  // Query and pull highly optimized historical list tracking entries
  async pullCollectionOrdered(targetCollection, fieldOrder, limitBoundary = 50) {
    try {
      const ref = collection(db, targetCollection);
      const q = query(ref, orderBy(fieldOrder, "desc"), limit(limitBoundary));
      const snapshot = await getDocs(q);
      const buffer = [];
      snapshot.forEach(doc => buffer.push({ docId: doc.id, ...doc.data() }));
      return buffer;
    } catch (err) {
      console.error(`Database pull processing failure on collection [${targetCollection}]:`, err);
      throw err;
    }
  },

  // Query specific conditional values matching exact criteria keys
  async queryDocumentsByCriteria(targetCollection, searchKey, alignmentValue) {
    try {
      const ref = collection(db, targetCollection);
      const q = query(ref, where(searchKey, "==", alignmentValue));
      const snapshot = await getDocs(q);
      const output = [];
      snapshot.forEach(doc => output.push({ docId: doc.id, ...doc.data() }));
      return output;
    } catch (err) {
      console.error(`Database criteria matching error inside collection [${targetCollection}]:`, err);
      throw err;
    }
  }
};
