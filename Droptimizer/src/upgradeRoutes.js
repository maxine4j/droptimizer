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

// gets an upgrade by id and player name
router.get('/:playerName/:itemID', function(req, res, next) {
    console.log(req.params.playerName, req.params.itemID)
    let sql = `SELECT * 
                FROM upgrades 
                INNER JOIN players ON upgrades.playerID = players.id
                WHERE players.name=? COLLATE NOCASE AND upgrades.itemID=?;`;
    data.db.get(sql, [req.params.playerName, req.params.itemID], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        res.json(rows)
    });
})

module.exports = router;
