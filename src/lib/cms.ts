import { db, storage } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImageToStorage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `img_${Date.now()}.${fileExt}`;
  const storageRef = ref(storage, `gallery/${fileName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

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

const defaultServices = [
  {
    id: 'exterior-detail',
    title: 'Exterior Detail',
    subtitle: 'Gloss & Protection',
    desc: 'Transform your vehicle with our Exterior Detail service, where we ensure a pristine finish with a full wash using spot-free water for long-lasting wax protection. Every inch of your car will shine, with meticulous attention given to cleaning all glass surfaces. Experience the difference of expert car detailing that prioritizes quality and care—because we believe in attention to detail, every time.',
    description: 'Transform your vehicle with our Exterior Detail service, where we ensure a pristine finish with a full wash using spot-free water for long-lasting wax protection. Every inch of your car will shine, with meticulous attention given to cleaning all glass surfaces. Experience the difference of expert car detailing that prioritizes quality and care—because we believe in attention to detail, every time.',
    features: ['Spot-free water wash', 'Long-lasting wax protection', 'Glass cleaning', 'Meticulous attention to detail'],
    icon: 'Droplets',
    img: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg',
    order: 0
  },
  {
    id: 'interior-detail',
    title: 'Interior Detail',
    subtitle: 'Sanitize & Restore',
    desc: 'Interior cleaning where it matters. Seats, carpets, doors, dash, vents, floor mats and glass. The kind of clean that makes you actually want to get in your car!',
    description: 'Interior cleaning where it matters. Seats, carpets, doors, dash, vents, floor mats and glass. The kind of clean that makes you actually want to get in your car!',
    features: ['Seats and carpets', 'Doors and dash', 'Vents and floor mats', 'Glass cleaning'],
    icon: 'Wind',
    img: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg',
    order: 1
  },
  {
    id: 'full-detail',
    title: 'Full Detail',
    subtitle: 'The Complete Reset',
    desc: 'The complete reset! Every surface, inside and out. Paint is decontaminated, the interior deep cleaned, trim restored. Get your car looking better than new!',
    description: 'The complete reset! Every surface, inside and out. Paint is decontaminated, the interior deep cleaned, trim restored. Get your car looking better than new!',
    features: ['Every surface inside and out', 'Paint decontamination', 'Interior deep clean', 'Trim restoration'],
    icon: 'Star',
    img: 'https://sharpdetailsilverspring.com/images/car2.jpg',
    order: 2
  },
  {
    id: 'date-night-package',
    title: 'Date Night Package',
    subtitle: 'Quick & Clean',
    desc: 'Looking to have a quick detail for that special occasion? This interior/exterior service offers an exterior wash, tires/wheels cleaned and vehicle dried off. Interior will include a quick vacuum, wipe down of all surfaces and glass cleaned.',
    description: 'Looking to have a quick detail for that special occasion? This interior/exterior service offers an exterior wash, tires/wheels cleaned and vehicle dried off. Interior will include a quick vacuum, wipe down of all surfaces and glass cleaned.',
    features: ['Exterior wash', 'Tires/wheels cleaned', 'Vehicle dried off', 'Quick interior vacuum and wipe down'],
    icon: 'Sparkles',
    img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
    order: 3
  },
  {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    subtitle: 'Permanent Bond',
    desc: 'The last protection your paint will need. A permanent bond coating that repels water, resists contamination, and keeps your car looking freshly detailed for years, not weeks! Service is applied by hand, paint surface thoroughly and properly prepped to ensure the coating properly bonds to the paint.',
    description: 'The last protection your paint will need. A permanent bond coating that repels water, resists contamination, and keeps your car looking freshly detailed for years, not weeks! Service is applied by hand, paint surface thoroughly and properly prepped to ensure the coating properly bonds to the paint.',
    features: ['Permanent bond coating', 'Repels water', 'Resists contamination', 'Applied by hand with thorough prep'],
    icon: 'ShieldCheck',
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    order: 4
  }
];

const defaultGalleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    caption: 'Paint Correction',
    span: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
    caption: 'Ceramic Coating',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
    caption: 'Interior Detail',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800',
    caption: 'Exterior Wash',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    caption: 'Leather Restoration',
    span: 'col-span-1 md:col-span-2 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    caption: 'Wheel Detailing',
    span: 'col-span-1 row-span-1'
  }
];

export async function seedDefaults() {
  try {
    for (const s of defaultServices) {
      await saveService(s);
    }
    for (let i = 0; i < defaultGalleryImages.length; i++) {
        const img: any = defaultGalleryImages[i];
        const id = `img_default_${i}`;
        await setDoc(doc(db, 'gallery', id), {
            url: img.url,
            caption: img.caption || '',
            span: img.span || '',
            createdAt: Date.now() + i
        });
    }
  } catch (err) {
    console.error("Failed to seed", err);
  }
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

// -------------------------------------------------------------
// Global Settings / Pages / SEO / Analytics
// -------------------------------------------------------------

export function subscribeToSettings(callback: (data: any) => void) {
  return onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error fetching settings:', error);
  });
}

export async function saveSettings(data: any) {
  try {
    await setDoc(doc(db, 'settings', 'global'), data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/global');
  }
}
