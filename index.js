const panier = document.getElementById("panier");
const combinationsDiv = document.getElementById("combinations");

const team1Input = document.getElementById("team1");
const team2Input = document.getElementById("team2");
const addMatchBtn = document.getElementById("addMatchBtn");
const clearPanierBtn = document.getElementById("clearPanierBtn");

const nbCombMatchInput = document.getElementById("nbCombMatch");
const nbParisInput = document.getElementById("nbParis");
const generateBtn = document.getElementById("generateBtn");

// Initialiser paramètres
nbCombMatchInput.value = 0;
nbParisInput.value = 0;

let matchsPanier = [];

// Ajouter un match
addMatchBtn.addEventListener("click", () => {
    const t1 = team1Input.value.trim();
    const t2 = team2Input.value.trim();
    if(!t1 || !t2) return alert("Veuillez entrer les deux équipes.");

    const match = { t1, t2 };
    matchsPanier.push(match);

    // Réinitialiser les champs
    team1Input.value = "";
    team2Input.value = "";

    updatePanier();
});

// Supprimer tous
clearPanierBtn.addEventListener("click", () => {
    matchsPanier = [];
    updatePanier();
    combinationsDiv.innerHTML = "";
    nbCombMatchInput.value = 0;
    nbParisInput.value = 0;
});

// Mettre à jour panier
function updatePanier() {
    panier.innerHTML = "";
    matchsPanier.forEach((m, index) => {
        const div = document.createElement("div");
        div.classList.add("match-item");
        div.innerHTML = `<span>${m.t1} vs ${m.t2}</span> 
                         <button onclick="removeMatch(${index})">X</button>`;
        panier.appendChild(div);
    });
}

// Supprimer un match
window.removeMatch = function(index){
    matchsPanier.splice(index,1);
    updatePanier();
    combinationsDiv.innerHTML = "";
};

// Fonction combinaisons
function matchCombinaison(nbC, nbT){
    const alphabet = [];
    for(let i=65;i<65+nbT;i++){
        alphabet.push(String.fromCharCode(i));
    }

    const generate = (arr,k)=>{
        if(k===0) return [[]];
        if(arr.length<k) return [];

        const [first,...rest] = arr;
        const withFirst = generate(rest,k-1).map(c=>[first,...c]);
        const withoutFirst = generate(rest,k);

        return withFirst.concat(withoutFirst);
    };
    return generate(alphabet,nbC).map(c=>c.join(''));
}

// Bouton générer
generateBtn.addEventListener("click",()=>{
    combinationsDiv.innerHTML = "";
    const nbComb = parseInt(nbCombMatchInput.value);
    const nbParis = parseInt(nbParisInput.value);

    if(nbComb<=0 || nbParis<=0) return alert("Veuillez définir correctement les paramètres.");

    if(nbComb > matchsPanier.length) return alert("Impossible: plus de matchs que disponibles.");

    // Générer toutes combinaisons
    const allComb = matchCombinaison(nbComb, matchsPanier.length);

    const selectedComb = [];
    while(selectedComb.length < Math.min(nbParis, allComb.length)){
        const i = Math.floor(Math.random() * allComb.length);
        if(!selectedComb.includes(allComb[i])){
            selectedComb.push(allComb[i]);
        }
    }

    // Afficher les combinaisons
    selectedComb.forEach(comb=>{
        const combDiv = document.createElement("div");
        combDiv.classList.add("comb-block");

        comb.split("").forEach(i=>{
            const match = matchsPanier[i.charCodeAt(0)-65];
            const matchDiv = document.createElement("div");
            matchDiv.classList.add("match-item");
            matchDiv.textContent = `${match.t1.toUpperCase()} vs ${match.t2.toUpperCase()}`;
            combDiv.appendChild(matchDiv);
        });

        combinationsDiv.appendChild(combDiv);
    });
});