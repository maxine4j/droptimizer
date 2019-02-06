const express = require('express');
const sqlite3 = require('sqlite3');

const dbFilePath = './data.db';
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});
db.run(`CREATE TABLE IF NOT EXISTS characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            lastModified INTEGER NOT NULL,
            name TEXT UNIQUE NOT NULL, 
            class INTEGER NOT NULL,
            thumbnail TEXT NOT NULL
        );`);
db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            quality INTEGER NOT NULL,
            itemLevel INTEGER NOT NULL
        );`);
db.run(`CREATE TABLE IF NOT EXISTS upgrades (
            characterID INTEGER NOT NULL, 
            itemID INTEGER NOT NULL, 
            reportID TEXT NOT NULL,
            dps FLOAT NOT NULL,
            baseDps FLOAT NOT NULL,
            spec TEXT NOT NULL,
            timeStamp INTEGER NOT NULL,
            CONSTRAINT fk_characterID FOREIGN KEY (characterID) REFERENCES characters(id) ON DELETE CASCADE,
            CONSTRAINT fk_itemID FOREIGN KEY (itemID) REFERENCES items(id) ON DELETE CASCADE
        );`);

module.exports = {
    db: db
};
