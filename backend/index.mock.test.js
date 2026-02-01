const request = require('supertest');
const mysql = require('mysql');

// 1. MOCKOLÁS: Megmondjuk a Jest-nek, hogy a 'mysql' modul ne valódi legyen
jest.mock('mysql', () => {
    const mConnection = {
        connect: jest.fn((callback) => callback(null)), // Mindig sikeres kapcsolódás
        query: jest.fn(), // Ezt fogjuk egyedileg beállítani a teszteknél
        end: jest.fn((callback) => callback(null))
    };
    return {
        createConnection: jest.fn(() => mConnection)
    };
});

// Importáljuk az app-ot (a mysql már mockolva van az import pillanatában)
const { app, adatbazis } = require('./index');

describe('API Unit Tesztek (Adatbázis nélkül - Mock)', () => {

    beforeEach(() => {
        // Minden teszt előtt töröljük a korábbi hívások emlékeit
        jest.clearAllMocks();
    });

    test('GET /api/zenekar - Sikeres listázás szimulált adatokkal', async () => {
        // Beállítjuk, mit adjon vissza a "kamu" adatbázis
        const mockZenekarok = [
            { id: 1, nev: 'Mock Band 1', orszag: 'Hungary' },
            { id: 2, nev: 'Mock Band 2', orszag: 'UK' }
        ];

        // A query metódus most a mi adatainkat adja vissza a callback-ben
        adatbazis.query.mockImplementation((sql, callback) => {
            callback(null, mockZenekarok);
        });

        const response = await request(app).get('/api/zenekar');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].nev).toBe('Mock Band 1');
        // Ellenőrizzük, hogy a kód valóban a jó SQL-t akarta-e futtatni
        expect(adatbazis.query).toHaveBeenCalledWith('SELECT * FROM zenekarok', expect.any(Function));
    });

    test('POST /api/ujzenekar - Sikeres mentés szimulálása', async () => {
        const mockInsertResult = { insertId: 99 };

        adatbazis.query.mockImplementation((sql, params, callback) => {
            callback(null, mockInsertResult);
        });

        const ujZenekar = { nev: 'New Mock Band', stilus_id: 1 };
        const response = await request(app).post('/api/ujzenekar').send(ujZenekar);

        expect(response.statusCode).toBe(201);
        expect(response.body.id).toBe(99);
    });

    test('GET /api/stilusok - Adatbázis hiba szimulálása', async () => {
        // Itt azt teszteljük, hogyan viselkedik az API, ha ELROMLIK az adatbázis
        adatbazis.query.mockImplementation((sql, callback) => {
            callback(new Error('Szimulált SQL hiba'), null);
        });

        const response = await request(app).get('/api/stilusok');

        expect(response.statusCode).toBe(500);
        expect(response.text).toContain('Hiba a lekérdezés során');
    });
});