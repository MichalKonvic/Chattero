const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors:{ origin: "*"}
});
const port = 3000;
app.use(express.static('APP'));

io.on('connection', (socket) => {
    console.log("User connected!");
    socket.on('message', message => console.log(message));
});

app.get('/api', (req, res) => {
    
});

app.get('/ChannelCreate', (req, res) => {
    
});

app.get('/socket.io/socket.io.js', (req, res) =>{
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.listen(port, () =>{
    console.log("Server Loaded!");
});