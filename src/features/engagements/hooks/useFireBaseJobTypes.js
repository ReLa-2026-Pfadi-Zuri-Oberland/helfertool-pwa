import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../../../lib/firebase';
import useFirebase from '../../../hooks/useFirebase';

const useFireBaseJobTypes = () => useFirebase('JobTypes');

const updateJobType = async (jobTypeId, options) => {
  try {
    const jobTypeRef = doc(db, 'JobTypes', jobTypeId);

    await updateDoc(jobTypeRef, options);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const addJobType = async (jobType) => {
  try {
    const jobTypesCollection = collection(db, 'JobTypes');
    const newJobType = {
      name: jobType?.name || 'New Job Type',
      description: jobType?.description || 'New Job Type Description',
    };

    const docRef = await addDoc(jobTypesCollection, newJobType);
    if (docRef.id) {
      return docRef.id;
    }
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
