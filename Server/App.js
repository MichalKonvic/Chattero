const express = require('express');
const app = express();
const port = 3001;
const host = 'localhost';
app.use(express.static('APP'));
app.use(express.json({limit: '8mb'}));

//WebSocket
class user{
    constructor(ws='',username='',uID='') {
        this.webSocket = ws;
        this.Username = username;
        this.uID = uID;
    }
}
class users{
    #users = [];
    Join(add_ws,add_username,add_uID){
        //  user already connected check
        if(this.#users.some(arrUser => arrUser.uID == add_uID)){
            return false;
        }else{
            this.#users.push(new user(add_ws,add_username,add_uID));
            return true;
        }
    }
    Left(leave_ws){
        this.#users.filter(arrUser => {return arrUser.webSocket != leave_ws});
        return this.#users.length;
    }
    count(){
        return this.#users.length;
    }
}

class Room{
    #name;
    constructor(name='unnamed'){
        this.#name = name;
        this.users = new users();
    }
    isEmpty(){
        if (this.users.count() == 0) {
            return true;
        }else{
            return false;
        }
    }
}
function GenUID(preset="") {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    charset += preset;
    let UID = '';
    for (let UsernameChar = 0; UsernameChar < 32; UsernameChar++) {
        UID += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return UID;
}
const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server:server,port: 8080, path: "/connect"});
let Rooms = [];

wss.on('connection', (wsClient) => {
    wsClient.send(JSON.stringify({
        message:"Connection established!",
        code: 0,
        stage: 0
    }));
    wsClient.on('message', (msg) => {
        //Create room and response with json to open room on client side
    });
});

app.post('/Leave', (req, res, next) =>{
    const Username = req.body['Username'];
    const Channel = req.body['ChannelID'];
    try {
        res.json({
            Username: Username,
            ChannelID: Channel,
            message: "Request accepted!",
            code: 0,
            ClientAction: {
                AlertPop: ["Channel left!","",4000],
                PageTransform: [],
                ClearInputs: []
            },
            Error: false
        });
    } catch (errorthrw) {
        
    }
});
app.post('/Join', (req, res, next) => {
    const Username = req.body['Username'];
    const Channel = req.body['ChannelID'];
    //Data Check
    try {
        //if url pattern found (must be here bcs match could thow unwanted error)
        if(/^[a-zA-Z0-9_]*$/.test(Channel) == true){
            //If url pattern match != Channel
            if(Channel.match(/^[a-zA-Z0-9_]*$/) != Channel){
                throw {
                    message: "ChannelID does not satisfy ChannelID rules!",
                    code: 4,
                    type: "RuleBreakError",
                    ClientAction: {
                        AlertPop: ["Invalid Channel name!","",3000]
                    }
                };
            }
        }else{
            //pattern not found
            throw {
                message: "ChannelID does not satisfy ChannelID rules!",
                code: 4,
                type: "RuleBreakError",
                ClientAction: {
                    AlertPop: ["Invalid Channel name!","",3000]
                }
            };
        }
        //if pattern found
        if(Username == ''){
            throw {
                Username: Username,
                ChannelID: Channel,
                message: "Username does not satisfy Username rules!",
                code: 4,
                type: "RuleBreakError",
                ClientAction: {
                    AlertPop: ["Invalid Username!","",3000]
                }
            };
        }
        res.json({
            Username: Username,
            ChannelID: Channel,
            message: "Request accepted!",
            code: 0,
            ClientAction: {
                WSConnect: [`ws://${host}:8080/connect`]
            },
            Error: false
        });
    } catch (errorthrw) {
        res.json({
            Username: Username,
            ChannelID: Channel,
            Error: errorthrw
        });
    }
});

app.listen(port, () =>{
    console.log(`listening at http://localhost:${port}`)
});