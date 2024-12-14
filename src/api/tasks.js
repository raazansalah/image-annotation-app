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

export const getTasks = async (userId, status = null) => {
  try {
    // Start with the query filtering by assignedTo
    let tasksQuery = query(
      collection(db, "tasks"),
      where("assignedTo", "==", userId)
    );

    // Conditionally add the 'status' filter if it's provided
    if (status) {
      tasksQuery = query(
        tasksQuery,
        where("status", "==", status) // Add status filter if status is provided
      );
    }

    // Execute the query
    const querySnapshot = await getDocs(tasksQuery);

    // Map the results into an array
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // Include the document ID
    }));

    return items;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
};
