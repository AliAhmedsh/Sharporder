import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from '@react-native-firebase/firestore';

// Initialize Firestore
const db = getFirestore();

// Firebase Loads Service
export const firebaseLoadsService = {
  // Get all available loads (for drivers)
  getAvailableLoads: async (filters = {}) => {
    try {
      let q = collection(db, 'loads');

      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.truckType) {
        q = query(q, where('truckType', '==', filters.truckType));
      }

      // Order by created date (newest first)
      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const loads = [];

      querySnapshot.forEach((doc) => {
        loads.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        });
      });

      return { success: true, data: loads };
    } catch (error) {
      console.error('Error fetching loads:', error);
      return { success: false, error: error.message };
    }
  },

  // Get loads for a specific user (shipper's loads)
  getMyLoads: async (userId) => {
    try {
      const q = query(
        collection(db, 'loads'),
        where('shipperId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const loads = [];

      querySnapshot.forEach((doc) => {
        loads.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        });
      });

      return { success: true, data: loads };
    } catch (error) {
      console.error('Error fetching my loads:', error);
      return { success: false, error: error.message };
    }
  },

  // Create new load
  createLoad: async (loadData) => {
    try {
      const docRef = await addDoc(collection(db, 'loads'), {
        ...loadData,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        data: { id: docRef.id, ...loadData }
      };
    } catch (error) {
      console.error('Error creating load:', error);
      return { success: false, error: error.message };
    }
  },

  // Update load
  updateLoad: async (loadId, updates) => {
    try {
      const loadRef = doc(db, 'loads', loadId);
      await updateDoc(loadRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating load:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete load
  deleteLoad: async (loadId) => {
    try {
      await deleteDoc(doc(db, 'loads', loadId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting load:', error);
      return { success: false, error: error.message };
    }
  },

  // Accept load (for drivers)
  acceptLoad: async (loadId, driverId) => {
    try {
      const loadRef = doc(db, 'loads', loadId);
      await updateDoc(loadRef, {
        status: 'accepted',
        driverId: driverId,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error accepting load:', error);
      return { success: false, error: error.message };
    }
  },

  // Listen to loads in real-time
  subscribeToLoads: (callback, filters = {}) => {
    let q = collection(db, 'loads');

    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.truckType) {
      q = query(q, where('truckType', '==', filters.truckType));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loads = [];
      querySnapshot.forEach((doc) => {
        loads.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        });
      });
      callback(loads);
    });

    return unsubscribe;
  }
};
