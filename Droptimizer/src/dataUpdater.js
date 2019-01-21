var express = require('express');
var data = require('./data');
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
            data.db.run(`INSERT OR REPLACE INTO characters(
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
                guild) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`)
            console.log(response.data);
        }).catch(e => console.error(e));
}

function updateAllCharacters() {
    // get all chars
    let sql = 'SELECT * FROM players;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        for (var i = 0; i < rows.length; i++) {
            updateCharacter(rows[i].name, rows[i].realm, rows[i].region);
        }
    });
}

setTimeout(function() { updateCharacter('arwic', 'frostmourne', 'us') }, 1000);

module.exports = null;
