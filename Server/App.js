const express = require('express');
const app = express();
const port = 3001;
app.use(express.static('APP'));
app.use(express.json({limit: '8mb'}));

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
                JavaScript: `(async ()=>{
                    if(await WSConnect("ws://${req.headers.host}/${Channel}") == 0){
                        AlertPop("Joining!","Joining ${Channel} as ${Username}",4000);
                        PageTransform();
                        ClearInputs();
                    }
                })();
                `,
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