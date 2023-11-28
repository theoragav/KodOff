import { createServer } from "http";
import express from "express";
import fetch from 'node-fetch';
import dotenv  from "dotenv";
import cors from 'cors';
import session from "express-session";
import { serialize } from "cookie";
import db from './db/connection.mjs'; 
import { WebSocketServer } from "ws";

dotenv.config();
const PORT = 4000;
const app = express();
app.use(express.json());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", process.env.FRONTEND);
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "*");
//     next();
// });

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
);

app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true
    })
  );
  
app.use(function (req, res, next) {
    const username = req.session.user ? req.session.user.username : "";
    req.username = (username)? username : null;
    res.setHeader('Set-Cookie', serialize('username', username, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});

const isAuthenticated = function (req, res, next) {
    if (!req.session.user) return res.status(401).end("access denied");
    next();
};

app.get('/', (req, res) => {
    if (!req.session.user) {
        return null;
    }
    return res.json(req.session.user);
});

app.post("/signUp/", async function(req, res, next){
    /* Get User Access Token from code given from Github */
    const code = req.body.code;
    getAccessToken(code)
    .then(data => {
        /* Get all User Data using that Access Token */
        if (data.access_token) {
            getUserData(data.access_token)
            .then(async userData => {
                /* Check if user is already registered */
                getUser(userData.login)
                .then(async user => {
                    if (user) {
                        console.log("User already registered, log in instead");
                        return res.status(409).end("username " + user.username + " is already registered");
                    }
                    /* Get specific user data and add to database since not registered yet */
                    addUser(userData)
                    .then(async result => {
                        console.log("User added");
                        // /* Create session and cookie for current signed up user */
                        getUserById(result.insertedId)
                        .then(user => {
                            req.session.user = user;
                            res.setHeader(
                                "Set-Cookie",
                                serialize("username", user.username, {
                                    path: "/",
                                    maxAge: 60 * 60 * 24 * 7,
                                }),
                            );
                            return res.json(user);
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            });
        }
    })
    .catch(error => {
        console.log(error);
        return res.status(500).end("Internal Server Error");
    });
})

app.post("/login/", async function(req, res, next){
    /* Get User Access Token from code given from Github */
    const code = req.body.code;
    getAccessToken(code)
    .then(data => {
        /* Get all User Data using that Access Token */
        if (data.access_token) {
            getUserData(data.access_token)
            .then(async userData => {
                /* Check if user exists */
                getUser(userData.login)
                .then(async user => {
                    if (user) {
                        /* Create session and cookie for current logged in user */
                        req.session.user = user;
                        res.setHeader(
                            "Set-Cookie",
                            serialize("username", user.username, {
                                path: "/",
                                maxAge: 60 * 60 * 24 * 7,
                            }),
                        );
                        console.log("User logged in");
                        return res.json(user);
                    }
                    else {
                        console.log("User not yet registered, sign up first");
                        return res.status(409).end("user not yet registered");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            });
        }
    })
    .catch(error => {
        console.log(error);
        return res.status(500).end("Internal Server Error");
    });
})

app.get("/logout/", function (req, res, next) {
    req.session.destroy();
    res.setHeader(
      "Set-Cookie",
      serialize("username", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
      }),
    );
    res.end();
});

app.get("/user/", (req, res) => {
    if (!req.session.user) {
        return res.json(null);
    }
    return res.json(req.session.user);
});

/* GitHub API Functions */
function getAccessToken(code) {
    const params = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;
    return new Promise(async function(resolve, reject){
        await fetch(`https://github.com/login/oauth/access_token${params}`, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            return resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}

function getUserData(accessToken) {
    return new Promise(async function(resolve, reject){
        await fetch(`https://api.github.com/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            return resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}

/* Database Queries */
function getUserById(id){
    return new Promise(async(resolve, reject) => {
        const user = await db.collection('users').findOne({ _id: id });
        if (!user) {
            return resolve(null);
        }
        if (user instanceof Error) {
            return reject(user);
        }
        return resolve(user);
    })
}

function getUser(username){
    return new Promise(async(resolve, reject) => {
        const user = await db.collection('users').findOne({ username: username });
        console.log(user);
        if (!user) {
            return resolve(null);
        }
        if (user instanceof Error) {
            return reject(user);
        }
        return resolve(user);
    })
}

function addUser(data) {
    return new Promise(async(resolve, reject) => {
        const body = { username: data.login, pfp: data.avatar_url, rank: 0, createdAt: Date.now() }                
        const user = await db.collection('users').insertOne(body); 
        if (user instanceof Error) {
            return reject(user);
        }
        return resolve(user);
    })
}

const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});  

/* WebSocket Game */
const clients = {};
const games = {};
const timers = {};

const webSocket = new WebSocketServer({ server });

function startTimer(gameId, durationInSeconds) {
    const endTime = Date.now() + durationInSeconds * 1000;

    // Update game state
    games[gameId].endTime = endTime;

    // Send an immediate timer update to clients
    sendTimeUpdateToClients(gameId, durationInSeconds * 1000);

    // Periodic updates
    const updateInterval = setInterval(() => {
        const remainingTime = Math.max(endTime - Date.now(), 0);
        sendTimeUpdateToClients(gameId, remainingTime);

        // End of timer
        if (remainingTime <= 0) {
            clearInterval(updateInterval);
            evaluateWinneronTimerEnd(gameId);
        }
    }, 950); // Update every second

    // Store the timer reference in the timers object
    timers[gameId] = { updateInterval };

}

// helpers 
function sendTimeUpdateToClients(gameId, remainingTime) {
    const payload = {
        "method": "timer",
        "timeLeft": remainingTime
    };
    games[gameId].clients.forEach(client => {
        clients[client.clientId].connection.send(JSON.stringify(payload));
    });
}

function evaluateWinneronTimerEnd(gameId) {
    const game = games[gameId];
    let winnerId = null;

    if (game.clients[0].submits > game.clients[1].submits) {
        winnerId = game.clients[0].clientId;
    } else if (game.clients[1].submits > game.clients[0].submits) {
        winnerId = game.clients[1].clientId;
    } else if (game.clients[1].submits === game.clients[0].submits){
        winnerId = "tie"
    }

    const payload = {
        "method": "end",
        "game": game,
        "winner": winnerId
    };

    game.clients.forEach(client => {
        clients[client.clientId].connection.send(JSON.stringify(payload));
    });

    // Clean up the game state
    delete games[gameId];
    // Clear the timer if necessary
    if (timers[gameId] && timers[gameId].updateInterval) {
        clearInterval(timers[gameId].updateInterval);
        delete timers[gameId];
    }
}

webSocket.on("connection", (ws, request) => {
    const clientId = guid();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');

    clients[clientId] = { "connection": ws };

    ws.on("open", () => console.log("opened!"));
    ws.on("close", () => console.log("closed!"));
    ws.on("message", (message) => {
        console.log("message");
        const result = JSON.parse(message);
        console.log(result);

        // user wants to create game
        if (result.method === "create"){
            const clientId = result.clientId;
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "clients": [{"clientId": clientId, "submits": 0}],        
            }

            const payload = {
                "method": "create",
                "game": games[gameId],
                "clientId": clientId
            }

            const connect = clients[clientId].connection;
            connect.send(JSON.stringify(payload));
        }

        if (result.method === "join"){
            const clientId = result.clientId;
            const gameId = result.gameId;

            // Check if the game ID is valid
            if (!games[gameId]) {
                // Handle invalid game ID (e.g., send an error message to the client)
                const errorPayload = {
                    "method": "error",
                    "message": "Invalid game ID"
                };
                clients[clientId].connection.send(JSON.stringify(errorPayload));
                return;
            }
            const game = games[gameId];

            // max num of players is 2
            if (game.clients && game.clients.length < 2){
                game.clients.push({"clientId": clientId, "submits": 0});

                const payLoad = {
                    "method": "join",
                    "game": game
                }
                // notify player that other player has joined
                game.clients.forEach(client => {
                    clients[client.clientId].connection.send(JSON.stringify(payLoad));
                });

                // If this is the second player joining, start the timer after notification
                if (game.clients.length === 2) {
                    // Start the game timer here
                    startTimer(gameId, 10); // Assuming a 10-second game for example
                }
            }
        }

        if (result.method === "submit"){
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game){
                const clientIndex = game.clients.findIndex(c => c.clientId === clientId);

                if (clientIndex !== -1){
                    game.clients[clientIndex].submits++;

                    if (game.clients[clientIndex].submits >= 3){
                        const payLoad = {
                            "method": "submit",
                            "game": game,
                            "winner": clientId
                        }
    
                        game.clients.forEach(client => {
                            clients[client.clientId].connection.send(JSON.stringify(payLoad));
                        });

                        // Clear the game timer
                        const gameTimer = timers[gameId]?.updateInterval;
                        if (gameTimer) {
                            clearInterval(gameTimer);
                            delete timers[gameId];
                        }
                        
                        delete games[gameId];
                    }
                }
            }
        }
    });

    // Send a message back to the client to confirm connection
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    };
    ws.send(JSON.stringify(payLoad));
});


// stack exchange randomized id
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();