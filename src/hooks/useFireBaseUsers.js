import { auth, db } from '../lib/firebase';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import useFirebase from './useFirebase';

const useFireBaseUsers = () => useFirebase('Users');

const updateUser = async (userId, options) => {
  try {
    const userRef = doc(db, 'Users', userId);

    await updateDoc(userRef, options);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const addUser = async (userInformation) => {
  try {
    const user = auth.currentUser;

    const newUser = {
      name: userInformation?.name || user?.displayName || '',
      email: userInformation?.email || user?.email || '',
      tShirtSize: '',
      contactPhone: userInformation?.contactPhone || user?.phoneNumber || '',
      street: '',
      city: '',
      roles: [],
    };

    const userRef = doc(db, 'Users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // If the document doesn't exist, create the user document
      await setDoc(userRef, newUser);
      console.log('User added successfully.');
    } else {
      console.log('User already exists.');
    }
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const removeUser = async (userId) => {
  try {
    const userRef = doc(db, 'Users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export { useFireBaseUsers, updateUser, addUser, removeUser };
