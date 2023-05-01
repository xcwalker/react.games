import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { toast } from "react-hot-toast";

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
        if (docSnap.data() === undefined) {
            return Promise.reject("No User Found")
        } else {
            return Promise.resolve(docSnap.data());
        }
    } catch (e) {
        console.error("Error getting user: ", e);
        return Promise.reject({ message: "Error Getting User", error: e })
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


export async function createGame(gameData, userData, gameSettings, gameValues, currentUser, setLoading) {
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
                },
                values: gameValues,
            },
            userData: userData
        });

        console.log("Game written with ID (gM): ", docSnap.id);
        if (setLoading) setLoading(false);
        return { id: docSnap.id }
    } catch (e) {
        console.error("Error adding game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
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
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
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
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
    }
}

export async function game_purpose_trade(gameID, gameData, payingUserID, receivingUserID, fromPayingUser, fromReceivingUser, setLoading) {
    if (setLoading) setLoading(true);

    var modGameData = gameData;

    if (modGameData.transactions === undefined) {
        modGameData.transactions = [];
    }

    modGameData.transactions.push({
        type: "trade",
        date: new Date().getTime().toString(),
        trade: {
            paying: fromPayingUser,
            receiving: fromReceivingUser,
        },
        users: {
            from: payingUserID,
            to: receivingUserID,
        },
        status: "purposed",
    })

    try {
        await updateDoc(doc(db, "games", gameID), {
            data: modGameData,
        })
        if (setLoading) setLoading(false);
        console.log("Game updated (gM): Proposal Sent" + payingUserID + " => " + receivingUserID);
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
    }
}

export async function game_confirm_trade(gameID, userData, gameData, trade, setLoading) {
    if (setLoading) setLoading(true);

    var isError = false;
    var modUserData = userData;
    var modGameData = gameData;
    var tradeData;

    modGameData.transactions.map((item, index) => {
        if (item.date === trade.date) {
            tradeData = item;
            modGameData.transactions[index].status = "confirmed"
            return
        }
    })

    if (parseFloat(modUserData[tradeData.users.from].money) - parseFloat(tradeData.trade.paying.amount) < 0 || parseFloat(modUserData[tradeData.users.to].money) - parseFloat(tradeData.trade.receiving.amount) < 0) {
        isError = true;
    }

    modUserData[tradeData.users.from].money = parseFloat(modUserData[tradeData.users.from].money) - parseFloat(tradeData.trade.paying.amount);
    modUserData[tradeData.users.to].money = parseFloat(modUserData[tradeData.users.to].money) + parseFloat(tradeData.trade.paying.amount);

    modUserData[tradeData.users.from].money = parseFloat(modUserData[tradeData.users.from].money) + parseFloat(tradeData.trade.receiving.amount);
    modUserData[tradeData.users.to].money = parseFloat(modUserData[tradeData.users.to].money) - parseFloat(tradeData.trade.receiving.amount);

    if (tradeData.trade.paying.properties) {
        tradeData.trade.paying.properties.map(property => {
            if (!modUserData[tradeData.users.from].properties.includes(property)) {
                isError = true;
                return
            }

            const index = modUserData[tradeData.users.from].properties.indexOf(property);
            if (index > -1) { // only splice array when item is found
                modUserData[tradeData.users.from].properties.splice(index, 1); // 2nd parameter means remove one item only
                modUserData[tradeData.users.to].properties.push(property)
            }
        })
    }

    if (tradeData.trade.receiving.properties) {
        tradeData.trade.receiving.properties.map(property => {
            if (!modUserData[tradeData.users.to].properties.includes(property)) {
                isError = true;
                return
            }

            const index = modUserData[tradeData.users.to].properties.indexOf(property);
            if (index > -1) { // only splice array when item is found
                modUserData[tradeData.users.to].properties.splice(index, 1); // 2nd parameter means remove one item only
                modUserData[tradeData.users.from].properties.push(property)
            }
        })
    }

    if (!isError) {
        try {
            await updateDoc(doc(db, "games", gameID), {
                userData: modUserData,
                data: modGameData,
            })
            if (setLoading) setLoading(false);
            console.log("Game updated (gM): " + tradeData.users.from + " => " + tradeData.users.to);
            return Promise.resolve()
        } catch (e) {
            console.error("Error updating game (gM): ", e);
            if (setLoading) setLoading(false);
            return Promise.reject(e)
        }
    } else {
        if (setLoading) setLoading(false);
        return Promise.reject({ code: 400, message: "Request had bad syntax or was impossible to fulfill" })
    }
}

export async function game_decline_trade(gameID, gameData, trade, setLoading) {
    if (setLoading) setLoading(true);

    var modGameData = gameData;
    modGameData.transactions.map((item, index) => {
        if (item.date === trade.date) {
            modGameData.transactions[index].status = "declined"
            return
        }
    })

    try {
        await updateDoc(doc(db, "games", gameID), {
            data: modGameData,
        })
        if (setLoading) setLoading(false);
        console.log("Game updated (gM): " + trade.users.from + " =X=> " + trade.users.to);
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
    }
}

