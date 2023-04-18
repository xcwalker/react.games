import { Fragment, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom";
import { db, createGame, useAuth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

import "../style/monopoly/index.css"
import "../style/monopoly/player.css"
import "../style/monopoly/properties.css"

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
    const [userData, setUserData] = useState();
    const [mode, setMode] = useState();

    useEffect(() => {
        if (!currentUser) return

        // const gamePromise = getGameInfo(params.gameID)

        const unsubscribe = onSnapshot(doc(db, "games", params.gameID), (doc) => {
            console.log("Current data: ", doc.data());

            setGameData(doc.data().data)
            setGameInfo(doc.data().info)
            setUserData(doc.data().userData[currentUser.uid])
            setCreatedDate(new Date(doc.data().info.dates.createdAt.toString()))
        });

        // gamePromise.then(res => {
        //     if (res === undefined) {
        //         setError({ code: 404, message: "Game Not Found" })
        //         return
        //     }

        //     console.log(res)

        //     setGameData(res.data)
        //     setGameInfo(res.info)
        //     setUserData(res.userData[currentUser.uid])
        //     setCreatedDate(new Date(res.info.dates.createdAt.toString()))
        // })

        return () => unsubscribe()
    }, [params.gameID, currentUser])

    return <>
        {error && <>
            Error: {error.code}
        </>}
        {currentUser && userData && !error && <>
            <section className="game" id="monopoly">
                {gameInfo.gameMaster === currentUser.uid && <div className="container" id="banker">

                </div>}
                {userData && <div className="container" id="player">
                    <div className="money">
                        <span className="title">Balance</span>
                        <span className="price">£{userData.money}</span>
                    </div>
                    <div className="properties">
                        <h2>Your Properties</h2>
                        {userData.properties && <ul>
                            {userData.properties.sort().map((item, index) => {
                                return <li key={index} className="property">
                                    {!properties[item].isStation && !properties[item].isUtility && <>
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
                                    </>}
                                </li>
                            })}
                        </ul>}
                    </div>
                </div>}
            </section>
        </>}
        {!currentUser && currentUser !== null && <>
            loading
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