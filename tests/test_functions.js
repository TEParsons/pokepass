 /*
 * Test that missingno is only used when necessary
 */
// list of values and what they should result in
let cases = [
    // some unavoidable missingnos...
    ["012", "Missingno, Butterfree"],  // starts with a 0
    ["123 012", "Scyther, Missingno, Butterfree"], // requests split via spaces with unavoidable 0 start
    ["123 0 321", "Scyther, Missingno, Wailord"],  // zero flanked by spaces
    ["ash0ketchum", "\"ash\", Missingno, \"ketchum\""], // is just a 0
    // pokemon related phone numbers (just for fun)
    ["+44 3456050247", "\"+\", Gloom, Lileep, Poliwag, Dewott, Parasect"],  // Nintendo Europe
    ["+1 8002553700", "\"+\", Bulbasaur, Necrozma, Torchic, Venusaur, Sylveon"],  // Nintendo America
    ["+81 756629600", "\"+\", Magnemite, Shiinotic, Vullaby, Klang"], // Nintendo Japan
    // one last value to clear the controls
    ["", ""]
];
// get ctrls
const pokemon_ctrl = document.getElementById("pokemon_ctrl")
const numbers_ctrl = document.getElementById("numbers_ctrl")
// assume pass unless told otherwise
let success = true;
// iterate through cases
for (let this_case of cases) {
    // set num ctrl and update pokemon
    numbers_ctrl.value = this_case[0];
    numbers_ctrl.oninput();
    // if values don't match...
    if (pokemon_ctrl.value != this_case[1]) {
        // raise error with info
        console.error(
            `Tried: ${this_case[0]}\nExpected: ${this_case[1]}\nGot: ${pokemon_ctrl.value}`
        );
        // mark as failed
        success = false;
    }
}
// if no errors, print success
if (success) {
    console.log("Missingno test completed successfully!")
}