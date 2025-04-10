import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import useFirebase from './useFirebase';

const useFireBaseShifts = () => useFirebase('Shifts');

const updateShift = async (shiftId, options) => {
  try {
    const shiftRef = doc(db, 'Shifts', shiftId);

    await updateDoc(shiftRef, options);
  } catch (error) {
    console.error('Error updating shift:', error);
  }
};

const addShift = async (shift) => {
  try {
    const shiftsCollection = collection(db, 'Shifts');
    const newShift = {
      name: shift?.name || 'New Shift',
      startDate: shift?.startDate || new Date().toISOString(),
      endDate: shift?.endDate || new Date().toISOString(),
    };

    const docRef = await addDoc(shiftsCollection, newShift);
    if (docRef.id) {
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding shift:', error);
  }
};

const removeShift = async (shiftId) => {
  try {
    const shiftRef = doc(db, 'Shifts', shiftId);
    await deleteDoc(shiftRef);
  } catch (error) {
    console.error('Error removing shift:', error);
  }
};

export { useFireBaseShifts, updateShift, addShift, removeShift };
