const szamolAktivEveket = require('./utils');

describe('Aktív évek számítása', () => {
    
    // 1. eset: Lezárt időszak
    test('Lezárt időszak (pl. Queen)', () => {
        expect(szamolAktivEveket("1970-1991")).toBe(21);
    });

    // 2. eset: Jelenleg is aktív zenekar
    test('Aktív zenekar (napjainkig -> 2025)', () => {
        const bemenet = "1973-napjainkig";
        const elvart = 52; // 2025 - 1973
        expect(szamolAktivEveket(bemenet)).toBe(elvart);
    });
});