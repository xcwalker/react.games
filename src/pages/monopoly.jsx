import { Fragment, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom";
import { db, createGame, useAuth, getUserInfo, getMultipleUsersInfo, game_pay, game_goPass, game_purpose_trade, game_confirm_trade, game_decline_trade, game_sale_purpose, game_sale_confirm, game_sale_decline, game_mortgage, game_unmortgage } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

import "../style/monopoly/index.css"
import "../style/monopoly/new.css"
import "../style/monopoly/banker.css"
import "../style/monopoly/player.css"
import "../style/monopoly/properties.css"
import "../style/monopoly/station.css"
import "../style/monopoly/modal/index.css"
import "../style/monopoly/modal/loading.css"
import "../style/monopoly/modal/pay.css"
import "../style/monopoly/modal/trade.css"
import "../style/monopoly/modal/trade-request.css"
import "../style/monopoly/modal/mortgage.css"
import "../style/monopoly/modal/unmortgage.css"
import "../style/monopoly/modal/goPass.css"
import "../style/monopoly/modal/property-sell.css"
import "../style/monopoly/modal/sale-request.css"
import "../style/monopoly/modal/qr.css"
import { Page_Loading } from "../components/page/page-loading";
import QRCode from "react-qr-code";

const properties = [{
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}]

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
    const [purposedTrades, setPurposedTrades] = useState([]);
    const [purposedSales, setPurposedSales] = useState([]);
    const [mode, setMode] = useState();

    useEffect(() => {
        if (!currentUser) return

        // const gamePromise = getGameInfo(params.gameID)

        const unsubscribe = onSnapshot(doc(db, "games", params.gameID), (doc) => {
            const data = doc.data()
            console.log("Current data: ", data);

            setGameData(data.data);
            setGameInfo(data.info);
            setUserData(data.userData[currentUser.uid]);
            setAllUserData(data.userData);
            setGamePlayers(Object.keys(data.userData));
            setUserProperties(data.userData[currentUser.uid].properties.sort((a, b) => a - b));
            setCreatedDate(new Date(data.info.dates.createdAt.toString()));
        });

        return () => {
            unsubscribe()
            setGameData();
            setGameInfo();
            setUserData();
            setAllUserData();
            setGamePlayers();
            setUserProperties();
            setCreatedDate();
        }
    }, [params.gameID, currentUser])

    useEffect(() => {
        console.log(gameData)
        if (!gameData || !gameData.transactions) return

        var trades = [];
        var sales = [];

        gameData.transactions.map((item, index) => {
            if (item.type === "trade" && item.users.to === currentUser.uid && item.status === "purposed") {
                trades.push(item)
                setPurposedTrades(trades)
                document.body.classList.add("modal-trade-request-visible")
            } else if (item.type === "sale" && item.users.to === currentUser.uid && item.status === "purposed") {
                sales.push(item)
                setPurposedSales(sales)
                console.log(sales)
                document.body.classList.add("modal-sale-request-visible")
            }
        })

        return () => {
            setPurposedTrades([])
            setPurposedSales([])
            document.body.classList.remove("modal-trade-request-visible")
            document.body.classList.remove("modal-sale-request-visible")
        }
    }, [gameData])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return <>
        {currentUser && userData && !error && <>
            <section className="game" id="monopoly">
                {gameInfo.gameMaster === currentUser.uid && <>
                    <div className="container" id="banker">
                        <h2>Banker's Controls</h2>
                        <ul>
                            <button type="control" onClick={() => { document.body.classList.add("modal-goPass-visible") }}>Pass Go</button>
                            <button type="control" onClick={() => { document.body.classList.add("modal-property-sell-visible") }}>Sell Property</button>
                            <button type="control" onClick={() => { document.body.classList.add("modal-qr-visible") }}>QR Code</button>
                        </ul>
                    </div>
                    <div className="separator" />
                </>}
                {userData && <div className="container" id="player">
                    <div className="money">
                        <h2>Balance</h2>
                        <span className="price">{formatter.format(userData.money)}</span>
                    </div>
                    <div className="controls">
                        <h2>Controls</h2>
                        <ul>
                            <button type="control" onClick={() => { document.body.classList.add("modal-pay-visible") }}>Pay</button>
                            <button type="control" onClick={() => { document.body.classList.add("modal-trade-visible") }}>Trade</button>
                            <button type="control" onClick={() => { document.body.classList.add("modal-mortgage-visible") }}>Mortgage</button>
                            <button type="control" onClick={() => { document.body.classList.add("modal-unmortgage-visible") }}>Unmortgage</button>
                        </ul>
                    </div>
                    <div className="properties">
                        <h2>Your Properties</h2>
                        {userProperties && userProperties.length === 0 && <div>You have no properties</div>}
                        {userProperties && userProperties.length > 0 && <ul>
                            {userProperties.map((item, index) => {
                                if (gameData.mortgages.includes(item)) {
                                    return <Fragment key={index}>
                                        {!properties[item].isStation && !properties[item].isUtility && <li className="property">
                                            <div className="top" style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                                <span className="title">Title Deed</span>
                                                <span className="name">{properties[item].name}</span>
                                            </div>
                                            <div className="bottom">
                                                <div className="mortgaged">
                                                    <span>Mortgaged</span>
                                                </div>
                                                <div className="costs">
                                                    <div className="mortgage">
                                                        <span>Mortgage Value </span>
                                                        <span className="price">£{properties[item].mortgage}</span>
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
                                                <div className="mortgaged">
                                                    <span>Mortgaged</span>
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
                                }

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
                    <Modal_QR />
                    {purposedTrades.length > 0 && <Modal_Trade_Purposed purposedTrades={purposedTrades} gameID={params.gameID} userData={allUserData} gameData={gameData} currentUser={currentUser} />}
                    {purposedSales.length > 0 && <Modal_Sale_Purposed purposedSales={purposedSales} gameID={params.gameID} userData={allUserData} gameData={gameData} currentUser={currentUser} />}
                    <Modal_Mortgage gameID={params.gameID} gameData={gameData} userData={allUserData} currentUser={currentUser} />
                    <Modal_Unmortgage gameID={params.gameID} gameData={gameData} userData={allUserData} currentUser={currentUser} />
                    <Modal_Gamemaster_GoPass ids={gamePlayers} gameID={params.gameID} userData={allUserData} gameData={gameData} gameInfo={gameInfo} currentUser={currentUser} />
                    <Modal_Gamemaster_PropertySell ids={gamePlayers} gameID={params.gameID} userData={allUserData} gameData={gameData} gameInfo={gameInfo} currentUser={currentUser} />
                </div>}
            </section>
        </>}
        {!currentUser && currentUser !== null && <>
            <Page_Loading />
        </>}
        {currentUser && !userData && <>
            User Not In Game
        </>}
        {error && <>
            Error: {error.code}
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
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([])
    const [addUser, setAddUser] = useState("")
    const [startingMoney, setStartingMoney] = useState(1500)
    const [goPass, setGoPass] = useState(200)
    const [startingValues, setStartingValues] = useState({
        money: startingMoney,
        properties: [],
        cards: [],
    })

    const newGame = async (e) => {
        e.preventDefault();

        var userData = {};

        userData[currentUser.uid] = startingValues;

        users.map(user => {
            userData[user] = startingValues;
        })

        const promise = createGame({
            mortgages: [],
            properties: [],
            transactions: [],
        }, userData, {}, {
            goPass: goPass,
        }, currentUser)

        promise.then(res => {
            setID(res.id)
        })

        promise.catch(err => {
            console.error(err)
            return
        })

        toast.promise(promise, {
            loading: 'Creating Game!',
            success: 'Game Created!',
            error: 'Game Error!',
        }, {
            id: "Monopoly-Create-Game",
            className: "toast-item",
            position: "bottom-center",
        });
    }

    return <>
        {ID && <Navigate to={"./" + ID} />}
        {currentUser && <>
            <section className="new-game" id="monopoly">
                <form className="container">
                    <h1>Monopoly</h1>
                    <h2>New Game</h2>
                    <ul className="players">
                        <div className="player">
                            <Modal_Part_Player id={currentUser.uid} />
                        </div>
                        {users.length > 0 && users.map((player, index) => {
                            return <button key={index} className="player" disabled={loading}>
                                <Modal_Part_Player id={player} />
                            </button>
                        })}
                    </ul>
                    <div className="input">
                        <input type="text" name="user-input" id="user-input" placeholder="User ID" onChange={(e) => { setAddUser(e.target.value) }} value={addUser} />
                        <button type="add" onClick={(e) => {
                            e.preventDefault();
                            setLoading(true)
                            const promise = getUserInfo(addUser)
                            toast.promise(promise, {
                                loading: 'Checking User!',
                                success: 'User Added!',
                                error: 'Error Adding User!',
                            }, {
                                id: "Monopoly-Create-Game",
                                className: "toast-item",
                                position: "bottom-center",
                            });
                            promise.then(res => {
                                var arr = users;
                                arr.push(addUser)
                                setUsers(arr)
                                setAddUser("")
                                setLoading(false)
                                return
                            })
                            promise.catch(res => {
                                setLoading(false)
                                return
                            })
                        }}>
                            <span className="material-symbols-outlined">
                                add
                            </span>
                        </button>
                    </div>
                    <div className="side-by-side">
                        <div className="side">
                            <label htmlFor="starting-cash">Starting Cash</label>
                            <input type="number" name="starting-cash" id="starting-cash" value={startingMoney} onChange={(e) => { e.preventDefault(); setStartingMoney(e.target.value) }} />
                        </div>
                        <div className="side">
                            <label htmlFor="pass-go">Pass Go</label>
                            <input type="number" name="pass-go" id="pass-go" value={goPass} onChange={(e) => { e.preventDefault(); setGoPass(e.target.value) }} />
                        </div>
                    </div>
                    <button type="submit" onClick={newGame}>Create Game!</button>
                </form>
            </section>
        </>}
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

        promise.catch(err => {
            console.error(err)
            return
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
            setRecipient("")
            setAmount(0)
            document.body.classList.remove("modal-pay-visible")
            return
        })

        promise.catch(err => {
            console.error(err)
            return
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
    const [recipient, setRecipient] = useState("")
    const [recipientData, setRecipientData] = useState()
    const [currentUserData, setCurrentUserData] = useState()
    const [fromPayingUserAmount, setFromPayingUserAmount] = useState(0)
    const [fromReceivingUserAmount, setFromReceivingUserAmount] = useState(0)
    const [fromPayingUserProperties, setFromPayingUserProperties] = useState([])
    const [fromReceivingUserProperties, setFromReceivingUserProperties] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    useEffect(() => {
        if (recipient === "") return

        setLoadingData(true)
        const promise = getUserInfo(recipient)

        promise.then(res => {
            setRecipientData(res)
            setLoadingData(false)
        })

        promise.catch(err => {
            console.error(err)
            return
        })

        return () => {
            setRecipientData("")
        }
    }, [recipient])

    useEffect(() => {
        if (!props.currentUser) return

        setLoadingData(true)
        const promise = getUserInfo(props.currentUser.uid)

        promise.then(res => {
            setCurrentUserData(res)
            setLoadingData(false)
        })

        promise.catch(err => {
            console.error(err)
            return
        })

        return () => {
            setCurrentUserData("")
        }
    }, [props.currentUser])

    const handlePropertyAdd = (propertyID, from) => {
        if (from === "receiving") {
            if (fromReceivingUserProperties.includes(propertyID)) {
                const index = fromReceivingUserProperties.indexOf(propertyID);
                if (index > -1) { // only splice array when item is found
                    fromReceivingUserProperties.splice(index, 1); // 2nd parameter means remove one item only
                    document.querySelector("#receiving-property-" + propertyID).classList.remove("selected")
                }
            } else if (!fromReceivingUserProperties.includes(propertyID)) {
                fromReceivingUserProperties.push(propertyID)
                document.querySelector("#receiving-property-" + propertyID).classList.add("selected")
            }
        }


        if (from === "paying") {
            if (fromPayingUserProperties.includes(propertyID)) {
                const index = fromPayingUserProperties.indexOf(propertyID);
                if (index > -1) { // only splice array when item is found
                    fromPayingUserProperties.splice(index, 1); // 2nd parameter means remove one item only
                    document.querySelector("#paying-property-" + propertyID).classList.remove("selected")
                }
            } else if (!fromPayingUserProperties.includes(propertyID)) {
                fromPayingUserProperties.push(propertyID)
                document.querySelector("#paying-property-" + propertyID).classList.add("selected")
            }
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const promise = game_purpose_trade(props.gameID, props.gameData, props.currentUser.uid, recipient, {
            amount: fromPayingUserAmount,
            properties: fromPayingUserProperties,
        }, {
            amount: fromReceivingUserAmount,
            properties: fromReceivingUserProperties,
        }, setLoading)

        toast.promise(promise, {
            loading: 'Sending Proposal!',
            success: 'Proposal Sent!',
            error: 'Proposal Error!',
        }, {
            id: "Monopoly-Proposal-Send",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            handleClose()
            return
        })

        promise.catch(err => {
            console.error(err)
            return
        })
    }

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
        }
        setRecipient("");
        setFromPayingUserAmount(0)
        setFromReceivingUserAmount(0)
        setFromPayingUserProperties([])
        setFromReceivingUserProperties([])
        document.body.classList.remove("modal-trade-visible")
    }

    return <>
        <div className="modal" id="trade">
            <form className="container" onSubmit={handleSubmit}>
                <button type="cancel" onClick={handleClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                {recipient !== "" && !recipientData && loadingData && <>
                    <Modal_Part_Loading />
                </>}
                {recipientData && currentUserData && recipient && <>
                    <span className="title">And what are you trading?</span>
                    <div className="side-by-side">
                        <div className="paying-user">
                            <div className="recipient">
                                <img src={currentUserData.images.photoURL} alt="" className="profilePicture" />
                                <div className="about">
                                    <span className="name">{currentUserData.about.firstname} {currentUserData.about.lastname}</span>
                                    <span className="display">{currentUserData.about.displayname}</span>
                                </div>
                            </div>
                            <input type="number" step={1} onChange={(e) => { setFromPayingUserAmount(e.target.value) }} value={fromPayingUserAmount} required min={0} max={props.userData[props.currentUser.uid].money} placeholder="100" />
                            <ul className="properties">
                                {props.userData[props.currentUser.uid].properties && props.userData[props.currentUser.uid].properties.sort((a, b) => a - b).map((item, index) => {
                                    return <button key={index} type="select" onClick={(e) => { e.preventDefault(); handlePropertyAdd(item, "paying") }} id={"paying-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                        <span className="title">
                                            {properties[item].isStation && <>Station</>}
                                            {properties[item].isUtility && <>Utility</>}
                                            {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                            <> £{properties[item].price}</>
                                        </span>
                                        <span className="name">{properties[item].name}</span>
                                    </button>
                                })}
                            </ul>
                        </div>
                        <div className="receiving-user">
                            <button className="recipient" onClick={(e) => { e.preventDefault(); setRecipient(""); setAmount() }}>
                                <img src={recipientData.images.photoURL} alt="" className="profilePicture" />
                                <div className="about">
                                    <span className="name">{recipientData.about.firstname} {recipientData.about.lastname}</span>
                                    <span className="display">{recipientData.about.displayname}</span>
                                    <span className="hover">Change</span>
                                    <span className="icon-hover">Change</span>
                                </div>
                            </button>
                            <input type="number" step={1} onChange={(e) => { setFromReceivingUserAmount(e.target.value) }} value={fromReceivingUserAmount} required min={0} max={props.userData[recipient].money} placeholder="100" />
                            <ul className="properties">
                                {props.userData[recipient].properties && props.userData[recipient].properties.sort((a, b) => a - b).map((item, index) => {
                                    return <button key={index} type="select" onClick={(e) => { e.preventDefault(); handlePropertyAdd(item, "receiving") }} id={"receiving-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                        <span className="title">
                                            {properties[item].isStation && <>Station</>}
                                            {properties[item].isUtility && <>Utility</>}
                                            {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                            <> £{properties[item].price}</>
                                        </span>
                                        <span className="name">{properties[item].name}</span>
                                    </button>
                                })}
                            </ul>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>Purpose Trade!</button>
                </>}
                {recipient === "" && props.ids && <>
                    <span className="title">Who are you trading with?</span>
                    <ul className="userList">
                        {props.ids.sort((a, b) => a.localeCompare(b)).map((player, index) => {
                            if (player === props.currentUser.uid) return <Fragment key={index} />
                            return <button key={index} onClick={(e) => { e.preventDefault(); setRecipient(player) }} type="select">
                                <Modal_Part_Player id={player} />
                            </button>
                        })}
                    </ul>
                </>}
            </form>
        </div >
        <div className="modal-overlay" id="for-trade" onClick={handleClose} />
    </>
}

function Modal_Trade_Purposed(props) {
    const [trade, setTrade] = useState();
    const [recipientData, setRecipientData] = useState()
    const [payingUserData, setCurrentUserData] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    useEffect(() => {
        console.log(props.purposedTrades, props.purposedTrades[0])
        setTrade(props.purposedTrades[0])

        return () => { setTrade() }
    }, [props.purposedTrades])

    useEffect(() => {
        if (!trade || trade.users.to === "") return

        setLoadingData(true)
        const promise = getUserInfo(trade.users.to)

        promise.then(res => {
            setRecipientData(res)
            setLoadingData(false)
        })

        promise.catch(err => {
            console.error(err)
            return
        })

        return () => {
            setRecipientData("")
        }
    }, [trade])

    useEffect(() => {
        if (!trade || !trade.users.from) return

        setLoadingData(true)
        const promise = getUserInfo(trade.users.from)

        promise.then(res => {
            setCurrentUserData(res)
            setLoadingData(false)
        })

        promise.catch(err => {
            console.error(err)
            return
        })

        return () => {
            setCurrentUserData("")
        }
    }, [trade])

    const handleAccept = (e) => {
        e.preventDefault();

        const promise = game_confirm_trade(props.gameID, props.userData, props.gameData, trade, setLoading);

        promise.catch(err => {
            console.error(err)
            return
        })

        promise.then(res => {
            handleClose()
            return
        })

        toast.promise(promise, {
            loading: 'Accepting Trade!',
            success: 'Trade Complete!',
            error: 'Trade Error!',
        }, {
            id: "Monopoly-Proposal-Accept",
            className: "toast-item",
            position: "bottom-center",
        });
    }

    const handleDecline = (e) => {
        e.preventDefault();

        const promise = game_decline_trade(props.gameID, props.gameData, trade, setLoading);

        promise.catch(err => {
            console.error(err)
            return
        })

        promise.then(res => {
            handleClose()
            return
        })

        toast.promise(promise, {
            loading: 'Declining Trade!',
            success: 'Trade Declined!',
            error: 'Trade Error!',
        }, {
            id: "Monopoly-Proposal-Decline",
            className: "toast-item",
            position: "bottom-center",
        });
    }

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
        }
    }

    return <>
        <div className="modal" id="trade-request" >
            <form className="container">
                <button type="cancel" onClick={handleDecline} tabIndex={2}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                {!recipientData && loadingData && <>
                    <Modal_Part_Loading />
                </>}
                {recipientData && payingUserData && <>
                    <span className="title">Trade Request</span>
                    <div className="side-by-side">
                        <div className="paying-user">
                            <div className="recipient">
                                <img src={payingUserData.images.photoURL} alt="" className="profilePicture" />
                                <div className="about">
                                    <span className="name">{payingUserData.about.firstname} {payingUserData.about.lastname}</span>
                                    <span className="display">{payingUserData.about.displayname}</span>
                                </div>
                            </div>
                            <input type="number" readOnly value={trade.trade.paying.amount} tabIndex={-1} />
                            <ul className="properties">
                                {trade.trade.paying.properties && trade.trade.paying.properties.sort((a, b) => a - b).map((item, index) => {
                                    return <div key={index} className="item" id={"paying-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                        <span className="title">
                                            {properties[item].isStation && <>Station</>}
                                            {properties[item].isUtility && <>Utility</>}
                                            {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                        </span>
                                        <span className="name">{properties[item].name}</span>
                                    </div>
                                })}
                            </ul>
                        </div>
                        <div className="receiving-user">
                            <div className="recipient">
                                <img src={recipientData.images.photoURL} alt="" className="profilePicture" />
                                <div className="about">
                                    <span className="name">{recipientData.about.firstname} {recipientData.about.lastname}</span>
                                    <span className="display">{recipientData.about.displayname}</span>
                                </div>
                            </div>
                            <input type="number" readOnly value={trade.trade.receiving.amount} tabIndex={-1} />
                            <ul className="properties">
                                {trade.trade.receiving.properties && trade.trade.receiving.properties.sort((a, b) => a - b).map((item, index) => {
                                    return <div key={index} className="item" id={"receiving-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }}>
                                        <span className="title">
                                            {properties[item].isStation && <>Station</>}
                                            {properties[item].isUtility && <>Utility</>}
                                            {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                        </span>
                                        <span className="name">{properties[item].name}</span>
                                    </div>
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="side-by-side">
                        <button type="decline" disabled={loading} tabIndex={1} onClick={handleDecline}>Decline</button>
                        <button type="accept" disabled={loading} tabIndex={1} onClick={handleAccept}>Accept</button>
                    </div>
                </>}
            </form>
        </div>
        <div className="modal-overlay" id="for-trade-request" onClick={handleDecline} />
    </>
}

function Modal_Sale_Purposed(props) {
    const [sale, setSale] = useState();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(props.purposedSales, props.purposedSales[0])
        setSale(props.purposedSales[0])

        return () => { setSale() }
    }, [props.purposedSales])

    const handleAccept = (e) => {
        e.preventDefault();

        const promise = game_sale_confirm(props.gameID, props.userData, props.gameData, sale, setLoading);

        promise.catch(err => {
            console.error(err)
            return
        })

        promise.then(res => {
            handleClose()
            return
        })

        toast.promise(promise, {
            loading: 'Accepting Sale!',
            success: 'Sale Complete!',
            error: 'Sale Error!',
        }, {
            id: "Monopoly-Sale-Accept",
            className: "toast-item",
            position: "bottom-center",
        });
    }

    const handleDecline = (e) => {
        e.preventDefault();

        const promise = game_sale_decline(props.gameID, props.gameData, sale, setLoading);

        promise.catch(err => {
            console.error(err)
            return
        })

        promise.then(res => {
            handleClose()
            return
        })

        toast.promise(promise, {
            loading: 'Declining Sale!',
            success: 'Sale Declined!',
            error: 'Sale Error!',
        }, {
            id: "Monopoly-Sale-Decline",
            className: "toast-item",
            position: "bottom-center",
        });
    }

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
        }
        console.log(props.purposedSales)
        if (props.purposedSales[0] === undefined) {
            document.body.classList.remove("modal-sale-request-visible")
        }
    }

    return <>
        <div className="modal" id="sale-request" >
            <form className="container">
                <button type="cancel" onClick={handleDecline} tabIndex={2}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                {sale && <>
                    <span className="title">Buy Property?</span>
                    {sale.sale.property && <div className="selected-property" style={{ "--background-color": properties[sale.sale.property].color, "--foreground-color": properties[sale.sale.property].colorText }}>
                        <span className="title">
                            {properties[sale.sale.property].isStation && <>Station</>}
                            {properties[sale.sale.property].isUtility && <>Utility</>}
                            {!properties[sale.sale.property].isUtility && !properties[sale.sale.property].isStation && <>Title Deed</>}
                        </span>
                        <span className="name">{properties[sale.sale.property].name}</span>
                    </div>}
                    <input type="number" readOnly value={sale.sale.amount} tabIndex={-1} />
                    <div className="side-by-side">
                        <button type="decline" disabled={loading} tabIndex={1} onClick={handleDecline}>Decline</button>
                        <button type="accept" disabled={loading} tabIndex={1} onClick={handleAccept}>Accept</button>
                    </div>
                </>}
            </form>
        </div>
        <div className="modal-overlay" id="for-sale-request" onClick={handleDecline} />
    </>
}

function Modal_Mortgage(props) {
    const [property, setProperty] = useState()
    const [state, setState] = useState(0)
    const [loading, setLoading] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault();

        const promise = game_mortgage(props.gameID, props.gameData, props.userData, props.currentUser.uid, property, properties[property], setLoading)

        toast.promise(promise, {
            loading: 'Sending Proposal!',
            success: 'Proposal Sent!',
            error: 'Proposal Error!',
        }, {
            id: "Monopoly-Proposal-Send",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            handleClose()
            return
        })

        promise.catch(err => {
            console.error(err)
            return
        })
    }

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
        }
        setProperty();
        document.body.classList.remove("modal-mortgage-visible")
    }

    return <>
        <div className="modal" id="mortgage">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <button type="cancel" onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {property && state === 1 && <>
                        <span className="title">Confirm?</span>
                        {property && <button className="selected-property" style={{ "--background-color": properties[property].color, "--foreground-color": properties[property].colorText }} onClick={(e) => { e.preventDefault(); setState(0) }}>
                            <span className="title">
                                {properties[property].isStation && <>Station</>}
                                {properties[property].isUtility && <>Utility</>}
                                {!properties[property].isUtility && !properties[property].isStation && <>Title Deed</>}
                            </span>
                            <span className="name">{properties[property].name}</span>
                        </button>}
                        <input type="number" readOnly value={properties[property].mortgage} tabIndex={-1} />
                        <button type="submit" disabled={loading}>Mortgage</button>
                    </>}
                    {state === 0 && <>
                        <span className="title">What property is being mortgaged?</span>
                        <ul className="properties">
                            {props.userData && props.userData[props.currentUser.uid].properties.sort((a, b) => a - b).map((item, index) => {
                                if (props.gameData.mortgages !== undefined && props.gameData.mortgages.includes(item)) {
                                    return <Fragment key={index} />
                                }

                                if (item === property) {
                                    return <button key={index} className="item selected" id={"mortgage-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }} onClick={async (e) => {
                                        e.preventDefault();
                                        if (property) {
                                            console.log("#mortgage-property-" + property)
                                            document.querySelector("#mortgage-property-" + property).classList.remove("selected");
                                        }
                                        setProperty(item);
                                        console.log("#mortgage-property-" + item)
                                        document.querySelector("#mortgage-property-" + item).classList.add("selected")
                                    }}>
                                        <span className="title">
                                            {properties[item].isStation && <>Station</>}
                                            {properties[item].isUtility && <>Utility</>}
                                            {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                        </span>
                                        <span className="name">{properties[item].name}</span>
                                    </button>
                                }

                                return <button key={index} className="item" id={"mortgage-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }} onClick={async (e) => {
                                    e.preventDefault();
                                    if (property) {
                                        console.log("#mortgage-property-" + property)
                                        document.querySelector("#mortgage-property-" + property).classList.remove("selected");
                                    }
                                    setProperty(item);
                                    console.log("#mortgage-property-" + item)
                                    document.querySelector("#mortgage-property-" + item).classList.add("selected")
                                }}>
                                    <span className="title">
                                        {properties[item].isStation && <>Station</>}
                                        {properties[item].isUtility && <>Utility</>}
                                        {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                    </span>
                                    <span className="name">{properties[item].name}</span>
                                </button>
                            })}
                        </ul>
                        <button type="continue" disabled={!property} onClick={(e) => { e.preventDefault(); setState(1) }}>Continue</button>
                    </>}
                </form>
            </div>
        </div>
        <div className="modal-overlay" id="for-mortgage" onClick={handleClose} />
    </>
}

function Modal_Unmortgage(props) {
    const [property, setProperty] = useState()
    const [state, setState] = useState(0)
    const [loading, setLoading] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault();

        const promise = game_unmortgage(props.gameID, props.gameData, props.userData, props.currentUser.uid, property, properties[property], setLoading)

        toast.promise(promise, {
            loading: 'Sending Proposal!',
            success: 'Proposal Sent!',
            error: 'Proposal Error!',
        }, {
            id: "Monopoly-Proposal-Send",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            handleClose()
            return
        })

        promise.catch(err => {
            console.error(err)
            return
        })
    }

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
        }
        setProperty();
        setState(0)
        document.body.classList.remove("modal-unmortgage-visible")
    }

    return <>
        <div className="modal" id="unmortgage">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <button type="cancel" onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {property && state === 1 && <>
                        <span className="title">Confirm?</span>
                        {property && <button className="selected-property" style={{ "--background-color": properties[property].color, "--foreground-color": properties[property].colorText }} onClick={(e) => { e.preventDefault(); setState(0) }}>
                            <span className="title">
                                {properties[property].isStation && <>Station</>}
                                {properties[property].isUtility && <>Utility</>}
                                {!properties[property].isUtility && !properties[property].isStation && <>Title Deed</>}
                            </span>
                            <span className="name">{properties[property].name}</span>
                        </button>}
                        <input type="number" readOnly value={properties[property].mortgage} tabIndex={-1} />
                        <button type="submit" disabled={loading}>Unmortgage</button>
                    </>}
                    {state === 0 && <>
                        <span className="title">What property is being unmortgaged?</span>
                        <ul className="properties">
                            {props.userData && props.userData[props.currentUser.uid].properties.sort((a, b) => a - b).map((item, index) => {
                                if (props.gameData.mortgages !== undefined && props.gameData.mortgages.includes(item)) {
                                    if (item === property) {
                                        return <button key={index} className="item selected" id={"unmortgage-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }} onClick={async (e) => {
                                            e.preventDefault();
                                            if (property) {
                                                console.log("#unmortgage-property-" + property)
                                                document.querySelector("#unmortgage-property-" + property).classList.remove("selected");
                                            }
                                            setProperty(item);
                                            console.log("#unmortgage-property-" + item)
                                            document.querySelector("#unmortgage-property-" + item).classList.add("selected")
                                        }}>
                                            <span className="title">
                                                {properties[item].isStation && <>Station</>}
                                                {properties[item].isUtility && <>Utility</>}
                                                {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                            </span>
                                            <span className="name">{properties[item].name}</span>
                                        </button>
                                    }

                                    return <button key={index} className="item" id={"unmortgage-property-" + item} style={{ "--background-color": properties[item].color, "--foreground-color": properties[item].colorText }} onClick={async (e) => {
                                        e.preventDefault();
                                        if (property) {
                                            console.log("#unmortgage-property-" + property)
                                            document.querySelector("#unmortgage-property-" + property).classList.remove("selected");
                                        }
                                        setProperty(item);
                                        console.log("#unmortgage-property-" + item)
                                        document.querySelector("#unmortgage-property-" + item).classList.add("selected")
                                    }}>
                                        <span className="title">
                                            {properties[item].isStation && <>Station</>}
                                            {properties[item].isUtility && <>Utility</>}
                                            {!properties[item].isUtility && !properties[item].isStation && <>Title Deed</>}
                                        </span>
                                        <span className="name">{properties[item].name}</span>
                                    </button>
                                }

                                return <Fragment key={index} />
                            })}
                        </ul>
                        <button type="continue" disabled={!property} onClick={(e) => { e.preventDefault(); setState(1) }}>Continue</button>
                    </>}
                </form>
            </div>
        </div>
        <div className="modal-overlay" id="for-unmortgage" onClick={handleClose} />
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

        promise.catch(err => {
            console.error(err)
            return
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
            error: 'Transaction Error!',
        }, {
            id: "Monopoly-Pay",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            setRecipient("")
            document.body.classList.remove("modal-goPass-visible")
            return
        })

        promise.catch(err => {
            console.error(err)
            return
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

function Modal_Gamemaster_PropertySell(props) {
    const [recipient, setRecipient] = useState("")
    const [recipientData, setRecipientData] = useState()
    const [property, setProperty] = useState()
    const [amount, setAmount] = useState()
    const [state, setState] = useState(0)
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

        promise.catch(err => {
            console.error(err)
            return
        })

        return () => {
            setRecipientData("")
        }
    }, [recipient])

    useEffect(() => {
        if (!property) {
            setAmount()
            return
        }

        setAmount(properties[property].price);
    }, [property])

    const handleSubmit = (e) => {
        e.preventDefault();

        const promise = game_sale_purpose(props.gameID, props.gameData, recipient, {
            amount: amount,
            property: property,
        }, setLoading);

        toast.promise(promise, {
            loading: 'Confirming Transaction!',
            success: 'Transaction Complete!',
            error: 'Transaction Error!',
        }, {
            id: "Monopoly-Pay",
            className: "toast-item",
            position: "bottom-center",
        });

        promise.then(res => {
            handleClose()
            return
        })

        promise.catch(err => {
            console.error(err)
            return
        })
    }

    const handleClose = (e) => {
        if (e) { e.preventDefault(); }

        setRecipient("");
        setProperty();
        setState(0);
        setAmount()

        document.body.classList.remove("modal-property-sell-visible")
        return
    }

    return <>
        {props.currentUser.uid === props.gameInfo.gameMaster && <>
            <div className="modal" id="property-sell">
                <form className="container" onSubmit={handleSubmit}>
                    <button type="cancel" tabIndex={2} onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {recipient !== "" && !recipientData && loadingData && <>
                        <Modal_Part_Loading />
                    </>}
                    {recipientData && property && state === 1 && <>
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
                        <button className="selected-property" id={"property-" + property} style={{ "--background-color": properties[property].color, "--foreground-color": properties[property].colorText }} onClick={(e) => {
                            e.preventDefault();
                            setState(0)
                        }}>
                            <span className="title">
                                {properties[property].isStation && <>Station</>}
                                {properties[property].isUtility && <>Utility</>}
                                {!properties[property].isUtility && !properties[property].isStation && <>Title Deed</>}
                            </span>
                            <span className="name">{properties[property].name}</span>
                            <span className="hover">Change</span>
                            <span className="icon-hover">Change</span>
                        </button>
                        <input type="number" step={1} onChange={(e) => { e.preventDefault(); setAmount(e.target.value) }} value={amount} required min={1} max={props.userData[props.currentUser.uid].money} placeholder="100" />
                        <button type="submit" disabled={loading}>Sell</button>
                    </>}
                    {recipientData && state === 0 && <>
                        <span className="title">Which property?</span>
                        <ul className="properties">
                            {properties && properties.sort((a, b) => a - b).map((item, index) => {
                                if (props.gameData.properties.includes(index)) {
                                    return <Fragment key={index} />
                                }
                                if (index === property) {
                                    return <button key={index} className="item selected" id={"property-" + index} style={{ "--background-color": item.color, "--foreground-color": item.colorText }} onClick={async (e) => {
                                        e.preventDefault();
                                        if (property) {
                                            document.querySelector("#property-" + property).classList.remove("selected");
                                        }
                                        setProperty(index);
                                        document.querySelector("#property-" + index).classList.add("selected")
                                    }}>
                                        <span className="title">
                                            {item.isStation && <>Station</>}
                                            {item.isUtility && <>Utility</>}
                                            {!item.isUtility && !item.isStation && <>Title Deed</>}
                                        </span>
                                        <span className="name">{item.name}</span>
                                    </button>
                                }

                                return <button key={index} className="item" id={"property-" + index} style={{ "--background-color": item.color, "--foreground-color": item.colorText }} onClick={async (e) => {
                                    e.preventDefault();
                                    if (property) {
                                        document.querySelector("#property-" + property).classList.remove("selected");
                                    }
                                    setProperty(index);
                                    document.querySelector("#property-" + index).classList.add("selected")
                                }}>
                                    <span className="title">
                                        {item.isStation && <>Station</>}
                                        {item.isUtility && <>Utility</>}
                                        {!item.isUtility && !item.isStation && <>Title Deed</>}
                                    </span>
                                    <span className="name">{item.name}</span>
                                </button>
                            })}
                        </ul>
                        <button type="continue" disabled={!property} onClick={(e) => { e.preventDefault(); setState(1) }}>Continue</button>
                    </>}
                    {recipient === "" && props.ids && <>
                        <span className="title">Who's buying the property?</span>
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
            <div className="modal-overlay" id="for-property-sell" onClick={handleClose} />
        </>}
    </>
}

function Modal_QR(props) {
    const params = useParams();

    return <>
        <div className="modal" id="qr">
            <div className="container">
                <button type="cancel" onClick={(e) => { e.preventDefault(); document.body.classList.remove("modal-qr-visible") }}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div className="side-by-side">
                    <div className="side">
                        <QRCode value={"https://reactgames.xcwalker.dev/monopoly/" + params.gameID} bgColor="var(--background-color-200)" fgColor="var(--foreground-color-200)" />
                    </div>
                    <div className="side">
                        <div className="gamecode">
                            <span className="subTitle">Gamecode</span>
                            <div className="overflow">
                                <span className="code">{params.gameID}</span>
                            </div>
                            <button type="copy" onClick={(e) => {
                                e.preventDefault(); navigator.clipboard.writeText(params.gameID); toast.success("Gamecode written to clipboard", {
                                    id: "Monopoly-QR-Code-Copy",
                                    className: "toast-item",
                                    position: "bottom-center",
                                })
                            }}>
                                <span className="material-symbols-outlined">
                                    content_copy
                                </span>
                            </button>
                        </div>
                        <div className="url">
                            <span className="subTitle">URL</span>
                            <div className="overflow">
                                <span className="url">https://reactgames.xcwalker.dev/monopoly/{params.gameID}</span>
                            </div>
                            <button type="copy" onClick={(e) => {
                                e.preventDefault(); navigator.clipboard.writeText("https://reactgames.xcwalker.dev/monopoly/" + params.gameID); toast.success("URL written to clipboard", {
                                    id: "Monopoly-QR-URL-Copy",
                                    className: "toast-item",
                                    position: "bottom-center",
                                })
                            }}>
                                <span className="material-symbols-outlined">
                                    content_copy
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-overlay" id="for-qr" onClick={(e) => { e.preventDefault(); document.body.classList.remove("modal-qr-visible") }} />
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