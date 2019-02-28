const data = require('./data');
const mailer = require('./mailer');
const TinyQueue = require('tinyqueue');

const specRoles = {
    "Protection Warrior":"Tank",
    "Protection Paladin":"Tank",
    "Holy Paladin":"Healer",
    "Discipline Priest":"Healer",
    "Holy Priest":"Healer",
    "Blood Death Knight":"Tank",
    "Restoration Shaman":"Healer",
    "Brewmaster Monk":"Tank",
    "Mistweaver Monk":"Healer",
    "Guardian Druid":"Tank",
    "Restoration Druid":"Healer",
    "Vengeance Demon Hunter":"Tank",
}

const bosses = [
    {
        'name': 'Champion of the Light',
        'image': 'src/champion.png',
        'loot': [
            {
                'id': 165517,
            },
            {
                'id': 165501,
            },
            {
                'id': 165550,
            },
            {
                'id': 165519,
            },
            {
                'id': 165549,
            },
            {
                'id': 165586,
            },
            {
                'id': 165919,
            },
            {
                'id': 165834,
            },
            {
                'id': 165514,
            },
            {
                'id': 165533,
            },
            {
                'id': 165921,
            },
            {
                'id': 165584,
            },
            {
                'id': 165569,
            }
        ]
    },
    {
        'name': 'Jadefire Masters',
        'image': 'src/jadefire.png',
        'loot': [
            {
                'id': 165565,
            },
            {
                'id': 165500,
            },
            {
                'id': 165521,
            },
            {
                'id': 165552,
            },
            {
                'id': 165531,
            },
            {
                'id': 165548,
            },
            {
                'id': 165568,
            },
            {
                'id': 165503,
            },
            {
                'id': 165516,
            },
            {
                'id': 165540,
            },
            {
                'id': 165587,
            },
        ]
    },
    {
        'name': 'Grong, the Revenant',
        'image': 'src/grong.png',
        'loot': [
            {
                'id': 165920,
            },
            {
                'id': 165534,
            },
            {
                'id': 165588,
            },
            {
                'id': 165922,
            },
            {
                'id': 165582,
            },
            {
                'id': 165515,
            },
            {
                'id': 165574,
            },
            {
                'id': 165589,
            },
            {
                'id': 165499,
            },
            {
                'id': 165513,
            },
            {
                'id': 165535,
            },
            {
                'id': 165555,
            },
            {
                'id': 165551,
            },
            {
                'id': 165525,
            },
            
        ]
    },
    {
        'name': 'Opulence',
        'image': 'src/opulence.png',
        'loot': [
            {
                'id': 165524,
            },
            {
                'id': 165591,
            },
            {
                'id': 165541,
            },
            {
                'id': 165561,
            },
            {
                'id': 165526,
            },
            {
                'id': 165821,
            },
            {
                'id': 165818,
            },
            {
                'id': 165573,
            },
            {
                'id': 165820,
            },
            {
                'id': 165592,
            },
            {
                'id': 165538,
            },
            {
                'id': 165593,
            },
            {
                'id': 165571,
            },
            {
                'id': 165504,
            },
        ]
    },
    {
        'name': 'Conclave of the Chosen',
        'image': 'src/conclave.png',
        'loot': [
            {
                'id': 165594,
            },
            {
                'id': 165560,
            },
            {
                'id': 165595,
            },
            {
                'id': 166418,
            },
            {
                'id': 165532,
            },
            {
                'id': 165579,
            },
            {
                'id': 165502,
            },
            {
                'id': 165512,
            },
            {
                'id': 165507,
            },
            {
                'id': 165599,
            },
            {
                'id': 165562,
            },
            {
                'id': 165833,
            }
        ]
    },
    {
        'name': 'King Rastakhan',
        'image': 'src/king.png',
        'loot': [
            {
                'id': 165832,
            },
            {
                'id': 165577,
            },
            
            {
                'id': 165536,
            },
            
            {
                'id': 165597,
            },
            
            {
                'id': 165596,
            },
            
            {
                'id': 165537,
            },
            
            {
                'id': 165578,
            },
            
            {
                'id': 165523,
            },
            
            {
                'id': 165558,
            },
            
            {
                'id': 165567,
            },
            
            {
                'id': 165498,
            }
        ]
    },
    {
        'name': 'High Tinker Mekkatorque',
        'image': 'src/tinker.png',
        'loot': [
            {
                'id': 165825,
            },
            {
                'id': 165497,
            },
            {
                'id': 165924,
            },
            {
                'id': 165508,
            },
            {
                'id': 165522,
            },
            {
                'id': 165830,
            },
            {
                'id': 165580,
            },
            {
                'id': 165598,
            },
            {
                'id': 165543,
            },
            {
                'id': 165600,
            },
            {
                'id': 165572,
            }
        ]
    },
    {
        'name': 'Stormwall Blockade',
        'image': 'src/blockade.png',
        'loot': [
            {
                'id': 165585,
            },
            {
                'id': 165822,
            },
            {
                'id': 165602,
            },
            {
                'id': 165590,
            },
            {
                'id': 165528,
            },
            {
                'id': 165557,
            },
            {
                'id': 165603,
            },
            {
                'id': 165546,
            },
            {
                'id': 165601,
            },
            {
                'id': 165556,
            },
            {
                'id': 165923,
            },
            {
                'id': 165819,
            },
            {
                'id': 165506,
            },  
        ]
    },
    {
        'name': 'Lady Jaina Proudmoore',
        'image': 'src/jaina.png',
        'loot': [
            {
                'id': 165824,
            },
            {
                'id': 165604,
            },
            {
                'id': 165527,
            },
            {
                'id': 165570,
            },
            {
                'id': 165831,
            },
            {
                'id': 165583,
            },
            {
                'id': 165823,
            },
            {
                'id': 165559,
            },
            {
                'id': 165542,
            },
            {
                'id': 165566,
            },
            {
                'id': 165505,
            },
            {
                'id': 165576,
            }  
        ]
    }
];

