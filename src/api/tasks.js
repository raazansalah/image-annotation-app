import { db } from "../../firebase";
import {
  getDocs,
  addDoc,
  collection,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export const addNewTask = async (newTaskData) => {
  try {
    const tasksCollectionRef = collection(db, "tasks");
    const docRef = await addDoc(tasksCollectionRef, newTaskData);
    console.log("New task added with ID:", docRef.id);
    fetchData();
  } catch (error) {
    console.error("Error adding new task:", error);
  }
};

export const updateTask = async (firestoreId, updatedData) => {
  try {
    const taskDocRef = doc(db, "tasks", firestoreId);
    await updateDoc(taskDocRef, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const getTasks = async (userId) => {
  try {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("assignedTo", "==", userId)
    );
    const querySnapshot = await getDocs(tasksQuery);

    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return items;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
};
