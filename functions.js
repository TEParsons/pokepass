import data from './pokemap_bynum.json' assert { type: 'json' };


const pokemap_bynum = data;
const pokemap_byname = Object.fromEntries(
    Object.entries(pokemap_bynum).map(
        row => row.reverse()
    )
);
const pokemon_ctrl = document.getElementById("pokemon_ctrl")
const numbers_ctrl = document.getElementById("numbers_ctrl")
const random_btn = document.getElementById("random_btn")

function toTitleCase(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch {
        return string;
    }
    
}


function update_pokemon() {
    let pokes = [];
    for (let num of numbers_ctrl.value.match(/0|[123456789]\d{0,2}(?!0)|\D*/g)) {
        num = num.trim()
        // skip blank entries
        if (num.length === 0) {
            continue;
        }
        // parse to an integer
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
    // handle missingno (special case)
    if (name === "missingno") {
        img.src = "https://static.wikia.nocookie.net/slenderfortressnonofficial/images/d/d8/MissingNo..png";
        return
    }
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
            lbl.innerText = rawName.replaceAll('"', "");
            // append
            sprites_ctrl.appendChild(lbl);
        }
    }
}


function randomise_numbers() {
    // pick 3 pokemon
    let ndigits = 0;
    let vals = [];
    while (ndigits < 9) {
        let this_num = String(Math.round(Math.random()*1000));
        vals.push(this_num);
        ndigits += this_num.length;
    }
    // add one of each char type
    let lowers = "abcdefghijklmnopqrstuvwxyz";
    let uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let specials = "~`!@#$%^&*()_-+={[}]|:;'<,>.?/"
    let i
    i = Math.floor(Math.random() * lowers.length);
    vals.push(lowers[i]);
    i = Math.floor(Math.random() * uppers.length);
    vals.push(uppers[i]);
    i = Math.floor(Math.random() * specials.length);
    vals.push(specials[i]);
    ndigits += 3;
    // add more random chars until we're at 12 chars
    let chars = lowers + uppers + specials
    while (ndigits < 14) {
        i = Math.floor(Math.random() * chars.length);
        vals.push(chars[i]);
        ndigits += 1;
    }
    // shuffle
    vals = vals.sort( () => .5 - Math.random() );
    // join and set
    numbers_ctrl.value = vals.join("");
    // update pokemon
    update_pokemon();
}
random_btn.onclick = randomise_numbers;