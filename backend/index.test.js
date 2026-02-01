const request = require('supertest');
const { app, adatbazis } = require('./index');

// Környezeti változó beállítása a logok némításához
process.env.NODE_ENV = 'test';

describe('Rock Zenekarok API Tesztcsomag', () => {
    
    // Tesztek után lezárjuk az adatbázis kapcsolatot, hogy a Jest ki tudjon lépni
    afterAll((done) => {
        adatbazis.end(done);
    });

    describe('GET /api/zenekar', () => {
        it('Vissza kell adnia a zenekarok listáját', async () => {
            const res = await request(app).get('/api/zenekar');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            
            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('nev');
                expect(res.body[0]).toHaveProperty('tagok');
            }
        });
    });

    describe('GET /api/stilusok', () => {
        it('Vissza kell adnia az elérhető zenei stílusokat', async () => {
            const res = await request(app).get('/api/stilusok');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            if (res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('stilus_neve');
            }
        });
    });

    describe('POST /api/ujzenekar és DELETE', () => {
        let testBandId;

        it('Létre kell hoznia egy új teszt zenekart', async () => {
            const ujZenekar = {
                nev: "Teszt Rockers " + Date.now(),
                stilus_id: 1,
                orszag: "TestCountry",
                varos: "TestCity",
                aktiv_evek: "2024-",
                tagok: "Teszt Elek, Próba Pál",
                legsikeresebb_album: "Greatest Hits",
                kep_url: "http://example.com/image.jpg"
            };

            const res = await request(app)
                .post('/api/ujzenekar')
                .send(ujZenekar);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            testBandId = res.body.id;
        });

        it('Törölnie kell a létrehozott teszt zenekart', async () => {
            if (!testBandId) return;
            const res = await request(app).delete(`/api/zenekar/${testBandId}`);
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('Sikeres törlés');
        });
    });
});