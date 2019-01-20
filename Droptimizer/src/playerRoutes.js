var express = require('express');
var router = express.Router();
var data = require('./data');

// gets all players
router.get('/$', function(req, res, next) {
    let sql = 'SELECT * FROM players;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows)
    });
});

// gets a player by name
router.get('/:name', function(req, res, next) {
    let sql = 'SELECT * FROM players WHERE name=? COLLATE NOCASE;';
    data.db.get(sql, [req.params.name], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows)
    });
})

module.exports = router;
