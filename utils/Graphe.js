class Graphe {

    constructor() {
        this.adj = {}
    }

    /**
     * @description Ajoute un sommet au Graphe
     * @param {String} s Un sommet du graphe
     * @returns {Graphe}
     */
    ajouter_sommet(s) {
        if (!(s in this.adj)) this.adj[s] = []
        return
    }

    /**
     * @description Ajoute un arc entre deux sommets s1 et s2
     * @param {String} s1 Un sommet du graphe
     * @param {String} s2 Un sommet du graphe
     * @returns {Graphe}
     */
    ajouter_arc(s1, s2) {
        this.ajouter_sommet(s1)
        this.ajouter_sommet(s2)
        this.adj[s1].push(s2)
        return this
    }

    /**
     * @description Ajouter une arête entre deux sommets s1 et s2
     * @param {String} s1 Un sommet du graphe
     * @param {String} s2 Un sommet du graphe
     * @returns {Graphe}
     */
    ajouter_arete(s1, s2) {
        this.ajouter_arc(s1, s2)
        this.ajouter_arc(s2, s1)
        return this
    }

    /**
     * @description Vérifie l'existence d'un arc entre s1 et s2
     * @param {String} s1 Un sommet du graphe
     * @param {String} s2 Un sommet du graphe
     * @returns {Boolean}
     */
    arc(s1, s2) {
        return this.adj[s1].includes(s2)
    }

    /**
     * @description Les sommets du graphe
     * @returns {Array<String>}
     */
    get sommets() {
        return Object.keys(this.adj)
    }

    /**
     * L'odre du graphe
     * @returns {Number}
     */
    get ordre() {
        return this.sommets.length
    }

    /**
     * @description Renvoie les voisins du sommet s
     * @param {String} s Un sommet du graphe
     * @returns {Array<String>}
     */
    voisins(s) {
        return this.adj[s] || []
    }

    /**
     * @description Renvoie le degré du sommet s
     * @param {String} s Un sommet du graphe
     * @returns {Number}
     */
    degre(s) {
        return this.voisins(s).length
    }

    /**
     * @description Le nombre d'arcs dans le graphe
     * @returns {Number}
     */
    get nbArcs() {
        return this.sommets.reduce((acc, v) => acc+this.degre(v), 0)
    }

    /**
     * @description Le nombre d'arcs à double sens dans le graphe
     * @returns {Number}
     */
    get nbArcsDbSens() {
        let c = 0 
        const S = this.sommets
        for (let x = 0; x < S.length; x++) {
            for (let y = x; y < S.length; y++) {
                if (this.arc(S[x], S[y]) && this.arc(S[y], S[x])) c += 1
            }
        }
        return c
    }

    /**
     * @description Une liste comprenant le sommet dont le dregré est le plus grand dans le graphe, et son degré
     * @returns {Array}
     */
    get sommet_degre_max() {
        let max = [null, 0]
        for (let s of this.sommets) {
            if (max[1] < this.degre(s)) max = [s, this.degre(s)]
        }
        return max
    }

    /**
     * @description Une liste comprenant le sommet dont le dregré est le plus grand dans le graphe, et son degré
     * @returns {Array}
     */
     get sommet_degre_min() {
        let min = [null, Infinity]
        for (let s of this.sommets) {
            if (min[1] > this.degre(s)) min = [s, this.degre(s)]
            if (min[1] == 0) break
        }
        return min
    }

    /**
     * @description Une liste comprenant les sommets ayant une connexion (source ou destination) avec le sommet s
     * @param {String} s Un sommet du graphe
     * @returns {Array}
     */
    connexions(s) {
        let l = this.voisins(s)
        for (let s1 of this.sommets) {
            if (this.voisins(s1).includes(s) && !l.includes(s1)) l.push(s1)
        }
        return l
    }

}