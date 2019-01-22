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
    db.run(`CREATE TABLE IF NOT EXISTS characters 
                (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                lastModified INTEGER NOT NULL,
                name TEXT UNIQUE NOT NULL, 
                realm TEXT NOT NULL, 
                region TEXT NOT NULL, 
                class INTEGER NOT NULL,
                race INTEGER NOT NULL,
                gender INTEGER NOT NULL,
                level INTEGER NOT NULL,
                thumbnail TEXT NOT NULL,
                faction INTEGER NOT NULL,
                guild TEXT NOT NULL);`);
    db.run(`CREATE TABLE IF NOT EXISTS items 
                (id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                icon TEXT NOT NULL,
                quality INTEGER NOT NULL,
                itemLevel INTEGER NOT NULL);`);
    db.run(`CREATE TABLE IF NOT EXISTS upgrades 
                (characterID INTEGER NOT NULL REFERENCES characters, 
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
                PRIMARY KEY (characterID, itemID));`);
}

init();

module.exports = {
    db: db
};
