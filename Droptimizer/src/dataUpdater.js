var express = require('express');
var data = require('./data');
var request = require('request');
var puppeteer = require('puppeteer');
var CronJob = require('cron').CronJob;
var router = express.Router();
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

async function runSim(charName, charRealm, charRegion) {
    console.log(`Running sim for ${charName}-${charRealm}-${charRegion}`);
    let uri = `https://www.raidbots.com/simbot/droptimizer?region=${charRegion}&realm=${charRealm}&name=${charName}`;
    let cookies = [{
        name: 'raidsid',
        value: process.env.RAIDBOTS_COOKIE,
        domain: 'www.raidbots.com',
    }];
    const browser = await puppeteer.launch().catch(function() {
        // if the browser failed to start, then recall this sim in 1 minute
        console.warn('Failed to start a new browser, will retry in 1 minute');
        setTimeout(function() {
            runSim(charName, charRealm, charRegion);
        }, 60 * 1000);
        return;
    });
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto(uri);
    setTimeout(async function() {
        // select BoD
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(3) > div:nth-child(4) > div:nth-child(3)');
        // select mythic
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(3) > div.Box > div > div:nth-child(4) > p');
        // start the sim, twice bc it doesnt work otherwise
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(11) > div > div:nth-child(1) > button');
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(11) > div > div:nth-child(1) > button');
        await page.waitForNavigation();
        let reportID = page.url().split('/')[5];
        await browser.close();
        setTimeout(function() {
            updateSimcReport(reportID);
        },1000 * 60 * 10); // let raidbots have 10 mins to process the sim
    }, 3000);
}

function runAllCharSims() {
    let lastDelay = 0;
    let delayGap = 60 * 1000 * 5; // 5 min delay between starting sims
    let sql = 'SELECT * FROM characters;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            setTimeout(function() {
                runSim(rows[i].name, rows[i].realm, rows[i].region);
            }, lastDelay);
            lastDelay += delayGap;
        }
    });

}
function insertUpgrade(charID, result, baseDps, reportID) {
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
        iterations,
        reportID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
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
        reportID
    ];
    data.db.run(sql, params);
}

function parseSimcReport(report, reportID) {
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
        for (var i = 0; i < report.sim.profilesets.results.length; i++) {
            insertUpgrade(row.id, report.sim.profilesets.results[i], report.sim.players[0].collected_data.dps, reportID);
        }
    });
}

function fetchSimcReport(reportID, callback) {
    console.log(`Fetching raidbots report ${reportID}`);
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
    fetchSimcReport(reportID, report => parseSimcReport(report, reportID));
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

function firstStart() {
    // run everything once on first start
    setTimeout(function() {
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

        updateItems();
        //runAllCharSims();
    }, 5000);
}

function createCronJobs() {
    // update all characters every hour
    let cron_characterUpdate = new CronJob('* 1 * * *', function() {
        console.log("CRON: Updating Characters");
        updateAllCharacters();
    });
    cron_characterUpdate.start();

    // start new droptimizer sims at 3:00am every day
    let cron_startSims = new CronJob('0 3 * * *', function() {
        console.log("CRON: Running character sims");
        runAllCharSims();
    });
    cron_startSims.start();

    // update items at 3:00am every day
    let cron_updateItems = new CronJob('0 3 * * *', function() {
        console.log("CRON: Updating items");
        updateItems();
    });
    cron_updateItems.start();
}

firstStart();
createCronJobs();

router.get('/sim/:charRegion/:charRealm/:charName', function(req, res, next) {
    runSim(req.params.charName, req.params.charRealm, req.params.charRegion);
    res.json(`Sim Started for ${req.params.charName}-${req.params.charRealm}-${req.params.charRegion}. New upgrades should be ready in 5 minutes.`);
});

router.get('/all/sim$', function(req, res, next) {
    runAllCharSims();
    res.json(`Sim started for all characters. This could take a while.`);
});

router.get('/character/:charRegion/:charRealm/:charName', function(req, res, next) {
    updateCharacter(req.params.charName, req.params.charRealm, req.params.charRegion);
    res.json(`Character ${req.params.charName}-${req.params.charRealm}-${req.params.charRegion} has been updated.`);
});

router.get('/all/character$', function(req, res, next) {
    updateAllCharacters();
    res.json(`All characters have been updated.`);
});

module.exports = router;
