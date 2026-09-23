import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveSpeakingScore = async (uid, milestoneId, scoreData) => {
  try {
    const userRef = doc(db, "users", uid);
    const cleanData = {
      summary: scoreData.summary || {},
      perQuestion: scoreData.perQuestion || [],
      createdAt: new Date()
    };
    await setDoc(
      userRef,
      {
        scores: {
          [milestoneId]: cleanData 
        }
      },
      { merge: true }
    );
    console.log("SAVED STRUCTURED:", cleanData);
  } catch (error) {
    console.error("Error saving speaking score:", error);
  }
};