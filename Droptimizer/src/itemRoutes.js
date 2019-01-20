var express = require('express');
var router = express.Router();


// gets an itme by id
router.get('/:itemID', function(req, res, next) {
    let sql = 'SELECT * FROM items WHERE id=?;';
    data.db.get(sql, [req.params.itemID], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows)
    });
});

module.exports = router;
