var express = require('express');
var data = require('./data');
var request = require('request');
var simWorker = require('./simWorker');
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
}).catch(e => console.error("YEEEEEEEE"));

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
                    'Bastion',
                ];
                data.db.run(sql, params);
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

/*
function insertBaseDps(charID, baseDps) {
    let sql = `UPDATE characters SET 
        baseDpsMean=?, 
        baseDpsMin=?, 
        baseDpsMax=?, 
        baseDpsStddev=?, 
        baseDpsMedian=?,
        baseDpsIterations=?
        WHERE id=?;`
    let params = [
        baseDps.mean,
        2,
        3,
        4,
        5,
        6,
        charID,
    ];
    console.log(charID, baseDps.mean);
    data.db.run(sql, params, function(err){
        console.log(err);
        console.log(this.changes);
    });
}
*/

function insertUpgrade(charID, result, baseDps) {
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
        base_dps_mean,
        iterations) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
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
        baseDps.mean,
        result.iterations,
    ];
    data.db.run(sql, params);
}

function parseSimcReport(report) {
    let charName = report.simbot.meta.rawFormData.character.name;
    let charRealm = report.simbot.meta.rawFormData.character.realm;
    let charRegion = 'us';
    console.log(`Parsing report for ${charName}-${charRealm}-${charRegion}`);
    updateCharacter(charName, charRealm, charRegion);

    // get the character id
    let sql = 'SELECT * FROM characters WHERE region=? COLLATE NOCASE AND realm=? COLLATE NOCASE AND name=? COLLATE NOCASE;';
    data.db.get(sql, [charRegion, charRealm, charName], (err, row) => {
        if (err || !row) {
            throw err;
        }
        //let charID = row.id;
        // update the characters base dps
        //insertBaseDps(charID, report.sim.players[0].collected_data.dps);
        // insert the upgrade into upgrades table
        for (var i = 0; i < report.sim.profilesets.results.length; i++) {
            insertUpgrade(row.id, report.sim.profilesets.results[i], report.sim.players[0].collected_data.dps);
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

function updateItems() {
    let uri = 'https://www.raidbots.com/static/data/live/equippable-items.json';
    request.get(uri, function(error, response, body) {
        if (response && response.statusCode == 200) {
            console.log('Got item data from raidbots');
            items = JSON.parse(body);
            data.db.run("BEGIN TRANSACTION");
            for (let i = 0; i < items.length; i++) {
                let sql = 'INSERT OR REPLACE INTO items(id, name, icon, quality, itemLevel) VALUES (?, ?, ?, ?, ?);'
                let params = [items[i].id, items[i].name, items[i].icon, items[i].quality, items[i].itemLevel];
                data.db.run(sql, params);
            }
            data.db.run("COMMIT");
            console.log(`${items.length} items updated`);
        } else {
            console.error(error);
        }
    });
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
            updateSimcReport('6Us9gjb6hNd3QVJEmfwrc4'); // arwic
            updateSimcReport('tbrHVDZPgEiMf5ykvXR1AU'); // bowbi
            updateSimcReport('8QxcijEUsPGUN1G7pbr4MC'); // brbteabreaks
        }, 2000);
    });
}, 2000);

setTimeout(function() {
    sql = 'SELECT * FROM characters WHERE id=25;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("YEEEET");
        console.log(rows);
    });
}, 15000)

//updateItems();

module.exports = null;
