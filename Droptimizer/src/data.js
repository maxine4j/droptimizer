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

function insertDummyData() {
    db.run(`
        INSERT INTO players (name, class) VALUES ("Arwic", 3);
        INSERT INTO players (name, class) VALUES ("Bowbi", 10);
        INSERT INTO players (name, class) VALUES ("Monkaxd", 12);
        INSERT INTO players (name, class) VALUES ("Bwobets", 3);
        INSERT INTO players (name, class) VALUES ("Kharah", 11);
        INSERT INTO players (name, class) VALUES ("Solarhands", 5);
        INSERT INTO players (name, class) VALUES ("Sadwoofer", 9);
        INSERT INTO players (name, class) VALUES ("Astios", 2);
        INSERT INTO players (name, class) VALUES ("Datspank", 6);
    `)
}

init();

insertDummyData();

module.exports = {
    db: db
};
