import { createServer } from "http";
import express from "express";
import dotenv from 'dotenv';
import { WebSocketServer } from "ws";

dotenv.config();

const PORT = 4000;
const app = express();
app.use(express.json());
console.log("server");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND);
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

const clients = {};
const games = {};
const server = createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});

const webSocket = new WebSocketServer({ server });

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
                "clients": [],        
            }

            const payload = {
                "method": "create",
                "game": games[gameId]
            }

            const connect = clients[clientId].connection;
            connect.send(JSON.stringify(payload));
        }

        if (result.method === "join"){
            const clientId = result.clientId;
            const gameId = result.gameId;
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
