function makeGraph() {
    return creation();
};

let G;
let nodes;
let edges;
let nw;

function createNodes(G, color) {
    let min;
    let max;
    let colorDict;
    document.getElementById("nb_couleurs").innerHTML = 'ø'
    if (color == "coloration_degre") {
        min = G.sommet_degre_min[1]+1
        max = G.sommet_degre_max[1]+1
        document.getElementById("nb_couleurs").innerHTML = max
    } else if (color == "coloration_gloutonne") {
        colorDict = coloration_gloutonne(G)
        min = Math.min(...Object.values(colorDict))
        max = Math.max(...Object.values(colorDict))
        document.getElementById("nb_couleurs").innerHTML = max+1
    }
    const sommets = G.sommets.map((s, i) => {
        return {
            id: i+1,
            label: s,
            value: G.degre(s)+1,
            color: color == "coloration_gloutonne" ? calcColor(min, max, colorDict[s]) : color == "coloration_degre" ? calcColor(min, max, G.degre(s)) : undefined,
        }
    })
    let nodes = new vis.DataSet(sommets);
    return [sommets, nodes];
}

function updateNodes(G, s = null) {
    if (s == null) {
        document.getElementById("nodes1").innerHTML = ''
        document.getElementById("nodes").innerHTML = ''
        for (let s of G.sommets) {
            const el = document.createElement("option");
            el.setAttribute("value", s)
            document.getElementById("nodes1").appendChild(el);
            document.getElementById("nodes").appendChild(el);
        }
        return
    }
    if (!G.sommets.find(s1 => s1 == s)) {
        document.getElementById("nodes1").innerHTML = ''
        return
    }
    const p = parcours_profondeur(G, s)
    if (!p.includes(document.getElementById("s2").value)) document.getElementById("s2").value = ''
    for (let s1 of p) {
        if (s == s1) continue
        const el = document.createElement("option");
        el.setAttribute("value", s1)
        document.getElementById("nodes1").appendChild(el);
    }
}

function updateSommets(G) {
    document.getElementById("sommets").innerHTML = ''
    const S = G.sommets
    for (let s of S) {
        const el = document.createElement("option");
        el.setAttribute("value", s)
        el.text = s
        document.getElementById("sommets").appendChild(el);
    }
}

function updateSommetInfo(G, highlight = true) {
    const selectBox = document.getElementById("sommets");
    const s = selectBox.options[selectBox.selectedIndex].value;
    document.getElementById('nom').innerHTML = s
    document.getElementById('degre').value = G.degre(s)
    document.getElementById('voisins').innerHTML = G.voisins(s).join(', ')+'.'
    document.getElementById('connexionsN').value = G.connexions(s).length
    document.getElementById('connexions').innerHTML = G.connexions(s).join(', ')+'.'
    if (highlight) nw.selectNodes([nodes.map(n => n).find(n => n.label == s).id], true)
}

function createEdges(G, sommets, plus_court, color) {
    let chemin = []
    document.getElementById("s1").classList.remove('is-invalid')
    document.getElementById("s2").classList.remove('is-invalid')
    document.getElementById("s1").classList.remove('is-valid')
    document.getElementById("s2").classList.remove('is-valid')
    if (plus_court.s1.length && plus_court.s2.length) {
        document.getElementById("status").innerHTML += ` > evaluating shortest path...`
        chemin = chemin_plus_court(G, plus_court.s1, plus_court.s2)
        if (chemin.length < 2) {
            document.getElementById("s1").classList.add('is-invalid')
            document.getElementById("s2").classList.add('is-invalid')
            document.getElementById("length").innerHTML = "ø"
        } else {
            document.getElementById("s1").classList.add('is-valid')
            document.getElementById("s2").classList.add('is-valid')
            document.getElementById("length").innerHTML = chemin.length
        }
    }
    const aretes = [];
    const S = G.sommets;
    for (let x = 0; x < S.length; x++) {
        for (let y = x; y < S.length; y++) {
            if (G.arc(S[x], S[y]) && G.arc(S[y], S[x])) {
                const from = sommets.find(s => s.label == S[x]).id
                const to = sommets.find(s => s.label == S[y]).id
                const fromIndex = chemin.indexOf(S[x])
                const toIndex = chemin.indexOf(S[y])
                const onPath = fromIndex > -1 && toIndex > -1 && (fromIndex == toIndex+1 || fromIndex == toIndex-1)
                aretes.push({
                    from,
                    to,
                    width: onPath ? 5 : 1,
                    color: onPath || !color ? 'black' : undefined,
                })
            }
        }
    }
    let edges = new vis.DataSet(aretes);
    return [aretes, edges];
}

function draw(nodes, edges, containerId, optionsContainerId) {
    let container = document.getElementById(containerId);
    let data = {
        nodes,
        edges,
    };
    let options = {
        nodes: {
            shape: "dot",
            scaling: {
                min: Math.min(...nodes.map(n => n.value)),
                max: Math.max(...nodes.map(n => n.value)),
            },
            font: {
                size: 12,
            },
        },
        edges: {
            smooth: {
                type: document.getElementById("gen_fast").checked ? "continuous" : "dynamic",
            },
        },
        locale: 'fr',
        interaction: {
            hover: true,
        },
        manipulation: {
            enabled: false,
        },
        physics: {
            enabled: true,
            solver: "repulsion",
            repulsion: {
                nodeDistance: 200,
            }
        },
    };
    const network = new vis.Network(container, data, options);
    network.on('stabilizationProgress', (progress) => {
        document.getElementById("status").innerHTML = `stabilizing (${progress.iterations}/${progress.total})...`
    });
    network.on('afterDrawing', () => {
        document.getElementById("status").innerHTML = `done!`
    });
    network.on('click', (e) => {
        if (!e.nodes.length) return;
        const node = e.nodes[0]
        const s = nodes.get(node)
        document.getElementById("sommets").value = s.label
        updateSommetInfo(G, false)
    });
    return network
}

function calcColor(min, max, val) {
    var minHue = 240, maxHue=0;
    var curPercent = (val-min) / (max-min);
    var colString = "hsl(" + ((curPercent * (maxHue-minHue) ) + minHue) + ",100%,50%)";
    return colString;
}