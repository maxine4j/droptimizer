var express = require('express');
var router = express.Router();

function getAllPlayers() {
    let sql = 'SELECT * FROM players;';
    data.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
        return rows;
    });
}
router.get('/all', function(req, res, next) {
    let allPlayers = getAllPlayers();
    print(allPlayers)
    res.json('test')
});

module.exports = router;
