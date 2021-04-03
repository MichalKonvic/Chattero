const express = require('express');
const app = express();
const port = 3001;
app.use(express.static('APP'));
app.use(express.json({limit: '8mb'}));

//WebSocket

class user{
    #uIds;
    constructor(uIdList = []) {
        this.#uIds = uIdList;
    }
    count(){
        return this.#uIds.length;
    }
    join(uId=""){
        if (this.#uIds.includes(uId) == false) {
            this.#uIds.push(uId);
            return true
        }else{
            return false;
        }
    }
    leave(uId=""){
        this.#uIds = this.#uIds.filter((arrayUId) => {return arrayUId !== uId;});
        return this.#uIds.length;
    }
}
class Room{
    #name;
    constructor(name='unnamed', uIdList){
        this.#name = name;
        this.user = new user(uIdList);
    }
    isEmpty(){
        if (this.user.count() == 0) {
            return true;
        }else{
            return false;
        }
    }
}
const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({server:server,});
let Rooms = [];


function GenUID(preset="") {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    charset += preset;
    let UID = '';
    for (let UsernameChar = 0; UsernameChar < 32; UsernameChar++) {
        UID += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return UID;
}


app.all('/Channel/:ChannelID', (req,res,next) => {

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
            UID: 'uid',
            message: "Request accepted!",
            code: 0,
            ClientAction: {
                WSConnect: [`ws://${req.headers.host}/Channel/${Channel}`]
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