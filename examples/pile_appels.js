// Exemple de visualisation
// Représentation d'une pile d'appels pour une fonction récursive, affichage sous forme d'arbre requis.

var customOpts = {
    layout: {
        hierarchical: {
            enabled: true,
            sortMethod: 'directed',
            shakeTowards: 'roots'
        }
    }
}

const euros = [1, 2, 5, 10, 20, 50, 100, 200]
const autre = [1, 2, 5]

function creation() {

    let G = new Graphe();

    /**
     * Nombre minimal de pièces à rendre pour la somme s
     * @param {[Number]} pieces Le registre de pièces utilisées
     * @param {Number} s La somme à décomposer
     * @returns {Number}
     */
    (function nb_pieces(pieces, s, parent = s) {
        if (s == 0) return 0
        let nb_a_rendre = s
        pieces = pieces.sort((a, b) => b-a)
        for (const p of pieces) {
            if (s-p >= 0) {
                let ID = `${parent}-${p}` //suivi des appels et unicité du nom des sommets
                G.ajouter_arc(parent, ID)
                nb_a_rendre = Math.min(nb_a_rendre, 1+nb_pieces(pieces, s-p, ID))
            }
        }
        return nb_a_rendre
    })(euros, 7)

    return G

}