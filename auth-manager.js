'use strict';

const fs = require('fs');
const open = require('open');
const config = require('config');
const { google } = require('googleapis');

// Declare OAuth2-client globally
global.oAuth2Client = null;

const tokenPath = config.tokenPath;
const credentialsPath = config.credentialsPath;

module.exports = {
    refreshCredentials,
    authorizeCredentials,
};

function refreshCredentials(code) {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            return console.error('Error retrieving access token: ', err);
        }

        oAuth2Client.setCredentials(token);

        fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
            if (err) {
                return console.error(err);
            }

            console.log('Token stored at: ', tokenPath);
        });
    });
}

function authorizeCredentials() {

    // Load credentials from a local file
    fs.readFile(credentialsPath, (err, content) => {
        if (err) {
            return console.log('Error loading credentials file: ', err);
        }

        // Authorize a client with credentials
        authorize(JSON.parse(content));
    });
}

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if a token is previously stored
    fs.readFile(tokenPath, (err, token) => {
        if (err) {

            // If the token is not stored, then launch auth-url in the default browser
            // Allow user to select the gmail account to generate the token file
            return getNewToken(oAuth2Client);
        }

        oAuth2Client.setCredentials(JSON.parse(token));
    });
}

function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: config.scopes,
    });

    // Authorize app by launching the auth url in the default browser
    (async () => {
        await open(authUrl);
    })();
}
