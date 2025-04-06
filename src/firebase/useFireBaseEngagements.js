import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import useFirebase from './useFirebase';

const useFireBaseEngagements = () => useFirebase('Engagements');

const updateEngagement = async (engagementId, options) => {
  try {
    const engagementRef = doc(db, 'Engagements', engagementId);

    await updateDoc(engagementRef, options);
  } catch (error) {
    console.error('Error updating engagement:', error);
  }
};

const addEngagement = async () => {
  try {
    const engagementsCollection = collection(db, 'Engagements');
    const newEngagement = {
      jobType: '',
      shift: '',
      location: '',
      targetNumberOfHelpers: '1',
      helpers: [],
    };

    await addDoc(engagementsCollection, newEngagement);
  } catch (error) {
    console.error('Error adding engagement:', error);
  }
};

const removeEngagement = async (engagementId) => {
  try {
    const engagementRef = doc(db, 'Engagements', engagementId);
    await deleteDoc(engagementRef);
  } catch (error) {
    console.error('Error removing engagement:', error);
  }
};

export {
  useFireBaseEngagements,
  updateEngagement,
  addEngagement,
  removeEngagement,
};
