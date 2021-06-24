/**
 * @description Parcourt en profondeur le graphe G à partir du sommet S
 * @param {Graphe} G Le graphe à parcourir
 * @param {String} s Le sommet duquel partir
 * @returns {Array} Les sommets parcourus
 */
 function parcours_profondeur(G, s) {
    const s_coches = []
    const p = new Stack()
    p.stack(s)
    while (!p.isEmpty) {
        s = p.unstack()
        if (!s_coches.includes(s)) s_coches.push(s)
        const voisins = G.voisins(s).filter(v => !s_coches.includes(v))
        for (let v of voisins) {
            p.stack(v)
        }
    }
    return s_coches
}

/**
 * Vérifier l'existence d'un chemin entre s et t sur le graphe G
 * @param {Graphe} G Graphe sur lequel vérifier l'existence du chemin
 * @param {String} s Sommet source
 * @param {String} t Sommet destination
 * @returns {Boolean}
 */
function existe_chemin(G, s, t) {
    const p = parcours_profondeur(G, s)
    return p.includes(t)
}

/**
 * Parcourir en largeur un graphe
 * @param {Graphe} G Le graphe à parcourir en largeur
 * @param {String} depart Le sommet duquel partir
 * @returns {{}} Les sommets parcourus en largeur
 */
function parcours_largeur(G, depart) {
    const file_courante = new Queue()
    const file_suivante = new Queue()
    file_courante.enqueue(depart)
    let d = 0
    let s_coches = { [depart]: d }
    while (!file_courante.isEmpty) {
        const s = file_courante.dequeue()
        for (let v of G.voisins(s).filter(v => !(v in s_coches))) {
            s_coches[v] = d+1
            file_suivante.enqueue(v)
        }
        if (file_courante.isEmpty) {
            for (let i = 0; i < file_suivante.length; i++) file_courante.enqueue(file_suivante.dequeue())
            d += 1
        }
    }
    return s_coches
}

/**
 * Parcourir en largeur un graphe
 * @param {Graphe} G Le graphe à parcourir en largeur
 * @param {String} depart Le sommet duquel partir
 * @returns {{}} Les sommets parcourus en largeur, la clé est la source et la valeur la destination
 */
function arcs_parcourus_largeur(G, depart) {
    const file_courante = new Queue()
    const file_suivante = new Queue()
    file_courante.enqueue(depart)
    let arcs_coches = { [depart]: null }
    while (!file_courante.isEmpty) {
        const s = file_courante.dequeue()
        for (let v of G.voisins(s).filter(v => !Object.keys(arcs_coches).includes(v))) {
            arcs_coches[v] = s
            file_suivante.enqueue(v)
        }
        if (file_courante.isEmpty) {
            for (let i = 0; i < file_suivante.length; i++) file_courante.enqueue(file_suivante.dequeue())
        }
    }
    return arcs_coches
}

/**
 * Trouver le chemin le plus court partant du sommet d arrivant au sommet a dans le graphe G
 * @param {Graphe} G Graphe source
 * @param {String} d Le sommet départ
 * @param {String} a Le sommet arrivée
 * @returns {String[]}
 */
function chemin_plus_court(G, d, a) {
    const parcours = arcs_parcourus_largeur(G, d)
    let ch = []
    while (a != null) {
        ch = [a, ...ch]
        a = parcours[a]
    }
    return ch
}

/**
 * Trouver une coloration, assez optimisée, du graphe G
 * @param {Graphe} G Le graphe à colorer
 * @returns {{}}
 */
function coloration_gloutonne(G) {
    let coloration = {}
    for (let s of G.sommets) {
        const voisins = G.connexions(s)
        let i = -1
        while (!voisins.every(v => coloration[v] != i) || i < 0) {
            i++
        }
        coloration[s] = i
    }
    return coloration
}

/**
 * @description Retourne la clé de la plus petite valeur d'un objet
 * @param {Object} obj L'objet
 * @returns {String}
 */
function min(obj) {
    return Object.keys(obj).sort((a, b) => obj[a][0]-obj[b][0])[0]
}

/**
 * Trouver le chemin optimal partant du sommet d arrivant au sommet a dans le graphe pondéré G
 * @param {GraphePondere} G Graphe source
 * @param {String} d Le sommet départ
 * @param {String} a Le sommet arrivée
 * @returns {String[]}
 */
function dijkstra(G, d, a) {
    let totales = {}
    let partielles = G.sommets.reduce((o, s) => { return { ...o, [s]: [Infinity, undefined] } }, {})
    partielles[d] = [0, null]
    while (Object.keys(partielles).length > 0) {
        let s = min(partielles)

        const adj = G.voisins(s).filter(s1 => !(s1 in totales))
        const distances = adj.reduce((o, s1) => { return { ...o, [s1]: [partielles[s][0]+G.poids(s, s1), s] } }, {})

        for (let s1 in distances) {
            if (distances[s1][0] < partielles[s1][0]) {
                partielles[s1] = distances[s1]
            }
        }

        totales[s] = partielles[s]
        delete partielles[s]
    }

    let chemin = []
    while (a != null) {
        chemin = [a, ...chemin]
        a = totales[a][1]
    }
    return chemin
}