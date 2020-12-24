const express = require('express');
const router = express.Router();
const data = require('./data');


// gets an itme by id
router.get('/:itemID', function(req, res, next) {
    const sql = 'SELECT * FROM items WHERE id=?;';
    data.db.get(sql, [req.params.itemID], (err, row) => {
        if (err) {
            throw err;
        }
        res.json(row);
    });
});

module.exports = router;
