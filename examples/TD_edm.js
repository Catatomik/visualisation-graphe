const mots_4 = ["aime", "auge", "baie", "brie", "bris", "bure", "cage", "cale", "came", "cape",
"cime", "cire", "cris", "cure", "dame", "dime", "dire", "ducs", "dues", "duos",
"dure", "durs", "fart", "fors", "gage", "gaie", "gais", "gale", "gare", "gars",
"gris", "haie", "hale", "hors", "hure", "iris", "juge", "jure", "kart", "laie",
"lame", "lime", "lire", "loge", "luge", "mage", "maie", "male", "mare", "mari",
"mars", "mere", "mers", "mime", "mire", "mors", "muet", "mure", "murs", "nage",
"orge", "ours", "page", "paie", "pale", "pame", "pane", "pape", "pare", "pari",
"part", "paru", "pere", "pers", "pipe", "pire", "pore", "prie", "pris", "pues",
"purs", "rage", "raie", "rale", "rame", "rape", "rare", "rime", "rire", "sage",
"saie", "sale", "sape", "sari", "scie", "sure", "taie", "tale", "tape", "tare",
"tari", "tige", "toge", "tore", "tors", "tort", "trie", "tris", "troc", "truc"]

function distance(m1, m2) {
    let d = 0;
    for (let i = 0; i < m1.length; i++) {
        if (m1[i] != m2[i]) d++;
    }
    return d;
}

function creation(mots = []) {
    const G = new Graphe();
    for (let x = 0; x < mots.length; x++) {
        G.ajouter_sommet(mots[x]);
        for (let y = x; y < mots.length; y++) {
            if (distance(mots[x], mots[y]) == 1) G.ajouter_arete(mots[x], mots[y]);
        }
    }
    return G;
}