import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import useFirebase from './useFirebase';

const useFireBaseOrganizations = () => useFirebase('Organizations');

const updateOrganization = async (organizationId, options) => {
  try {
    const organizationRef = doc(db, 'Organizations', organizationId);

    await updateDoc(organizationRef, options);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const addOrganization = async () => {
  try {
    const organizationsCollection = collection(db, 'Organizations');
    const newOrganization = {
      name: 'New Organization',
      adress: 'New Organization Address',
      contactEmail: 'contact@temp.ch',
      contactName: 'New Organization Contact',
      contactPhone: 'New Phone Number',
      country: 'New Country',
      customLink: '',
      website: 'https://www.example.com',
      administrators: [],
      engagements: [],
    };

    await addDoc(organizationsCollection, newOrganization);
  } catch (error) {
    console.error('Error adding organization:', error);
  }
};

const removeOrganization = async (organizationId) => {
  try {
    const organizationRef = doc(db, 'Organizations', organizationId);
    await deleteDoc(organizationRef);
  } catch (error) {
    console.error('Error removing organization:', error);
  }
};

export {
  useFireBaseOrganizations,
  updateOrganization,
  addOrganization,
  removeOrganization,
};
