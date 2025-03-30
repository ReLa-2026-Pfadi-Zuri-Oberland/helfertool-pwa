import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import useFirebase from './useFirebase';

const useFireBaseJobTypes = () => useFirebase('JobTypes');

const updateJobType = async (jobTypeId, options) => {
  try {
    const jobTypeRef = doc(db, 'JobTypes', jobTypeId);

    await updateDoc(jobTypeRef, options);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const addJobType = async () => {
  try {
    const jobTypesCollection = collection(db, 'JobTypes');
    const newJobType = {
      name: 'New Job Type',
      description: 'New Job Type Description',
    };

    await addDoc(jobTypesCollection, newJobType);
  } catch (error) {
    console.error('Error adding job type:', error);
  }
};

const removeJobType = async (jobTypeId) => {
  try {
    const jobTypeRef = doc(db, 'JobTypes', jobTypeId);
    await deleteDoc(jobTypeRef);
  } catch (error) {
    console.error('Error removing job type:', error);
  }
};
export { useFireBaseJobTypes, updateJobType, addJobType, removeJobType };
