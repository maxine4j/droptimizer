var express = require('express');
var router = express.Router();
var data = require('./data');

// get all upgrades
router.get('/$', function(req, res, next) {
    let sql = 'SELECT * FROM upgrades;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows)
    });
});

// gets an upgrade by id and character name
router.get('/:region/:realm/:name/:itemID', function(req, res, next) {
    console.log(req.params.playerName, req.params.itemID)
    let sql = `SELECT * 
                FROM upgrades 
                JOIN characters ON upgrades.characterID = characters.id
                WHERE characters.region=? COLLATE NOCASE 
                AND characters.realm=? COLLATE NOCASE
                AND characters.name=? COLLATE NOCASE
                AND upgrades.itemID=?;`;
    data.db.get(sql, [req.params.region, req.params.realm, req.params.name, req.params.itemID], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows)
    });
})

module.exports = router;
