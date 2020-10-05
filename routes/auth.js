'use strict';

const fs = require('fs');
const config = require('config');
const express = require('express');
const authManager = require('../auth-manager');
const credentialsPath = config.credentialsPath;

var auth = exports;

auth.router = () => {
    const router = express.Router();

    // POST endpoint to store credentials file locally
    router.route('/').post(function (req, res, next) {
        if (req.body) {
            fs.writeFileSync(credentialsPath, JSON.stringify(req.body));

            // Authorize credentials
            authManager.authorizeCredentials();
            res.status(200).send('Credentials stored successfully!');
        } else {
            res.status(400).send('Credentials not found in the request body!');
        }
    });

    // GET endpoint to extract code from the redirect url
    router.route('/').get(function (req, res, next) {
        const code = req.query.code;

        // Refresh credentials
        authManager.refreshCredentials(code);
        res.status(200).send('Token extracted successfully!');
    });

    return router;
};
