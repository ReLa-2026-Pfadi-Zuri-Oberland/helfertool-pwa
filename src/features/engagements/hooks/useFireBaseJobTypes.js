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
    const data =
      options && typeof options === 'object'
        ? Object.fromEntries(
            Object.entries(options).filter(
              ([key, v]) => key !== 'id' && v !== undefined
            )
          )
        : {};
    await updateDoc(jobTypeRef, data);
  } catch (error) {
    console.error('Error updating job type:', error);
  }
};

const addJobType = async (jobType) => {
  try {
    const jobTypesCollection = collection(db, 'JobTypes');
    const newJobType = {
      name: jobType?.name || 'Neuer Jobtyp',
      description: jobType?.description ?? '',
    };

    const docRef = await addDoc(jobTypesCollection, newJobType);
    return docRef.id;
  } catch (error) {
    console.error('Error adding job type:', error);
    return undefined;
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
