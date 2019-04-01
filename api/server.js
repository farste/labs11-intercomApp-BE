const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json()

const teamRouter = require('./team/teamRouter');
const usersRouter = require('./users/usersRouter');
const groupRouter = require('./groups/groupsRouter');
const voiceRouter = require('./voice/voiceRouter');
/* const purchasingAndBillingRouter = require('./purchasingAndBilling/purchasingAndBillingRouter'); */
dotenv.config();
const db = require('../data/dbConfig.js');
const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/team', teamRouter);
server.use('/api/users', usersRouter);
server.use('/api/groups', groupRouter);
server.use('/api/voice', voiceRouter);
/* server.use('/api/purchasingAndBilling', purchasingAndBillingRouter); */

server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.post('/test', (req, res) => {
    console.log('req', req.body)    
    res.send('Hello World!');
});

module.exports = server;