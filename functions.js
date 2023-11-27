import data from './pokemap_bynum.json' assert { type: 'json' };


const pokemap_bynum = data;
const pokemap_byname = Object.fromEntries(
    Object.entries(pokemap_bynum).map(
        row => row.reverse()
    )
);
const pokemon_ctrl = document.getElementById("pokemon_ctrl")
const numbers_ctrl = document.getElementById("numbers_ctrl")

function toTitleCase(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch {
        return string;
    }
    
}


function update_pokemon() {
    let pokes = [];
    for (let num of numbers_ctrl.value.match(/\d{1,3}|\D*/g)) {
        num = num.trim()
        if (num.length === 0) {
            continue;
        }
        let asInt = parseInt(num)
        // if given a string, use it as is
        if (isNaN(asInt)) {
            pokes.push('"' + num + '"');
        } else {
            let name = toTitleCase(num);
            name = name.replace("-", " ");
            pokes.push(
                toTitleCase(pokemap_bynum[num])
            );
        }
    }
    pokemon_ctrl.value = pokes.join(", ");
    // draw pokemon
    draw_pokemon();
}
numbers_ctrl.oninput = update_pokemon;


function update_numbers() {
    let nums = [];
    for (let name of pokemon_ctrl.value.split(",")) {
        name = name.trim();
        // if given as abs string, use as is
        if (name.match(/".*"/g)) {
            nums.push(
                name.slice(1, -1)
            );
        } else {
            name = name.toLowerCase();
            name = name.replace(" ", "-");
            nums.push(
                pokemap_byname[name]
            );
        }

    }
    numbers_ctrl.value = nums.join("");
    // draw pokemon
    draw_pokemon();
}
pokemon_ctrl.oninput = update_numbers;


function set_sprite(img, name, iteration=0) {
    // define some URLs to try (all the games in inverse order)
    let urls = [
        `https://img.pokemondb.net/sprites/bank/normal/${name}.png`,  // bank has pretty much everything up to gen 6
        `https://img.pokemondb.net/sprites/scarlet-violet/normal/1x/${name}.png`, // scarlet/violet has best coverage of gens 7+
        `https://img.pokemondb.net/sprites/home/normal/1x/${name}.png`, // home has some gen 8s which scar/vi missed
        `https://img.pokemondb.net/sprites/sun-moon/normal/${name}.png`,
    ]
    // if we've tried them all, quit
    if (iteration >= urls.length) {
        img.src = "null.png"
        return
    }
    // setup error behaviour to call this function
    img.onerror = function() {
        set_sprite(img, name, iteration+1)
    }
    img.src = urls[iteration];
}


function draw_pokemon() {
    // clear ctrl
    sprites_ctrl.innerHTML = "";

    for (let rawName of pokemon_ctrl.value.split(",")) {
        // sanitize name
        let name = rawName;
        name = name.trim();
        name = name.toLowerCase();
        name = name.replace(" ", "-");
        // make an image for each name
        if (name in pokemap_byname) {
            let img = document.createElement("img");
            // setup img
            img.style = "width: 128px; height: 128px; object-fit: contain;";
            img.title = name;
            // set sprite
            set_sprite(img, name)
            // append
            sprites_ctrl.appendChild(img);
        } else {
            // add a text element
            let lbl = document.createElement("div");
            // set content
            lbl.innerText = rawName;
            // append
            sprites_ctrl.appendChild(lbl);
        }
    }
}