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
        let arrayId = doc.id.split("").map((i) => {
          if (i === " ") {
            return "%20";
          } else if (i === "\t") {
            return "%09";
          } else {
            return i;
          }
        });
        let modifiedId = arrayId.join("");
        documents.push({ ...doc.data(), id: modifiedId });
      });
      setDocs(documents);
      setLoading(false);
    });
    return () => unsub();
  }, [collection]);

  return { docs, loading };
};

export default useFirestore;
