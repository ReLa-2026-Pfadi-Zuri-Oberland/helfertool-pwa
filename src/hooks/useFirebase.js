import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../lib/firebase';

const useFirebase = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return [data, loading, error];
};

export default useFirebase;
