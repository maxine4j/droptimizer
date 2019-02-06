const express = require('express');
const router = express.Router();
const data = require('./data');

// gets all characters
router.get('/$', function(req, res, next) {
    const sql = 'SELECT * FROM characters;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows.length);
        res.json(rows);
    });
});

// gets a character by name
router.get('/:region/:realm/:name', function(req, res, next) {
    const sql = 'SELECT * FROM characters WHERE region=? COLLATE NOCASE AND realm=? COLLATE NOCASE AND name=? COLLATE NOCASE;';
    data.db.get(sql, [req.params.region, req.params.realm, req.params.name], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row);
    });
})

module.exports = router;
