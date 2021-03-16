const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('Web'));

app.get('/api', (req, res) => {
    
});

app.get('/ChannelCreate', (req, res) => {
    
});

app.listen(port);