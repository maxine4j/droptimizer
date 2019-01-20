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
    db.run(`
        CREATE TABLE IF NOT EXISTS players 
            (id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT NOT NULL UNIQUE, 
            class INTEGER);
        CREATE TABLE IF NOT EXISTS items 
            (id INTEGER PRIMARY KEY, 
            name TEXT, 
            ilvl INTEGER);
        CREATE TABLE IF NOT EXISTS upgrades 
            (playerID INTEGER NOT NULL REFERENCES players, 
            itemID INTEGER NOT NULL REFERENCES items, 
            PRIMARY KEY (playerID, itemID));
    `);
}

init();

module.exports = {
    db: db
};
