import { Fragment, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom";
import { db, createGame, useAuth, getUserInfo, getMultipleUsersInfo, game_pay, game_goPass } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

import "../style/monopoly/index.css"
import "../style/monopoly/banker.css"
import "../style/monopoly/player.css"
import "../style/monopoly/properties.css"
import "../style/monopoly/station.css"
import "../style/monopoly/modal/index.css"
import "../style/monopoly/modal/loading.css"
import "../style/monopoly/modal/pay.css"
import "../style/monopoly/modal/trade.css"
import "../style/monopoly/modal/goPass.css"

const properties = {
    0: {
        name: "Old Kent Road",
        color: "#8d6a1a",
        colorText: "#ffffff",
        set: 0,
        price: 60,
        mortgage: 30,
        house: 50,
        hotel: 50,
        rent: {
            0: 2,
            1: 10,
            2: 30,
            3: 90,
            4: 160,
            5: 250,
        },
    },
    1: {
        name: "Whitechapel Road",
        color: "#8d6a1a",
        colorText: "#ffffff",
        set: 0,
        price: 60,
        mortgage: 30,
        house: 50,
        hotel: 50,
        rent: {
            0: 4,
            1: 20,
            2: 60,
            3: 180,
            4: 320,
            5: 450,
        },
    },
    2: {
        name: "The Angel Islington",
        color: "#b8e0e7",
        colorText: "#000000",
        set: 1,
        price: 100,
        mortgage: 50,
        house: 50,
        hotel: 50,
        rent: {
            0: 6,
            1: 30,
            2: 90,
            3: 270,
            4: 400,
            5: 550,
        },
    },
    3: {
        name: "Euston Road",
        color: "#b8e0e7",
        colorText: "#000000",
        set: 1,
        price: 100,
        mortgage: 50,
        house: 50,
        hotel: 50,
        rent: {
            0: 6,
            1: 30,
            2: 90,
            3: 270,
            4: 400,
            5: 550,
        },
    },
    4: {
        name: "Pentonville Road",
        color: "#b8e0e7",
        colorText: "#000000",
        set: 1,
        price: 120,
        mortgage: 60,
        house: 50,
        hotel: 50,
        rent: {
            0: 8,
            1: 40,
            2: 100,
            3: 300,
            4: 450,
            5: 600,
        },
    },
    5: {
        name: "Pall Mall",
        color: "#ea4186",
        colorText: "#ffffff",
        set: 2,
        price: 140,
        mortgage: 70,
        house: 100,
        hotel: 100,
        rent: {
            0: 10,
            1: 50,
            2: 150,
            3: 450,
            4: 625,
            5: 750,
        },
    },
    6: {
        name: "Whitehall",
        color: "#ea4186",
        colorText: "#ffffff",
        set: 2,
        price: 140,
        mortgage: 70,
        house: 100,
        hotel: 100,
        rent: {
            0: 10,
            1: 50,
            2: 150,
            3: 450,
            4: 625,
            5: 750,
        },
    },
    7: {
        name: "Northumberland Avenue",
        color: "#ea4186",
        colorText: "#ffffff",
        set: 2,
        price: 160,
        mortgage: 80,
        house: 100,
        hotel: 100,
        rent: {
            0: 12,
            1: 60,
            2: 180,
            3: 500,
            4: 700,
            5: 900,
        },
    },
    8: {
        name: "Bow Street",
        color: "#e69709",
        colorText: "#000000",
        set: 3,
        price: 180,
        mortgage: 90,
        house: 100,
        hotel: 100,
        rent: {
            0: 14,
            1: 70,
            2: 200,
            3: 550,
            4: 750,
            5: 950,
        },
    },
    9: {
        name: "Marlborough Street",
        color: "#e69709",
        colorText: "#000000",
        set: 3,
        price: 180,
        mortgage: 90,
        house: 100,
        hotel: 100,
        rent: {
            0: 14,
            1: 70,
            2: 200,
            3: 550,
            4: 750,
            5: 950,
        },
    },
    10: {
        name: "Vine Street",
        color: "#e69709",
        colorText: "#000000",
        set: 3,
        price: 200,
        mortgage: 100,
        house: 100,
        hotel: 100,
        rent: {
            0: 16,
            1: 80,
            2: 220,
            3: 600,
            4: 800,
            5: 1000,
        },
    },
    11: {
        name: "The Strand",
        color: "#d83302",
        colorText: "#ffffff",
        set: 4,
        price: 220,
        mortgage: 110,
        house: 150,
        hotel: 150,
        rent: {
            0: 18,
            1: 90,
            2: 250,
            3: 700,
            4: 875,
            5: 1050,
        },
    },
    12: {
        name: "Fleet Street",
        color: "#d83302",
        colorText: "#ffffff",
        set: 4,
        price: 220,
        mortgage: 110,
        house: 150,
        hotel: 150,
        rent: {
            0: 18,
            1: 90,
            2: 250,
            3: 700,
            4: 875,
            5: 1050,
        },
    },
    13: {
        name: "Trafalgar Square",
        color: "#d83302",
        colorText: "#ffffff",
        set: 4,
        price: 240,
        mortgage: 120,
        house: 150,
        hotel: 150,
        rent: {
            0: 20,
            1: 100,
            2: 300,
            3: 750,
            4: 925,
            5: 1100,
        },
    },
    14: {
        name: "Leicester Square",
        color: "#ecf002",
        colorText: "#000000",
        set: 5,
        price: 260,
        mortgage: 130,
        house: 150,
        hotel: 150,
        rent: {
            0: 22,
            1: 110,
            2: 330,
            3: 800,
            4: 975,
            5: 1150,
        },
    },
    15: {
        name: "Coventry Street",
        color: "#ecf002",
        colorText: "#000000",
        set: 5,
        price: 260,
        mortgage: 130,
        house: 150,
        hotel: 150,
        rent: {
            0: 22,
            1: 110,
            2: 330,
            3: 800,
            4: 975,
            5: 1150,
        },
    },
    16: {
        name: "Piccadilly",
        color: "#ecf002",
        colorText: "#000000",
        set: 5,
        price: 280,
        mortgage: 140,
        house: 150,
        hotel: 150,
        rent: {
            0: 24,
            1: 120,
            2: 360,
            3: 850,
            4: 1025,
            5: 1200,
        },
    },
    17: {
        name: "Regent Street",
        color: "#41c011",
        colorText: "#ffffff",
        set: 6,
        price: 300,
        mortgage: 150,
        house: 200,
        hotel: 200,
        rent: {
            0: 26,
            1: 130,
            2: 390,
            3: 900,
            4: 1100,
            5: 1275,
        },
    },
    18: {
        name: "Oxford Street",
        color: "#41c011",
        colorText: "#ffffff",
        set: 6,
        price: 300,
        mortgage: 150,
        house: 200,
        hotel: 200,
        rent: {
            0: 26,
            1: 130,
            2: 390,
            3: 900,
            4: 1100,
            5: 1275,
        },
    },
    19: {
        name: "Bond Street",
        color: "#41c011",
        colorText: "#ffffff",
        set: 6,
        price: 320,
        mortgage: 160,
        house: 200,
        hotel: 200,
        rent: {
            0: 28,
            1: 150,
            2: 450,
            3: 1000,
            4: 1200,
            5: 1400,
        },
    },
    20: {
        name: "Park Lane",
        color: "#475c9c",
        colorText: "#ffffff",
        set: 7,
        price: 350,
        mortgage: 175,
        house: 200,
        hotel: 200,
        rent: {
            0: 35,
            1: 175,
            2: 500,
            3: 1100,
            4: 1300,
            5: 1500,
        },
    },
    21: {
        name: "Mayfair",
        color: "#475c9c",
        colorText: "#ffffff",
        set: 7,
        price: 400,
        mortgage: 200,
        house: 200,
        hotel: 200,
        rent: {
            0: 50,
            1: 200,
            2: 600,
            3: 1400,
            4: 1700,
            5: 2000,
        },
    },
    22: {
        name: "King's Cross Station",
        color: "#ffffff",
        colorText: "#000000",
        set: 8,
        price: 200,
        mortgage: 100,
        isStation: true,
        rent: {
            1: 25,
            2: 50,
            3: 100,
            4: 200,
        },
    },
    23: {
        name: "Marylebone Station",
        color: "#ffffff",
        colorText: "#000000",
        set: 8,
        price: 200,
        mortgage: 100,
        isStation: true,
        rent: {
            1: 25,
            2: 50,
            3: 100,
            4: 200,
        },
    },
    24: {
        name: "Fenchurch Street Station",
        color: "#ffffff",
        colorText: "#000000",
        set: 8,
        price: 200,
        mortgage: 100,
        isStation: true,
        rent: {
            1: 25,
            2: 50,
            3: 100,
            4: 200,
        },
    },
    25: {
        name: "Liverpool Street Station",
        color: "#ffffff",
        colorText: "#000000",
        set: 8,
        price: 200,
        mortgage: 100,
        isStation: true,
        rent: {
            1: 25,
            2: 50,
            3: 100,
            4: 200,
        },
    },
    26: {
        name: "Electric Company",
        color: "#eaa377",
        colorText: "#000000",
        set: 9,
        price: 150,
        mortgage: 75,
        isUtility: true,
        rent: {
            1: 4,
            2: 10,
        },
    },
    27: {
        name: "Water Works",
        color: "#eaa377",
        colorText: "#000000",
        set: 9,
        price: 150,
        mortgage: 75,
        isUtility: true,
        rent: {
            1: 4,
            2: 10,
        },
    }
}

export function Game_Monopoly() {
    const params = useParams();
    const currentUser = useAuth(null);
    const [error, setError] = useState();
    const [createdDate, setCreatedDate] = useState();
    const [gameData, setGameData] = useState();
    const [gameInfo, setGameInfo] = useState();
    const [gamePlayers, setGamePlayers] = useState();
    const [userData, setUserData] = useState();
    const [allUserData, setAllUserData] = useState();
    const [userProperties, setUserProperties] = useState();
    const [mode, setMode] = useState();

    useEffect(() => {
        if (!currentUser) return

        // const gamePromise = getGameInfo(params.gameID)

        const unsubscribe = onSnapshot(doc(db, "games", params.gameID), (doc) => {
            console.log("Current data: ", doc.data());

            setGameData(doc.data().data);
            setGameInfo(doc.data().info);
            setUserData(doc.data().userData[currentUser.uid]);
            setAllUserData(doc.data().userData);
            setGamePlayers(Object.keys(doc.data().userData));
            setUserProperties(doc.data().userData[currentUser.uid].properties.sort((a, b) => a - b));
            setCreatedDate(new Date(doc.data().info.dates.createdAt.toString()));
        });

        return () => unsubscribe()
    }, [params.gameID, currentUser])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return <>
        {error && <>
            Error: {error.code}
        </>}
        {currentUser && userData && !error && <>
            <section className="game" id="monopoly">
                {gameInfo.gameMaster === currentUser.uid && <>
                    <div className="container" id="banker">
                        <button type="control" onClick={() => { document.body.classList.add("modal-goPass-visible") }}>Pass Go</button>
                    </div>
                    <div className="separator" />
                </>}
                {userData && <div className="container" id="player">
                    <div className="money">
                        <span className="title">Balance</span>
                        <span className="price">{formatter.format(userData.money)}</span>
                    </div>
                    <div className="controls">
                        <button type="control" onClick={() => { document.body.classList.add("modal-pay-visible") }}>Pay</button>
                        <button type="control" onClick={() => { document.body.classList.add("modal-trade-visible") }}>Trade</button>
                    </div>
                    <div className="properties">
                        <h2>Your Properties</h2>
                        {userProperties && userProperties.length === 0 && <div>You have no properties</div>}
                        {userProperties && userProperties.length > 0 && <ul>
                            {userProperties.map((item, index) => {
                                return <Fragment key={index}>
                                    {!properties[item].isStation && !properties[item].isUtility && <li className="property">
                                        <div className="top" style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                            <span className="title">Title Deed</span>
                                            <span className="name">{properties[item].name}</span>
                                        </div>
                                        <div className="bottom">
                                            <div className="rents">
                                                <div className="rent">
                                                    <span>Rent </span>
                                                    <span className="price">£{properties[item].rent[0]}</span>
                                                </div>
                                                <div className="houses">
                                                    <div className="line">
                                                        <span>With 1 House</span>
                                                        <span className="price">£{properties[item].rent[1]}</span>
                                                    </div>
                                                    <div className="line">
                                                        <span>With 2 House</span>
                                                        <span className="price">£{properties[item].rent[2]}</span>
                                                    </div>
                                                    <div className="line">
                                                        <span>With 3 House</span>
                                                        <span className="price">£{properties[item].rent[3]}</span>
                                                    </div>
                                                    <div className="line">
                                                        <span>With 4 House</span>
                                                        <span className="price">£{properties[item].rent[4]}</span>
                                                    </div>
                                                </div>
                                                <div className="hotel">
                                                    <span>Hotel </span>
                                                    <span className="price">£{properties[item].rent[5]}</span>
                                                </div>
                                            </div>
                                            <div className="costs">
                                                <div className="mortgage">
                                                    <span>Mortgage Value </span>
                                                    <span className="price">£{properties[item].mortgage}</span>
                                                </div>
                                                <div className="houses">
                                                    <span>Houses cost </span>
                                                    <span className="price">£{properties[item].house}</span>
                                                    <span> Each</span>
                                                </div>
                                                <div className="hotels">
                                                    <span>Hotel, </span>
                                                    <span className="price">£{properties[item].hotel}</span>
                                                    <span> plus 4 Houses</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>}
                                    {properties[item].isStation && <li className="station">
                                        <div className="top" style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                            <span className="title">Station</span>
                                            <span className="name">{properties[item].name}</span>
                                        </div>
                                        <div className="bottom">
                                            <div />
                                            <div className="rents">
                                                <div className="line">
                                                    <span>Rent</span>
                                                    <span className="price">£{properties[item].rent[1]}</span>
                                                </div>
                                                <div className="line">
                                                    <span>If 2 R.R.'s are owned</span>
                                                    <span className="price">£{properties[item].rent[2]}</span>
                                                </div>
                                                <div className="line">
                                                    <span>If 3 R.R.'s are owned</span>
                                                    <span className="price">£{properties[item].rent[3]}</span>
                                                </div>
                                                <div className="line">
                                                    <span>If 4 R.R.'s are owned</span>
                                                    <span className="price">£{properties[item].rent[4]}</span>
                                                </div>
                                            </div>
                                            <div className="costs">
                                                <div className="mortgage">
                                                    <span>Mortgage Value </span>
                                                    <span className="price">£{properties[item].mortgage}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>}
                                    {properties[item].isUtility && <>
                                    </>}
                                </Fragment>
                            })}
                        </ul>}
                    </div>
                    <Modal_Pay ids={gamePlayers} gameID={params.gameID} userData={allUserData} gameData={gameData} currentUser={currentUser} />
                    <Modal_Trade ids={gamePlayers} gameID={params.gameID} userData={allUserData} gameData={gameData} currentUser={currentUser} />
                    <Modal_Gamemaster_GoPass ids={gamePlayers} gameID={params.gameID} userData={allUserData} gameData={gameData} gameInfo={gameInfo} currentUser={currentUser} />
                </div>}
            </section>
        </>}
        {!currentUser && currentUser !== null && <>
            loadingr
        </>}
        {currentUser === null && <>
            noUser
        </>}
    </>
}

export function Game_New_Monopoly() {
    const currentUser = useAuth(null);
    const [ID, setID] = useState();
    const [error, setError] = useState();

    const newGame = () => {
        createGame({}, {
            [currentUser.uid]: {
                money: 1500,
                properties: [
                    0, 15, 21
                ],
                cards: [],
            }
        }, {}, currentUser)
            .then(res => {
                if (res.id) setID(res.id)
                if (res.error) setID(res.error)
            })
    }

    return <>
        {ID && <Navigate to={"./" + ID} />}
        <button onClick={newGame}>Click Me!</button>
    </>
}

function Modal_Pay(props) {
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState()
    const [recipientData, setRecipientData] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    // useEffect(() => { // Dev Code
    //     document.body.classList.add("modal-pay-visible")
    // }, [])

    useEffect(() => {
        if (recipient === "" || recipient === "bank" || !recipient) return

        setLoadingData(true)
        const promise = getUserInfo(recipient)

        promise.then(res => {
            setRecipientData(res)
            setLoadingData(false)
        })

        return () => {
            setRecipientData("")
        }
    }, [recipient])

    const handleAmountChange = (e,) => {
        setAmount(e.currentTarget.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const promise = game_pay(props.gameID, props.userData, props.gameData, props.currentUser.uid, recipient, amount, setLoading);

        toast.promise(promise, {
            loading: 'Confirming Transaction!',
            success: 'Transaction Complete!',
            error: 'promise Error!',
        }, {
            id: "Monopoly-Pay",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            if (res.isSuccess) {
                setRecipient("")
                setAmount(0)
                document.body.classList.remove("modal-pay-visible")
                return
            }

            if (res.isError) {
                // handle Error
                return
            }
        })
    }

    return <>
        <div className="modal" id="pay">
            <form className="container" onSubmit={handleSubmit}>
                <button type="cancel" onClick={(e) => { e.preventDefault(); setRecipient(""); setAmount(); document.body.classList.remove("modal-pay-visible") }}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                {recipient !== "" && !recipientData && recipient !== "bank" && loadingData && <>
                    <Modal_Part_Loading />
                </>}
                {(recipientData || recipient === "bank") && <>
                    <span className="title">And How Much?</span>
                    <button className="recipient" onClick={(e) => { e.preventDefault(); setRecipient(""); setAmount() }}>
                        {recipient !== "bank" && <>
                            <img src={recipientData.images.photoURL} alt="" className="profilePicture" />
                            <div className="about">
                                <span className="name">{recipientData.about.firstname} {recipientData.about.lastname}</span>
                                <span className="display">{recipientData.about.displayname}</span>
                                <span className="hover">Change</span>
                                <span className="icon-hover">Change</span>
                            </div>
                        </>}
                        {recipient === "bank" && <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlSpace="preserve"
                                viewBox="0 0 512 512"
                                className="bank"
                            >
                                <g>
                                    <path d="m451.5 132.5-97.8-43-97.7-43-97.7 43-97.8 43v50h391zM99 365.5a10.5 10.5 0 1 0 0 21h62a10.5 10.5 0 1 0 0-21h-3.5v-150h3.5a10.5 10.5 0 1 0 0-21H99a10.5 10.5 0 1 0 0 21h3.5v150H99zm126 0a10.5 10.5 0 1 0 0 21h62a10.5 10.5 0 1 0 0-21h-3.5v-150h3.5a10.5 10.5 0 1 0 0-21h-62a10.5 10.5 0 1 0 0 21h3.5v150H225zm128 0a10.5 10.5 0 1 0 0 21h62a10.5 10.5 0 1 0 0-21h-3.5v-150h3.5a10.5 10.5 0 1 0 0-21h-62a10.5 10.5 0 1 0 0 21h3.5v150H353zm-292.5 43v6a10 10 0 0 0 10 10h371a10 10 0 0 0 10-10v-6a10 10 0 0 0-10-10h-371a10 10 0 0 0-10 10zm407 28h-423a10 10 0 0 0-10 10v9a10 10 0 0 0 10 10h423a10 10 0 0 0 10-10v-9a10 10 0 0 0-10-10z" />
                                </g>
                            </svg>
                            <span className="bank">Bank</span>
                            <span className="hover">Change</span>
                            <span className="icon-hover">Change</span>
                        </>}
                    </button>
                    <input type="number" step={1} onChange={handleAmountChange} value={amount} required min={1} max={props.userData[props.currentUser.uid].money} placeholder="100" />
                    <button type="submit" disabled={loading}>Pay!</button>
                </>}
                {recipient === "" && props.ids && <>
                    <span className="title">Who Are You Paying?</span>
                    <ul className="userList">
                        <button onClick={() => setRecipient("bank")} type="bank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlSpace="preserve"
                                viewBox="0 0 512 512"
                                className="bank"
                            >
                                <g>
                                    <path d="m451.5 132.5-97.8-43-97.7-43-97.7 43-97.8 43v50h391zM99 365.5a10.5 10.5 0 1 0 0 21h62a10.5 10.5 0 1 0 0-21h-3.5v-150h3.5a10.5 10.5 0 1 0 0-21H99a10.5 10.5 0 1 0 0 21h3.5v150H99zm126 0a10.5 10.5 0 1 0 0 21h62a10.5 10.5 0 1 0 0-21h-3.5v-150h3.5a10.5 10.5 0 1 0 0-21h-62a10.5 10.5 0 1 0 0 21h3.5v150H225zm128 0a10.5 10.5 0 1 0 0 21h62a10.5 10.5 0 1 0 0-21h-3.5v-150h3.5a10.5 10.5 0 1 0 0-21h-62a10.5 10.5 0 1 0 0 21h3.5v150H353zm-292.5 43v6a10 10 0 0 0 10 10h371a10 10 0 0 0 10-10v-6a10 10 0 0 0-10-10h-371a10 10 0 0 0-10 10zm407 28h-423a10 10 0 0 0-10 10v9a10 10 0 0 0 10 10h423a10 10 0 0 0 10-10v-9a10 10 0 0 0-10-10z" />
                                </g>
                            </svg>
                            <span>Bank</span>
                        </button>
                        {props.ids.sort((a, b) => a.localeCompare(b)).map((player, index) => {
                            if (player === props.currentUser.uid) return <Fragment key={index} />
                            return <button key={index} onClick={() => setRecipient(player)} type="select">
                                <Modal_Part_Player id={player} />
                            </button>
                        })}
                    </ul>
                </>}
            </form>
        </div>
        <div className="modal-overlay" id="for-pay" onClick={(e) => { e.preventDefault(); setRecipient(""); setAmount(); document.body.classList.remove("modal-pay-visible") }} />
    </>
}

function Modal_Trade(props) {
    const handleSubmit = () => {
        // const promise = 
    }

    return <>
        <div className="modal" id="trade">
            <form className="container">

            </form>
        </div>
        <div className="modal-overlay" id="for-trade" onClick={(e) => { e.preventDefault(); setRecipient(""); document.body.classList.remove("modal-trade-visible") }} />
    </>
}

function Modal_Gamemaster_GoPass(props) {
    const [recipient, setRecipient] = useState("")
    const [recipientData, setRecipientData] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    useEffect(() => {
        if (recipient === "" || recipient === "bank" || !recipient) return

        setLoadingData(true)
        const promise = getUserInfo(recipient)

        promise.then(res => {
            setRecipientData(res)
            setLoadingData(false)
        })

        return () => {
            setRecipientData("")
        }
    }, [recipient])

    const handleSubmit = (e) => {
        e.preventDefault();

        const promise = game_goPass(props.gameID, props.userData, props.gameData, props.gameInfo, recipient, setLoading);

        toast.promise(promise, {
            loading: 'Confirming Transaction!',
            success: 'Transaction Complete!',
            error: 'promise Error!',
        }, {
            id: "Monopoly-Pay",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            if (res.isSuccess) {
                setRecipient("")
                document.body.classList.remove("modal-goPass-visible")
                return
            }

            if (res.isError) {
                // handle Error
                return
            }
        })
    }

    return <>
        {props.currentUser.uid === props.gameInfo.gameMaster && <>
            <div className="modal" id="goPass">
                <form className="container" onSubmit={handleSubmit}>
                    <button type="cancel" onClick={(e) => { e.preventDefault(); setRecipient(""); document.body.classList.remove("modal-goPass-visible") }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {recipient !== "" && !recipientData && loadingData && <>
                        <Modal_Part_Loading />
                    </>}
                    {recipientData && <>
                        <span className="title">Confirm?</span>
                        <button className="recipient" onClick={(e) => { e.preventDefault(); setRecipient("") }}>
                            <img src={recipientData.images.photoURL} alt="" className="profilePicture" />
                            <div className="about">
                                <span className="name">{recipientData.about.firstname} {recipientData.about.lastname}</span>
                                <span className="display">{recipientData.about.displayname}</span>
                                <span className="hover">Change</span>
                                <span className="icon-hover">Change</span>
                            </div>
                        </button>
                        <button type="submit" disabled={loading}>Pay!</button>
                    </>}
                    {recipient === "" && props.ids && <>
                        <span className="title">Who has passed go?</span>
                        <ul className="userList">
                            {props.ids.sort((a, b) => a.localeCompare(b)).map((player, index) => {
                                return <button key={index} onClick={() => setRecipient(player)} type="select">
                                    <Modal_Part_Player id={player} />
                                </button>
                            })}
                        </ul>
                    </>}
                </form>
            </div>
            <div className="modal-overlay" id="for-goPass" onClick={(e) => { e.preventDefault(); setRecipient(""); document.body.classList.remove("modal-goPass-visible") }} />
        </>}
    </>
}

function Modal_Part_Player(props) {
    const [player, setPlayer] = useState();

    useEffect(() => {
        if (props.id === undefined) return

        const promise = getUserInfo(props.id)

        promise.then(res => {
            setPlayer(res)
        })
    }, [props.id])

    return <>
        {player && <>
            <img src={player.images.photoURL} alt="" className="profilePicture" />
            <div className="about">
                <span className="name">{player.about.firstname} {player.about.lastname}</span>
                <span className="display">{player.about.displayname}</span>
            </div>
        </>}
    </>
}

function Modal_Part_Loading() {
    return <>
        <div className="loading">
            <span className="title">Loading</span>
            <div className="dot-flashing" />
        </div>
    </>
}