export async function game_mortgage(gameID, gameData, userData, userID, propertyID, propertyData, setLoading) {
    if (setLoading) setLoading(true);

    var isError = false;
    var modUserData = userData;
    var modGameData = gameData;

    modUserData[userID].money = parseFloat(userData[userID].money) + parseFloat(propertyData.mortgage);

    if (modGameData.transactions === undefined) {
        modGameData.transactions = [];
    }

    modGameData.transactions.push({
        type: "unmortgage",
        amount: propertyData.mortgage,
        property: propertyID,
        users: {
            to: userID,
        }
    })

    if (modGameData.mortgages === undefined) {
        modGameData.mortgages = [];
    }

    if (modGameData.mortgages.includes(propertyID) || !userData[userID].properties.includes(propertyID)) {
        isError = true;
    }

    modGameData.mortgages.push(propertyID)

    if (!isError) {
        try {
            await updateDoc(doc(db, "games", gameID), {
                userData: modUserData,
                data: modGameData,
            })
            if (setLoading) setLoading(false);
            console.log("Game updated (gM): Property Mortgaged £" + propertyData.mortgage + " => " + userID);
            return
        } catch (e) {
            console.error("Error updating game (gM): ", e);
            if (setLoading) setLoading(false);
            return Promise.reject(e)
        }
    } else {
        if (setLoading) setLoading(false);
        return Promise.reject({ code: 400, message: "Request had bad syntax or was impossible to fulfill" })
    }
}

export async function game_unmortgage(gameID, gameData, userData, userID, propertyID, propertyData, setLoading) {
    if (setLoading) setLoading(true);

    var isError = false;
    var modUserData = userData;
    var modGameData = gameData;

    if (parseFloat(userData[userID].money) - parseFloat(propertyData.mortgage) < 0) {
        isError = true;
    }

    modUserData[userID].money = parseFloat(userData[userID].money) - parseFloat(propertyData.mortgage);

    if (modGameData.transactions === undefined) {
        modGameData.transactions = [];
    }

    modGameData.transactions.push({
        type: "mortgage",
        amount: propertyData.mortgage,
        users: {
            to: userID,
        }
    })

    if (!modGameData.mortgages.includes(propertyID) || !userData[userID].properties.includes(propertyID)) {
        isError = true;
    }

    const index = modGameData.mortgages.indexOf(propertyID);
    if (index > -1) { // only splice array when item is found
        modGameData.mortgages.splice(index, 1); // 2nd parameter means remove one item only
    }

    if (!isError) {
        try {
            await updateDoc(doc(db, "games", gameID), {
                userData: modUserData,
                data: modGameData,
            })
            if (setLoading) setLoading(false);
            console.log("Game updated (gM): Property Mortgaged £" + propertyData.mortgage + " => " + userID);
            return
        } catch (e) {
            console.error("Error updating game (gM): ", e);
            if (setLoading) setLoading(false);
            return Promise.reject(e)
        }
    } else {
        if (setLoading) setLoading(false);
        return Promise.reject({ code: 400, message: "Request had bad syntax or was impossible to fulfill" })
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
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
    }
}

export async function game_sale_purpose(gameID, gameData, receivingUserID, saleData, setLoading) {
    if (setLoading) setLoading(true);

    var modGameData = gameData;

    if (modGameData.transactions === undefined) {
        modGameData.transactions = [];
    }

    modGameData.transactions.push({
        type: "sale",
        date: new Date().getTime().toString(),
        sale: saleData,
        users: {
            to: receivingUserID,
        },
        status: "purposed",
    })

    try {
        await updateDoc(doc(db, "games", gameID), {
            data: modGameData,
        })
        if (setLoading) setLoading(false);
        console.log("Game updated (gM): Sale Proposal Sent =>" + receivingUserID);
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
    }
}

export async function game_sale_confirm(gameID, userData, gameData, sale, setLoading) {
    if (setLoading) setLoading(true);

    var isError = false;
    var modUserData = userData;
    var modGameData = gameData;
    var saleData;

    modGameData.transactions.map((item, index) => {
        if (item.date === sale.date) {
            saleData = item;
            modGameData.transactions[index].status = "confirmed"
            return
        }
    })

    if (parseFloat(modUserData[saleData.users.to].money) - parseFloat(saleData.sale.amount) < 0) {
        isError = true;
    }

    modUserData[saleData.users.to].money = parseFloat(modUserData[saleData.users.to].money) - parseFloat(saleData.sale.amount);

    if (saleData.sale.property) {
        if (modGameData.properties.includes(saleData.sale.property)) {
            isError = true;
            return
        } else {
            modGameData.properties.push(saleData.sale.property)
            modUserData[saleData.users.to].properties.push(saleData.sale.property)
        }
    }

    if (!isError) {
        try {
            await updateDoc(doc(db, "games", gameID), {
                userData: modUserData,
                data: modGameData,
            })
            if (setLoading) setLoading(false);
            console.log("Game updated (gM): Sale Confirmed => " + saleData.users.to);
            return Promise.resolve()
        } catch (e) {
            console.error("Error updating game (gM): ", e);
            if (setLoading) setLoading(false);
            return Promise.reject(e)
        }
    } else {
        if (setLoading) setLoading(false);
        return Promise.reject({ code: 400, message: "Request had bad syntax or was impossible to fulfill" })
        // return Error({ isError: true, code: 400, message: "Request had bad syntax or was impossible to fulfill" })
    }
}

export async function game_sale_decline(gameID, gameData, sale, setLoading) {
    if (setLoading) setLoading(true);

    var modGameData = gameData;
    modGameData.transactions.map((item, index) => {
        if (item.date === sale.date) {
            modGameData.transactions[index].status = "declined"
            return
        }
    })

    try {
        await updateDoc(doc(db, "games", gameID), {
            data: modGameData,
        })
        if (setLoading) setLoading(false);
        console.log("Game updated (gM): Sale Declined =X=> " + sale.users.to);
        return
    } catch (e) {
        console.error("Error updating game (gM): ", e);
        if (setLoading) setLoading(false);
        return Promise.reject(e)
    }
}