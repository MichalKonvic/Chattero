const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('APP'));

app.get('/api', (req, res) => {
    
});

app.get('/ChannelCreate/:ChannelID', (req, res) => {
    res.json({
        ChannelID: req.params['ChannelID'],
        Status: 'Created'
    });
});

app.get('/socket.io/socket.io.js', (req, res) =>{
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.listen(port, () =>{
    console.log("Server Loaded!");
});