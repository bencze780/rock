const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Adatbázis konfiguráció
const adatbazis = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root', // TIPP: XAMPP-nál ez gyakran csak: ""
    database: 'rock_zenekarok_70s'
});

adatbazis.connect((err) => {
    if (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('Kritikus hiba az adatbázis kapcsolódásakor:', err.sqlMessage);
        }
        return;
    }
    if (process.env.NODE_ENV !== 'test') {
        console.log('Sikeresen kapcsolódva az adatbázishoz.');
    }
});

// Végpontok
app.get('/api/zenekar', (req, res) => {
    const sql = 'SELECT * FROM zenekarok';
    adatbazis.query(sql, (err, results) => {
        if (err) return res.status(500).send('Hiba a lekérdezés során');
        res.json(results);
    });
});

app.post('/api/ujzenekar', (req, res) => {
    const {nev, stilus_id, orszag, varos, aktiv_evek, tagok, legsikeresebb_album, kep_url } = req.body;
    const sql = 'INSERT INTO zenekarok (nev, stilus_id, orszag, varos, aktiv_evek, tagok, legsikeresebb_album, kep_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    adatbazis.query(sql, [nev, stilus_id, orszag, varos, aktiv_evek, tagok, legsikeresebb_album, kep_url], (err, results) => {
        if (err) return res.status(500).send('Adatbázis hiba: ' + err.sqlMessage);
        res.status(201).json({ id: results.insertId });
    });
});

app.get('/api/stilusok', (req, res) => {
    const sql = 'SELECT stilus_neve, id FROM stilusok';
    adatbazis.query(sql, (err, results) => {
        if (err) return res.status(500).send('Hiba a lekérdezés során');
        res.json(results);
    });
});

app.delete('/api/zenekar/:id', (req, res) => {
    const sql = 'DELETE FROM zenekarok WHERE id = ?';
    adatbazis.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Hiba a törlés során');
        res.send('Sikeres törlés');
    });
});

// Fontos: Csak akkor indítsuk el a szervert, ha nem teszt üzemmódban vagyunk
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Szerver fut a ${port} porton`);
    });
}

// Exportálás a tesztekhez
module.exports = { app, adatbazis };