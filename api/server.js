const express = require('express');
const helmet = require('helmet');

const actionRouter = require('./action-router.js');
const projectRouter = require('./project-router.js');

const server = express();

server.use(express.json());
server.use(logger);

server.use('/project', helmet(), projectRouter);
server.use('/action', helmet(), actionRouter);

server.get('/', (req, res) => {
    res.send('<h2>API up and running</h2>')
});

function logger(req, res, next) {
    const d = new Date();
    console.log(`${req.method} to ${req.originalUrl} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
    next();
}

module.exports = server;