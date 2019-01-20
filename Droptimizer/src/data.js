var express = require('express');
var sqlite3 = require('sqlite3');

var db;

function init() {
    db = new sqlite3.Database('./data.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });
    db.run(`CREATE TABLE IF NOT EXISTS players 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT UNIQUE, 
                class INTEGER);`);
    db.run(`CREATE TABLE IF NOT EXISTS items 
                (id INTEGER PRIMARY KEY, 
                name TEXT, 
                ilvl INTEGER);`);
    db.run(`CREATE TABLE IF NOT EXISTS upgrades 
                (playerID INTEGER NOT NULL REFERENCES players, 
                itemID INTEGER NOT NULL REFERENCES items, 
                name TEXT,
                mean FLOAT,
                min FLOAT,
                max FLOAT,
                stddev FLOAT,
                median FLOAT,
                first_quartile FLOAT,
                third_quartile FLOAT,
                iterations INTEGER,
                PRIMARY KEY (playerID, itemID));`);
}

function insertDummyData() {
    try {
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Arwic", 3);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Bowbi", 10);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Monkaxd", 12);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Bwobets", 3);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Kharah", 11);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Solarhands", 5);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Sadwoofer", 9);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Astios", 2);');
        db.run('INSERT OR IGNORE INTO players (name, class) VALUES ("Datspank", 6);');

        db.run('INSERT OR IGNORE INTO upgrades (playerID, itemID, mean) VALUES (7, 123456, 987.123);');
    } catch {}
}

init();

insertDummyData();

module.exports = {
    db: db
};
