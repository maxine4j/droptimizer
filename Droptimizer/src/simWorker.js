const puppeteer = require('puppeteer');

async function runSim(charName, charRealm, charRegion) {
    let uri = `https://www.raidbots.com/simbot/droptimizer?region=${charRegion}&realm=${charRealm}&name=${charName}`;
    let cookies = [{
        name: 'raidsid',
        value: process.env.RAIDBOTS_COOKIE,
        domain: 'www.raidbots.com',
    }];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto(uri);
    setTimeout(async function() {
        // select BoD
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(3) > div:nth-child(4) > div:nth-child(3) > div > p');
        // select mythic
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(3) > div.Box > div > div:nth-child(4) > p');
        // start the sim, twice bc it doesnt work otherwise
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(11) > div > div:nth-child(1) > button');
        await page.click('#app > div > div.Container > section > section > div > section > div:nth-child(11) > div > div:nth-child(1) > button');
        await browser.close();
    }, 10000);
}

//runSim('arwic', 'frostmourne', 'us');

module.exports = null;
