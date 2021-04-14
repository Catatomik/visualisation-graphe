function makeGraph() {
    const G = creation();
    if (G instanceof GraphePondere) document.getElementById("dijkstra").disabled = false
    else document.getElementById("dijkstra").disabled = true
    return G;
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
        document.getElementById("nb_couleurs").innerHTML = max-1
    } else if (color == "coloration_gloutonne") {
        colorDict = coloration_gloutonne(G)
        min = Math.min(...Object.values(colorDict))+1
        max = Math.max(...Object.values(colorDict))+1
        document.getElementById("nb_couleurs").innerHTML = max
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

function updateNodesDOM(G, s = null) {
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

function updateSommetsDOM(G) {
    document.getElementById("sommets").innerHTML = ''
    const S = G.sommets
    for (let s of S) {
        const el = document.createElement("option");
        el.setAttribute("value", s)
        el.text = s
        document.getElementById("sommets").appendChild(el);
    }
}

function updateSommetInfoDOM(G, highlight = true) {
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
    const pondere = G instanceof GraphePondere

    document.getElementById("s1").classList.remove('is-invalid')
    document.getElementById("s2").classList.remove('is-invalid')
    document.getElementById("s1").classList.remove('is-valid')
    document.getElementById("s2").classList.remove('is-valid')

    if (plus_court.s1.length && plus_court.s2.length) {
        
        document.getElementById("status").innerHTML += ` > evaluating shortest path...`

        let modeChemin
        const radios = document.getElementsByName('chemin');
        for (let radio of radios) {
            if (radio.checked) modeChemin = radio.value
        }

        if (modeChemin == 'nb_sommets') chemin = chemin_plus_court(G, plus_court.s1, plus_court.s2)
        else if (modeChemin == 'dijkstra') chemin = dijkstra(G, plus_court.s1, plus_court.s2)

        if (chemin.length < 2) {
            document.getElementById("s1").classList.add('is-invalid')
            document.getElementById("s2").classList.add('is-invalid')
            document.getElementById("length").innerHTML = "ø"
            document.getElementById("cost").innerHTML = "ø"
        } else {
            document.getElementById("s1").classList.add('is-valid')
            document.getElementById("s2").classList.add('is-valid')
            document.getElementById("length").innerHTML = chemin.length-1
            if (modeChemin == 'dijkstra') {
                let cost = 0
                for (let i = 0; i < chemin.length-1; i++) {
                    cost += G.poids[`${chemin[i]}-${chemin[i+1]}`]
                }
                document.getElementById("cost").innerHTML = cost
            }
            else document.getElementById("cost").innerHTML = "ø"
        }
    }

    const aretes = [];
    const S = G.sommets;
    
    for (let x = 0; x < S.length; x++) {
        for (let y = 0; y < S.length; y++) {
            if (G.arc(S[x], S[y])) {

                const from = sommets.find(s => s.label == S[x]).id
                const to = sommets.find(s => s.label == S[y]).id
                if (G.arete(S[x], S[y]) && !pondere && aretes.find(a => a.from == to && a.to == from)) continue

                const fromIndex = chemin.indexOf(S[x])
                const toIndex = chemin.indexOf(S[y])
                const onPath = fromIndex > -1 && toIndex > -1 && (fromIndex == toIndex-1)

                aretes.push({
                    from,
                    to,
                    arrows: G.arete(S[x], S[y]) && !pondere ? undefined : 'to',
                    width: onPath ? 5 : 1,
                    color: onPath || !color ? 'black' : undefined,
                    label: pondere ? String(G.poids[`${S[x]}-${S[y]}`]) : undefined,
                    //value: pondere ? G.poids[`${S[x]}-${S[y]}`] : undefined,
                })

            }
        }
    }
    console.log(aretes)
    let edges = new vis.DataSet(aretes);
    return [aretes, edges];
}

function draw(nodes, edges, containerId) {
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
            scaling: {
                min: Math.min(...edges.map(n => n.value)),
                max: Math.max(...edges.map(n => n.value)),
                label: false,
            },
            font: {
                align: "middle",
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
        updateSommetInfoDOM(G, false)
    });
    return network
}

function calcColor(min, max, val) {
    var minHue = 240, maxHue=0;
    var curPercent = (val-min) / (max-min);
    var colString = "hsl(" + ((curPercent * (maxHue-minHue) ) + minHue) + ",100%,50%)";
    return colString;
}