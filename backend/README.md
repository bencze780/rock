# Rock Zenekarok - Backend Unit Teszt Dokumentáció

Ez a dokumentum a backend oldali üzleti logika tesztelését írja le, különös tekintettel a `szamolAktivEveket` segédfüggvényre. A projekt a 13. évfolyamos szoftverfejlesztő és -tesztelő szakmai vizsga felkészüléséhez készült.

## 1. A tesztelt funkció: `szamolAktivEveket`

A `utils.js` fájlban található függvény feladata, hogy egy szöveges formátumban tárolt időintervallumból (adatbázis mező) kiszámolja a zenekar aktív éveinek számát.

### Működési logika
A bemeneti string formátuma általában: `"KEZDŐÉV-VÉGÉV"` (pl. `"1980-1990"`).

1. **Szétválasztás:** A függvény a kötőjel (`-`) mentén darabolja a szöveget.
2. **Kezdőév:** A tömb első eleme (`darabok[0]`).
3. **Végév meghatározása:**
   - **Lezárt időszak:** Ha konkrét évszám szerepel (pl. `1991`), akkor azt használja.
   - **Aktív zenekar:** Ha a szöveg tartalmazza a `"napjainkig"` kifejezést, akkor a vizsgafeladatban meghatározott **2025**-ös évet tekinti a jelenlegi évnek.
4. **Eredmény:** `Végév - Kezdőév`.

## 2. Tesztesetek (`utils.test.js`)

A teszteléshez a **Jest** keretrendszert használjuk. A `utils.test.js` két reprezentatív esetet vizsgál, amelyek lefedik a lehetséges ágakat (branch coverage).

### 1. eset: Lezárt időszak (pl. Queen)
- **Bemenet:** `"1970-1991"`
- **Logika:** A zenekar már feloszlott.
- **Számítás:** `1991 - 1970`
- **Elvárt eredmény:** `21`

### 2. eset: Jelenleg is aktív zenekar
- **Bemenet:** `"1973-napjainkig"`
- **Logika:** A zenekar még működik. A "napjainkig" kulcsszó miatt a végév automatikusan **2025**.
- **Számítás:** `2025 - 1973`
- **Elvárt eredmény:** `52`

## 3. Tesztek futtatása

A tesztek futtatásához a backend könyvtárban add ki a következő parancsot:

```bash
npm test
```

*A dokumentáció a szoftverfejlesztő és -tesztelő technikus vizsgakövetelmények alapján készült.*
