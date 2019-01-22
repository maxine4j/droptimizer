var express = require('express');
var router = express.Router();
var data = require('./data');


// gets an itme by id
router.get('/:itemID', function(req, res, next) {
    let sql = 'SELECT * FROM items WHERE id=?;';
    data.db.get(sql, [req.params.itemID], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row)
    });
});

module.exports = router;
