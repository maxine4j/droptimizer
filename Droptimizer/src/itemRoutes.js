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
      });
}
router.get('/', function(req, res, next) {
    res.json('/')
});

module.exports = router;
