const express = require('express');
const path = require('path');
const conectDB = require('./db');
const router = require('./router')

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../client/dist')))
app.use(express.json());
app.use('/api', router);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

const serverPromis = conectDB().then(()=> app.listen(8000, () => { console.log('server is live') }));

module.exports = serverPromis;