function generateSubReport() {
    // get upgrades for each boss
    for (let i = 0; i < bosses.length; i++) {
        let boss = bosses[i];
        for (let j = 0; j < boss.loot.length; j++) {
            let item = boss.loot[j];
            let sql = 'SELECT * FROM upgrades WHERE itemID = ?;';
            data.db.run(sql, [item.id], (err, rows) => {
                if (err) {
                    console.error('Failed to "SELECT * FROM upgrades":', err);
                    mailer.error(err);
                }
                if (rows) {
                    boss.upgrades = [];
                    for (var k = 0; k < rows.length; k++) {
                        boss.upgrades.push(rows[k]);
                    }
                }
            });
        }
    }

    // get top upgrades for each boss
    for (let i = 0; i < bosses.length; i++) {
        let upgrades = bosses[i].upgrades;
        let upgQ = new TinyQueue(upgrades, (a, b) => {
            let aUp = a.dps / a.baseDps;
            let bUp = b.dps / b.baseDps;
            return aUp < bUp ? -1 : aUp > bUp ? 1 : 0;
        });
        // get top dps upgrades for boss
        bosses[i].topUpgrades = [];
        while (bosses[i].topUpgrades.length < 14 && upgQ.length > 0) {
            let curUp = upgQ.pop();
            let role = specRoles[curUp.spec] || "DPS";
            if (role != "DPS") {
                bosses[i].topUpgrades.push(curUp);
            }
        }
        // mail boss report
        let report = '';
        for (let j = 0; j < bosses[i].topUpgrades.length; j++) {
            upg = bosses[i].topUpgrades[j];
            let sql = 'SELECT name FROM characters WHERE id = ?;';
            data.db.get(sql, [upg.characterID], (err, row) => {
                if (err) {
                    console.error('SELECT name FROM characters":', err);
                    mailer.error(err);
                }
                report += row.name + ', ' + (upg.dps / upg.baseDps * 100) + '% ' + '\n';
            });
        }
        mailer.report(report);
    }
}

module.exports = {
    generateSubReport: generateSubReport
};
