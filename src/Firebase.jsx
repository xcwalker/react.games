import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_AUTH_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_AUTH_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_AUTH_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_AUTH_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_AUTH_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth();
export const db = getFirestore(app);

export function useAuth(falseValue) {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
        return unsub;
    }, [])

    if (currentUser === undefined && falseValue) { setCurrentUser(falseValue) }

    return currentUser;
}

export async function createGame(gameData, userData, gameSettings, currentUser, setLoading) {
    const date = new Date();

    if (setLoading) setLoading(true);
    try {
        const docSnap = await addDoc(collection(db, "games"), {
            data: gameData,
            info: {
                gameMaster: currentUser.uid,
                settings: gameSettings,
                dates: {
                    createdAt: date.toJSON(),
                }
            },
            userData: userData
        });

        console.log("Game written with ID (gM): ", docSnap.id);
        if (setLoading) setLoading(false);
        return { id: docSnap.id }
    } catch (e) {
        console.error("Error adding game (gM): ", e);
        if (setLoading) setLoading(false);
        return { error: e }
    }
}

export async function updateGame(gameID, arg, setLoading) {
    if (setLoading) setLoading(true);

    try {
        await updateDoc(doc(db, "games", gameID), {
            about: arg.about,
            info: arg.info,
            settings: arg.settings,
            images: {
                photoURL: profilePictureURL,
                headerURL: headerPictureURL,
            },
            links: arg.links,
        })
        console.error("Game updated (gM): ", e);
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return
    }

    if (setLoading) setLoading(false);
}