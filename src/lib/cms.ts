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
    description: '',
    price: 'Starts from $150',
    features: [
      'Spot-free DI water wash',
      'Long-lasting wax protection',
      'Wheel & tire deep clean',
      'Streak-free glass cleaning',
      'Plastics & trim dressing'
    ],
    icon: 'Droplets',
    img: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg',
    order: 0
  },
  {
    id: 'interior-detail',
    title: 'Interior Detail',
    subtitle: 'Sanitize & Restore',
    description: '',
    price: 'Starts from $175',
    features: [
      'Deep vacuuming of seats & carpets',
      'Hot water extraction for stains',
      'Interior door & dash sanitization',
      'Vent cleaning & deodorizing',
      'Streak-free interior glass'
    ],
    icon: 'Wind',
    img: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg',
    order: 1
  },
  {
    id: 'full-detail',
    title: 'Full Detail',
    subtitle: 'The Complete Reset',
    description: '',
    price: 'Starts from $300',
    features: [
      'Complete exterior & interior service',
      'Paint decontamination (clay bar)',
      'High-grade paint sealant',
      'Deep interior shampoo & extraction',
      'Engine bay light wipedown'
    ],
    icon: 'Star',
    img: 'https://sharpdetailsilverspring.com/images/car2.jpg',
    order: 2
  },
  {
    id: 'date-night-package',
    title: 'Date Night Package',
    subtitle: 'Quick & Clean',
    description: '',
    price: 'Starts from $100',
    features: [
      'Express exterior wash & dry',
      'Wheel face cleaning & tire shine',
      'Quick interior vacuum',
      'Surface wipe down',
      'Glass cleaning'
    ],
    icon: 'Sparkles',
    img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
    order: 3
  },
  {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    subtitle: 'Permanent Bond',
    description: '',
    price: 'Starts from $650',
    features: [
      'Multi-year paint protection',
      'Intense hydrophobic water beading',
      'Paint correction & thorough prep',
      'Resists dirt & contamination',
      'Extreme gloss finish'
    ],
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
