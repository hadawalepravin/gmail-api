'use strict';

// To enable cross-origin resource sharing
const cors = require('cors');

// To create a server
const http = require('http');

// To read application configurations
const config = require('config');

// To create an API application to perform CRUD operations using http endpoints
const express = require('express');

// To parse the request body
const bodyParser = require('body-parser');

// Endpoint routes
const authRouter = require('./routes/auth');
const gmailRouter = require('./routes/gmail');

module.exports = createServer();

function createServer() {
    const app = express();

    app.use(cors());

    app.use(bodyParser.json({ limit: '50mb' }));

    app.use(
        bodyParser.urlencoded({
            extended: true,
            limit: '50mb',
        })
    );

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Credentials', '*');
        next();
    });

    // An endpoint that saves credentials file and generates token file
    app.use('/', authRouter.router());

    // An endpoint that sends an email using OAuth2-client
    app.use('/', gmailRouter.router());

    http.createServer(app).listen(config.port);

    return app;
}
