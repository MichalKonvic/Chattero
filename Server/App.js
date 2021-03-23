const express = require('express');
const app = express();
const port = 3001;
const io = require('socket.io');
app.use(express.static('APP'));
app.use(express.json({limit: '8mb'}));

app.get('/api', (req, res) => {
    
});
app.post('/Join', (req, res, next) => {
    console.log('Got body:', req.body);
    res.json(req.body);

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