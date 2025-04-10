import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';

import useFirebase from './useFirebase';

const useFireBaseEngagements = () => {
  const [engagements, loading, error] = useFirebase('Engagements');
  let engagementsTransformed = engagements.map((engagement) => {
    /* Use already registered */
    const userId = auth.currentUser?.uid;
    const isRegistered = engagement.helpers.includes(userId);

    return {
      ...engagement,
      isRegistered,
    };
  });
  return [engagementsTransformed, loading, error];
};

const updateEngagement = async (engagementId, options) => {
  try {
    const engagementRef = doc(db, 'Engagements', engagementId);

    await updateDoc(engagementRef, options);
  } catch (error) {
    console.error('Error updating engagement:', error);
  }
};

const addEngagement = async (engagement) => {
  try {
    const engagementsCollection = collection(db, 'Engagements');
    const newEngagement = {
      jobType: engagement?.jobType || '',
      shift: engagement?.shift || '',
      location: engagement?.location || '',
      targetNumberOfHelpers: engagement?.targetNumberOfHelpers || '1',
      organization: engagement?.organization || '',
      helpers: engagement?.helpers || [],
    };

    const docRef = await addDoc(engagementsCollection, newEngagement);
    if (docRef.id) {
      return docRef.id;
    }
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

const registerForEngagement = async (
  engagementId,
  userId = auth.currentUser.uid
) => {
  if (!userId) {
    console.error('User not authenticated. Cannot register for engagement.');
    return;
  }
  try {
    const engagementRef = doc(db, 'Engagements', engagementId);
    await updateDoc(engagementRef, {
      helpers: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error registering for engagement:', error);
  }
};

export {
  useFireBaseEngagements,
  updateEngagement,
  addEngagement,
  removeEngagement,
  registerForEngagement,
};
