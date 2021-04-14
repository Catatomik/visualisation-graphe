// Exemple de visualisation
// Problème simple de routage

function creation() {
    const G = new GraphePondere()
    G.ajouter_arete('A', 'B', 4)
    G.ajouter_arc('B', 'C', 3)
    G.ajouter_arete('C', 'D', 3)
    G.ajouter_arete('D', 'E', 9)
    G.ajouter_arc('E', 'F', 3)
    G.ajouter_arc('F', 'E', 5)
    G.ajouter_arete('F', 'G', 3)
    G.ajouter_arc('G', 'H', 8)
    G.ajouter_arc('H', 'G', 3)
    G.ajouter_arete('H', 'A', 7)
    G.ajouter_arete('B', 'H', 2)
    G.ajouter_arete('B', 'G', 9)
    G.ajouter_arc('C', 'G', 7)
    G.ajouter_arc('G', 'C', 2)
    G.ajouter_arete('D', 'G', 2)
    G.ajouter_arete('D', 'F', 7)
    return G
}