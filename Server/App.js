const express = require('express');
const app = express();
const port = 3001;
const io = require('socket.io');
app.use(express.static('APP'));
app.use(express.json({limit: '8mb'}));

app.get('/api', (req, res) => {
    
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
                        AlertPop: {
                            message: "Invalid Channel name!",
                            poptime: 3000
                        }
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
                    AlertPop: ["Invalid Channel name!",3000]
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
                    AlertPop: ["Invalid Username!",3000]
                }
            };
        }
        res.json({
            Username: Username,
            ChannelID: Channel,
            message: "Request accepted!",
            code: 0,
            ClientAction: {
                //Start room and animation to room
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

    //When no data found
    // res.json({
    //     status: "No data",
    //     code: 2
    // })
});

    // Implementation code

    // try {
    //     io.on('connection', socket => {
    //         socket.join();
    //     });
    //     res.json({
    //         ChannelID: req.params['ChannelID'],
    //         status: 'Active',
    //         code: 0
    //     });
    // } catch (error) {
    //     res.json({
    //         ChannelID: req.params['ChannelID'],
    //         status: 'Cannot create room',
    //         code: 1
    //     });
    // }

    // Implementation code


    

app.get('/socket.io/socket.io.js', (req, res) =>{
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.listen(port, () =>{
    console.log("Server Loaded!");
});