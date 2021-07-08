import { useState, useEffect } from "react";
import { fireStore } from "../firebase/config";

const useFirestore = (collection) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = fireStore.collection(collection).onSnapshot((snap) => {
      let documents = [];
      snap.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id });
      });
      setDocs(documents);
      setLoading(false);
    });
    return () => unsub();
  }, [collection]);

  return { docs, loading };
};

export default useFirestore;
