const express = require('express');
const app = express();
const port = 3001;
let host = 'localhost';
app.use(express.static('APP'));
app.use(express.json({limit: '8mb'}));

//WebSocket
class user{
    constructor(ws='',username='',uID='') {
        this.webSocket = ws;
        this.Username = username;
    }
}

class users{
    users = [];
    Exist(check_ws,check_Username){
        if(check_ws !== undefined){
            return this.users.some(arrUser => arrUser.webSocket == check_ws);
        }else if(check_Username !== undefined){
            return this.users.some(arrUser => arrUser.Username == check_Username);
        }
    }
    Join(add_ws,add_username){
        //  user already connected check
        if(this.users.some(arrUser => arrUser.webSocket == add_ws)){
            return false;
        }else{
            this.users.push(new user(add_ws,add_username));
            return true;
        }
    }
    Leave(leave_ws){
        this.users = this.users.filter(arrUser => {return arrUser.webSocket != leave_ws});
        return this.Count();
    }
    Count(){
        return this.users.length;
    }
    findUsername(userWebSocket){
        if (this.Exist(userWebSocket)) {
            return this.users.filter(arrUser => {return arrUser.webSocket == userWebSocket })[0].Username;
        }
    }
    findWebSocket(userUsername){
        if (this.Exist(userUsername)) {
            return this.users.filter(arrUser => {return arrUser.Username == userUsername })[0].webSocket;
        }
    }
}

class Room{
    name;
    constructor(name='unnamed'){
        this.name = name;
        this.users = new users();
    }
    isEmpty(){
        if (this.users.Count() == 0) {
            return true;
        }else{
            return false;
        }
    }
}

class RoomsManager{
    Rooms = [];
    Exist(RoomName){
        ///Returns if Room exist. true/false
        return this.Rooms.some(room => room.name == RoomName);
    }
    Create(RoomName){
        ///Returns true for created, false for not created
        if (this.Exist(RoomName)) {
            return false;
        }else{
            this.Rooms.push(new Room(RoomName));
            return true;
        }
    }
    Delete(RoomName){
        ///Returns NEW rooms count
        this.Rooms = this.Rooms.filter(room => {return room.name != RoomName});
        return this.Rooms.length;
    }
    Count(){
        ///Returns rooms count
        return this.Rooms.length;
    }
    RoomIndex(RoomName){
        ///Returns 0-infinity or -1 if does not exist
        return this.Rooms.findIndex(room => {return room.name == RoomName});
    }
    RoomName(RoomIndex){
        try {
            return this.Rooms[RoomIndex].name;
        } catch (error) {
            return -1;
        }
    }
}

const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server:server,port: 8080, path: "/connect"});
let Channels = new RoomsManager();
console.log(`wss at: ${host}:8080`);

function RoomCheck() {
    if(Channels.Rooms.findIndex(room => {return room.isEmpty()}) != -1){
        Channels.Delete(Channels.RoomName(Channels.Rooms.findIndex(room => {return room.isEmpty()})));
        console.log("Deleted");
    }
}

wss.on('connection', (wsClient) => {
    wsClient.isAlive = true;
    wsClient.on('pong',() => wsClient.isAlive = true);
    wsClient.send(JSON.stringify({
        message:"Connection established!",
        code: 0,
        stage: 0
    }));
    wsClient.on('message', (msg) => {
        let msgObj;
        try {
            msgObj = JSON.parse(msg);
        } catch (error) {
            wsClient.send(JSON.stringify({
                message:"Error occured while reading request!",
                type: "RequestError",
                code: -1,
                stage: 3
            }));
        }
        if (msgObj.stage == 0) {
            const Username = msgObj.Username.toString();
            const Channel = msgObj.ChannelID.toString();
            try {
                //Room creation
                if (Channels.Exist(Channel) == false) {
                    Channels.Create(Channel);
                }
                //Room Join
                Channels.Rooms[Channels.RoomIndex(Channel)].users.Join(wsClient,Username);
                wsClient.send(JSON.stringify({
                    message: "Channel accepted!",
                    stage: 1,
                    code: 0
                }))
            } catch (error) {
                console.error("Error occured while creating room!\nError: ",error);
                wsClient.send(JSON.stringify({
                    message:"Error occured while creating room!",
                    type: "RoomCreateError",
                    code: -1,
                    stage: 3
                }));
            }
        }else if(msgObj.stage == 2){
            if(msgObj.message != ""){
                if (Channels.Exist(msgObj.ChannelID)){
                    Channels.Rooms[Channels.RoomIndex(msgObj.ChannelID)].users.users.forEach(roomClient => {
                        roomClient.webSocket.send(JSON.stringify({
                            message:msgObj.message.toString(),
                            FromUser: Channels.Rooms[Channels.RoomIndex(msgObj.ChannelID)].users.findUsername(wsClient),
                            stage: 2
                        }));
                    });
                }else{
                    wsClient.send(JSON.stringify({
                        message:"Error occured while sending message to room!",
                        type: "RoomSendError",
                        code: -1,
                        stage: 3
                    }));
                }
    
            }
        }
    });
    const interval = setInterval(() => {
        if (wsClient.isAlive == false) {
            wsClient.terminate();
            Channels.Rooms.forEach(room => {
                if(room.users.Exist(wsClient)){
                    room.users.Leave(wsClient);
                }
            });
        }
        RoomCheck();
        wsClient.ping("Connection test");
        wsClient.isAlive = false;
    }, 90000);//90 seconds
    wsClient.onclose = () => {
        clearInterval(interval);
        RoomCheck();
        Channels.Rooms.forEach(room => {
            if(room.users.Exist(wsClient)){
                room.users.Leave(wsClient);
            }
        });
    }
});

app.post('/Check', (req, res, next) => {
    const Username = req.body['Username'];
    const Channel = req.body['ChannelID'];
    //Data Check
    try {
        //if url pattern found (must be here bcs match could thow unwanted error)
        if(/^[a-zA-Z0-9_]*$/.test(Channel) == true){
            //If url pattern match != Channel
            if(Channel.match(/^[a-zA-Z0-9_]*$/) != Channel){
                throw {
                    message: "Invalid Channel name!",
                    code: 4,
                    type: "RuleBreakError"
                };
            }
        }else{
            //pattern not found
            throw {
                message: "Invalid Channel name!",
                code: 4,
                type: "RuleBreakError"
            };
        }
        //if pattern found
        if(Username == ''){
            throw {
                Username: Username,
                ChannelID: Channel,
                message: "Invalid Username!",
                code: 4,
                type: "RuleBreakError"
            };
        }
        res.json({
            Username: Username,
            ChannelID: Channel,
            message: "Request accepted!",
            code: 0,
            wsPath: `ws://${host}:8080/connect`,
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
    console.log(`listening at http://${host}:${port}`)
});