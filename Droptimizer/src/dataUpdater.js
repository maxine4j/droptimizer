var express = require('express');
var data = require('./data');
var request = require('request');
var blizzard  = require('blizzard.js').initialize({
    key: process.env.WOW_API_CLIENTID,
    secret: process.env.WOW_API_CLIENTSECRET,
    origin: 'us',
});
var blizzardToken = '';
blizzard.getApplicationToken({
    key: process.env.WOW_API_CLIENTID,
    secret: process.env.WOW_API_CLIENTSECRET,
    origin: 'us'
}).then(response => {
    blizzardToken = response.data.access_token;
}).catch(e => console.error(e));

function updateCharacter(charName, charRealm, charRegion) {
    blizzard.wow.character(['profile'], { origin: charRegion, realm: charRealm, name: charName, token: blizzardToken })
        .then(response => {
            let sql = 'SELECT id FROM characters WHERE region=? COLLATE NOCASE AND realm=? COLLATE NOCASE AND name=? COLLATE NOCASE;';
            data.db.get(sql, [charRegion, charRealm, charName], function(err, row) {
                let sql = `INSERT OR REPLACE INTO characters(
                    id,
                    lastModified,
                    name,
                    realm,
                    region,
                    class,
                    race,
                    gender,
                    level,
                    thumbnail,
                    faction,
                    guild) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                let params = [
                    row ? row.id : null,
                    response.data.lastModified,
                    response.data.name,
                    charRealm,
                    charRegion,
                    response.data.class,
                    response.data.race,
                    response.data.gender,
                    response.data.level,
                    response.data.thumbnail,
                    response.data.faction,
                    "Bastion",
                ];
                data.db.run(sql, params)
            })
        }).catch(e => console.error(`Error updating ${charName}-${charRealm}-${charRegion}`));
}

function updateAllCharacters() {
    // get all chars
    let sql = 'SELECT * FROM characters;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        for (var i = 0; i < rows.length; i++) {
            console.log(`Updating data for ${rows[i].name}-${rows[i].realm}-${rows[i].region}`);
            updateCharacter(rows[i].name, rows[i].realm, rows[i].region);
        }
    });
}

function parseSimcReport(report) {
    let charName = report.simbot.meta.rawFormData.character.name;
    let charRealm = report.simbot.meta.rawFormData.character.realm;
    let charRegion = report.simbot.meta.rawFormData.character.region;
    console.log(`Parsing report for ${charName}-${charRealm}-${charRegion}`);
    updateCharacter(charName, charRealm, charRegion);

    // get the character id
    let sql = 'SELECT * FROM characters WHERE region=? COLLATE NOCASE AND realm=? COLLATE NOCASE AND name=? COLLATE NOCASE;';
    data.db.get(sql, [charRegion, charRealm, charName], (err, row) => {
        if (err || !row) {
            throw err;
        }
        let charID = row.id
        console.log('charID = ' + charID)
        // insert the upgrade into upgrades table
        for (var i = 0; i < report.sim.profilesets.results.length; i++) {
            let result = report.sim.profilesets.results[i];
            let itemID = result.name.split('\/')[2];
            let sql = `INSERT OR REPLACE INTO upgrades(
                characterID,
                itemID,
                name,
                mean,
                min,
                max,
                stddev,
                median,
                first_quartile,
                third_quartile,
                iterations) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            let params = [
                charID,
                itemID,
                result.name,
                result.mean,
                result.min,
                result.max,
                result.stddev,
                result.median,
                result.first_quartile,
                result.third_quartile,
                result.iterations,
            ];
            data.db.run(sql, params)
        }
    });
}

function fetchSimcReport(reportID, callback) {
    let uri = `https://www.raidbots.com/reports/${reportID}/data.json`;
    request.get(uri, function(error, response, body) {
        if (response && response.statusCode == 200) {
            bodyObj = JSON.parse(body);
            callback(bodyObj);
        } else {
            console.error(error);
        }
    });
}

function updateSimcReport(reportID) {
    fetchSimcReport(reportID, report => parseSimcReport(report));
}

setTimeout(function() {
    let sql = 'SELECT * FROM characters;';
    data.db.all(sql, [], (err, rows) => {
        if (rows.length == 0) {
            updateCharacter('arwic', 'frostmourne', 'us'); 
            updateCharacter('bowbi', 'frostmourne', 'us'); 
            updateCharacter('monkaxd', 'frostmourne', 'us'); 
            updateCharacter('subjugates', 'frostmourne', 'us'); 
            updateCharacter('kharahh', 'frostmourne', 'us'); 
            updateCharacter('datspank', 'frostmourne', 'us'); 
            updateCharacter('astios', 'frostmourne', 'us'); 
            updateCharacter('solarhands', 'frostmourne', 'us'); 
            updateCharacter('gayke', 'frostmourne', 'us'); 
            updateCharacter('sadwoofer', 'frostmourne', 'us'); 
            updateCharacter('cleavergreen', 'frostmourne', 'us'); 
            updateCharacter('bwobets', 'frostmourne', 'us'); 
            updateCharacter('dasit', 'frostmourne', 'us'); 
            updateCharacter('sslay', 'frostmourne', 'us'); 
            updateCharacter('vietmonks', 'frostmourne', 'us'); 
            updateCharacter('Nivektis', 'frostmourne', 'us'); 
            updateCharacter('ptolemy', 'frostmourne', 'us'); 
            updateCharacter('stollas', 'frostmourne', 'us'); 
            updateCharacter('lightzlightt', 'frostmourne', 'us'); 
            updateCharacter('agreatname', 'frostmourne', 'us'); 
            updateCharacter('kitteriel', 'frostmourne', 'us'); 
            updateCharacter('procreated', 'frostmourne', 'us'); 
            updateCharacter('bbltransfmnz', 'frostmourne', 'us'); 
            updateCharacter('zezek', 'frostmourne', 'us'); 
            updateCharacter('brbteabreaks', 'frostmourne', 'us'); 
            updateCharacter('peroxíde', 'frostmourne', 'us'); 
            updateCharacter('meggers', 'frostmourne', 'us'); 
        } else {
            updateAllCharacters();
        }

        setTimeout(function() {
            updateSimcReport('6Us9gjb6hNd3QVJEmfwrc4');
        }, 1000);
    });
}, 1000);



module.exports = null;
