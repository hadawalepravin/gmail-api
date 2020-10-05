'use strict';

const config = require('config');
const express = require('express');
const { google } = require('googleapis');

var gmail = exports;

gmail.router = () => {
    const router = express.Router();

    // POST endpoint to send an email using OAuth2-client
    router.route('/sendmail').post(async (req, res, next) => {
        await sendEmail(oAuth2Client);
        res.send('Email sent successfully!');
    });

    return router;
};

async function sendEmail(auth) {
    const raw = prepareBody({
        to: config.toEmailId,
        from: config.fromEmailId,
        subject: 'Test Email',
        message: 'This is a test message!',
    });

    const gmail = google.gmail({ version: 'v1', auth: auth });
    await gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: raw,
        },
    }, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
    });
}

function prepareBody(params) {
    params.subject = Buffer.from(params.subject).toString('base64');
    const str = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        `to: ${params.to} \n`,
        `from: ${params.from} \n`,
        `subject: =?UTF-8?B?${params.subject}?= \n\n`,
        params.message,
    ].join('');
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}
