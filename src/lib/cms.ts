import { db } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Subscribing to services
export function subscribeToServices(callback: (services: any[]) => void) {
  const q = query(collection(db, 'services'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    console.error('Error fetching services:', error);
  });
}

// Subscribing to gallery
export function subscribeToGallery(callback: (images: any[]) => void) {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    console.error('Error fetching gallery:', error);
  });
}

// Add/Update Service
export async function saveService(service: any) {
  try {
    const id = service.id || `service_${Date.now()}`;
    const data = { ...service };
    delete data.id;
    await setDoc(doc(db, 'services', id), data);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'services');
  }
}

// Delete Service
export async function deleteService(id: string) {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
  }
}

// Add Gallery Image
export async function addGalleryImage(url: string, caption?: string) {
  try {
    const id = `img_${Date.now()}`;
    await setDoc(doc(db, 'gallery', id), {
      url,
      caption: caption || '',
      createdAt: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'gallery');
  }
}

// Delete Gallery Image
export async function deleteGalleryImage(id: string) {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
  }
}

// -------------------------------------------------------------
// Leads (Contact Form Submissions)
// -------------------------------------------------------------

export function subscribeToLeads(callback: (data: any[]) => void) {
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'leads');
  });
}

export async function saveLead(data: any) {
  try {
    const id = `lead_${Date.now()}`;
    await setDoc(doc(db, 'leads', id), {
      ...data,
      createdAt: Date.now(),
      read: false
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'leads');
  }
}

export async function markLeadRead(id: string) {
  try {
    await setDoc(doc(db, 'leads', id), { read: true }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `leads/${id}`);
  }
}

export async function deleteLead(id: string) {
  try {
    await deleteDoc(doc(db, 'leads', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `leads/${id}`);
  }
}
