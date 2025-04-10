import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import useFirebase from './useFirebase';

const useFireBaseLocations = () => useFirebase('Locations');

const updateLocation = async (locationId, options) => {
  try {
    const locationRef = doc(db, 'Locations', locationId);

    await updateDoc(locationRef, options);
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

const addLocation = async (location) => {
  try {
    const locationsCollection = collection(db, 'Locations');
    const newLocation = {
      name: location?.name || 'New Location',
      description: location?.description || 'New Location Description',
    };

    const docRef = await addDoc(locationsCollection, newLocation);
    if (docRef.id) {
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding location:', error);
  }
};

const removeLocation = async (locationId) => {
  try {
    const locationRef = doc(db, 'Locations', locationId);
    await deleteDoc(locationRef);
  } catch (error) {
    console.error('Error removing location:', error);
  }
};

export { useFireBaseLocations, updateLocation, addLocation, removeLocation };
