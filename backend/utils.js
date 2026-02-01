function szamolAktivEveket(aktivEvekStr) {
    const darabok = aktivEvekStr.split('-');
    const kezdoEv = parseInt(darabok[0]);
    let vegEv;

    // Ha "napjainkig" szerepel, a vizsga szerinti 2025-ös évet használjuk
    if (darabok[1].includes("napjainkig")) {
        vegEv = 2025;
    } else {
        vegEv = parseInt(darabok[1]);
    }

    return vegEv - kezdoEv;
}

module.exports = szamolAktivEveket;