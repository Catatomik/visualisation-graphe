class GraphePondere extends Graphe {

    constructor() {
        super()
        this._poids = {}
    }

    /**
     * @description Ajoute un arc entre deux sommets s1 et s2
     * @param {String} s1 Un sommet du graphe
     * @param {String} s2 Un sommet du graphe
     * @param {Number} p Le poids de cet arc
     * @returns {Graphe}
     */
    ajouter_arc(s1, s2, p) {
        super.ajouter_arc(s1, s2)
        this._poids[`${s1}-${s2}`] = p
        return this
    }

    /**
     * @description Ajouter une arête entre deux sommets s1 et s2
     * @param {String} s1 Un sommet du graphe
     * @param {String} s2 Un sommet du graphe
     * @param {Number} p Le poids de cet arc
     * @returns {Graphe}
     */
     ajouter_arete(s1, s2, p) {
        this.ajouter_arc(s1, s2, p)
        this.ajouter_arc(s2, s1, p)
        return this
    }

    poids(s1, s2) {
        if (!this.arc(s1, s2)) throw new Error("Invalid nodes")
        return this._poids[`${s1}-${s2}`]
    }

}