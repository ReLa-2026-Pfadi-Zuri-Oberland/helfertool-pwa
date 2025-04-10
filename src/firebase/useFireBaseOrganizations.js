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

const addOrganization = async (organization) => {
  try {
    const organizationsCollection = collection(db, 'Organizations');
    const newOrganization = {
      name: organization?.name || 'New Organization',
      street: organization?.street || 'New Organization Address',
      city: organization?.city || 'New City',
      contactEmail: organization?.contactEmail || 'contact@temp.ch',
      contactName: organization?.contactName || 'New Organization Contact',
      contactPhone: organization?.contactPhone || 'New Phone Number',
      country: organization?.country || 'New Country',
      website: organization?.website || 'https://www.example.com',
      administrators: organization?.administrators || [],
      engagements: organization?.engagements || [],
    };

    const docRef = await addDoc(organizationsCollection, newOrganization);
    if (docRef.id) {
      return docRef.id;
    }
    return null;
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
