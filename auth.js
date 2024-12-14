import { auth, db } from "./firebase"; // Import Firebase auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Sign Up function
export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Login function
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Optional: Add logout function
export const logout = async () => {
  return await auth.signOut();
};

export async function handleSignup(email, password) {
  try {
    // Step 1: Sign up the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential; // User object from Firebase

    // Step 2: Add user data to Firestore collection
    const userDocRef = doc(db, "users", user.uid); // Reference to 'users/{userId}'
    await setDoc(userDocRef, {
      userId: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
    });

    console.log("User successfully signed up and added to Firestore!");
    return { success: true, message: "Signup successful" };
  } catch (error) {
    console.error("Error during signup or Firestore write: ", error);
    return { success: false, message: error.message };
  }
}
