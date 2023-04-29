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

export async function getUserInfo(userID) {
    try {
        const docSnap = await getDoc(doc(db, "users", userID));
        return docSnap.data();
    } catch (e) {
        console.error("Error getting user: ", e);
    }
}

export async function getMultipleUsersInfo(userArrayID) {
    var out = [];

    userArrayID.map(async (id, index) => {
        try {
            const docSnap = await getDoc(doc(db, "users", id));
            out.push(docSnap.data());
        } catch (e) {
            console.error("Error getting user: ", e);
        }
    })

    return out
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
            data: arg.data,
            info: arg.info,
            settings: arg.settings,
            userData: arg.userData,
        })
        console.log("Game updated (gM)");
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return
    }

    if (setLoading) setLoading(false);
}

export async function game_pay(gameID, userData, gameData, payingUserID, receivingUserID, amount, setLoading) {
    if (setLoading) setLoading(true);

    var modUserData = userData;
    var modGameData = gameData;

    modUserData[payingUserID].money = parseFloat(userData[payingUserID].money) - parseFloat(amount);

    if (receivingUserID !== "bank") {
        modUserData[receivingUserID].money = parseFloat(userData[receivingUserID].money) + parseFloat(amount);
    }

    if (modGameData.transactions === undefined) {
        modGameData.transactions = [];
    }

    modGameData.transactions.push({
        type: "pay",
        amount: amount,
        users: {
            from: payingUserID,
            to: receivingUserID,
        }
    })

    try {
        await updateDoc(doc(db, "games", gameID), {
            userData: modUserData,
            data: modGameData,
        })
        if (setLoading) setLoading(false);
        console.log("Game updated (gM): " + payingUserID + " => £" + amount + " => " + receivingUserID);
        return { isSuccess: true }
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return { isError: true }
    }
}

export async function game_goPass(gameID, userData, gameData, gameInfo, receivingUserID, setLoading) {
    if (setLoading) setLoading(true);

    var modUserData = userData;
    var modGameData = gameData;

    modUserData[receivingUserID].money = parseFloat(userData[receivingUserID].money) + parseFloat(gameInfo.values.goPass);

    if (modGameData.transactions === undefined) {
        modGameData.transactions = [];
    }

    modGameData.transactions.push({
        type: "goPass",
        amount: gameInfo.values.goPass,
        users: {
            to: receivingUserID,
        }
    })

    try {
        await updateDoc(doc(db, "games", gameID), {
            userData: modUserData,
            data: modGameData,
        })
        if (setLoading) setLoading(false);
        console.log("Game updated (gM): goPass => £" + gameInfo.values.goPass + " => " + receivingUserID);
        return { isSuccess: true }
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return { isError: true }
    }
}