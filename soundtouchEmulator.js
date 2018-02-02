"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

if (process.argv.length === 4) {
    const macAddress = process.argv[3];
    if (macAddress.length !== 12) {
        console.error("mac must be 12 characters");
    }


    app.use(bodyParser.text());
    let currentVolume = 20;
    let source = "STANDBY";

    app.listen(8090, process.argv[2], function () {
        console.log('Listening on ' + process.argv[2] + " with mac " + process.argv[3]);
    });

    app.get('/info', (req, res) => {
        console.log("get info");
        res.send("<info deviceID=\"" + macAddress + "\">\n" +
            "<name>Living room</name>\n" +
            "<type>SoundTouch20</type>\n" +
            "</info>")

    });

    app.get('/volume', (req, res) => {
        console.log("get volume");
        res.send("<volume deviceID=\"" + macAddress + "\">\n" +
            "<targetvolume>" + currentVolume + "</targetvolume>\n" +
            "<actualvolume>" + currentVolume + "</actualvolume>\n" +
            "<muteenabled>false</muteenabled>\n" +
            "</volume>");
    });

    app.post('/volume', (req, res) => {
        const body = req.body;
        const matcher = body.match(/<volume>(\d+)<\/volume>/);
        if (matcher) {
            currentVolume = Number(matcher[1]);
            console.log("Current volume: " + currentVolume);
        }
        res.sendStatus(200);
    });

    app.post('/key', (req, res) => {
        const body = req.body;
        console.log(body);
        res.sendStatus(200);
    });

    app.get("/now_playing", (req, res) => {
        console.log("get now_playing");
        res.send("<nowPlaying deviceID=\"" + macAddress + "\" source=\"" + source + "\">\n" +
            "     <ContentItem source=\"" + source + "\" location=\"$STRING\" sourceAccount=\"$STRING\" isPresetable=\"$BOOL\">\n" +
            "       <itemName>$STRING</itemName>\n" +
            "    </ContentItem>\n" +
            "   <stationName>$STRING</stationName>\n" +
            "   <stationLocation>Internet</stationLocation>\n" +
            "</nowPlaying>")
    });

    app.get("/presets", (req, res) => {
        console.log("get preset");
        res.send("<presets>" +
            "<preset id=\"1\">" +
            "<ContentItem source=\"INTERNET_RADIO\" location=\"3234\" >" +
            "<itemName>Demo</itemName>" +
            "</ContentItem>" +
            "</preset>" +
            "</presets>")
    });

} else {
    console.log("args: ip mac")
}
