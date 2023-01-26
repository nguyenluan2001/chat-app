import { auth, firestore } from '@/utils/firebase';
import { FirebaseError } from 'firebase/app';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

interface IUseCurrentUser {
  user: DocumentData | undefined;
  loading?: boolean;
  error?: FirebaseError | undefined;
}
export const useCurrentUser = (): IUseCurrentUser => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<DocumentData | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  // const [userData, loading, error] = useDocumentData(
  //   doc(firestore, 'users', user?.uid as string),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );
  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (user != null) {
        setLoading(() => true);
        const ref = doc(firestore, 'users', user?.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setUserData(snapshot.data());
          setLoading(() => false);
        }
      }
    };
    fetchUser()
      .then(() => {})
      .catch(() => {});
  }, [user]);
  return { user: { ...userData, uid: user?.uid } };
};
