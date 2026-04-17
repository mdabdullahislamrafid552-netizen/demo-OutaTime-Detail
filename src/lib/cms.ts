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
    id: 'paint-reconditioning',
    title: 'Paint Reconditioning',
    subtitle: 'Koch Chemie Certified Correction',
    desc: 'Certified correction to remove swirls, scratches, and oxidation.',
    description: 'A meticulous process to permanently remove surface imperfections like swirl marks, scratches, water spots, and oxidation. Restores clarity, depth, and gloss to your vehicle\'s clear coat.',
    features: ['Multi-stage machine compounding & polishing', 'Koch Chemie specialized abrasives', 'Removal of 80-95% of defects', 'Prepares surface for ceramic coating'],
    icon: 'Sparkles',
    img: 'https://www.clearpro.com/wp-content/uploads/2024/07/how-to-restore-paint-on-a-car-2.webp',
    order: 0
  },
  {
    id: 'full-detail',
    title: 'Full Detail',
    subtitle: 'The Complete Reset',
    desc: 'Comprehensive interior and exterior reset for a showroom finish.',
    description: 'Our most comprehensive package. A thorough cleaning, decontamination, and protection of both the interior and exterior of your vehicle. Leaves no surface untouched.',
    features: ['Deep exterior wash & spot-free rinse', 'Deep interior cleaning & stain treatment', 'Leather conditioning', 'Premium paint sealant applied'],
    icon: 'Star',
    img: 'https://sharpdetailsilverspring.com/images/car2.jpg',
    order: 1
  },
  {
    id: 'exterior-detail',
    title: 'Exterior Detail',
    subtitle: 'Gloss & Protection',
    desc: 'Deep wash using spot-free water for a flawless finish, decontamination, and premium sealant.',
    description: 'A deep cleanse of your vehicle\'s exterior utilizing spot-free water to prevent water spots and ensure a flawless finish, followed by a high-quality sealant.',
    features: ['Hand wash with spot-free water', 'Iron decontamination & clay bar', 'Wheel faces & barrels cleaned', '6-month paint sealant'],
    icon: 'Droplets',
    img: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg',
    order: 2
  },
  {
    id: 'interior-detail',
    title: 'Interior Detail',
    subtitle: 'Sanitize & Restore',
    desc: 'Deep cleaning, stain treatment, and surface restoration for a factory-fresh feel.',
    description: 'A deep cleaning of all interior surfaces. We use specialized, safe cleaners to treat stains and restore your cabin to a factory-fresh feel.',
    features: ['Deep vacuuming of carpets & seats', 'Surface restoration of plastics & vinyl', 'Targeted stain & odor treatment', 'UV protection applied to dash'],
    icon: 'Wind',
    img: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg',
    order: 3
  },
  {
    id: 'trim-restoration',
    title: 'Trim Restoration',
    subtitle: 'Revive Faded Plastics',
    desc: 'Permanent ceramic-infused restoration of faded exterior plastics.',
    description: 'Permanent restoration of faded, oxidized exterior plastic trim. We don\'t use temporary dressings; we use ceramic-infused restorers that bond to the plastic.',
    features: ['Deep cleaning of textured plastics', 'Ceramic trim coating application', 'Restores deep black factory look', 'Lasts 12-24 months'],
    icon: 'Settings2',
    img: 'https://www.carzspa.com/wp-content/uploads/2021/01/trim-restoration-carzspa.jpg',
    order: 4
  },
  {
    id: 'rock-chip-repair',
    title: 'Rock Chip Repair',
    subtitle: 'Prevent Rust & Damage',
    desc: 'Precise color-matched touch-up to prevent rust and improve appearance.',
    description: 'Precise color-matched touch-up of rock chips and deep scratches to prevent rust and improve the overall appearance of your vehicle\'s front end.',
    features: ['Color-matched OEM paint', 'Chemical leveling for smooth finish', 'Prevents clear coat failure', 'Significantly improves appearance'],
    icon: 'Wrench',
    img: 'https://www.motorbiscuit.com/wp-content/uploads/2022/07/Chrisfix-DIY-Rock-Chip-Repair-Demo-Video.jpg',
    order: 5
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
