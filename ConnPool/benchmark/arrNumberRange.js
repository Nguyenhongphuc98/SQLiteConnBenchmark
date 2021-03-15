var fs = require("fs");

let numItem = 1000000;


// Load data into arrays ==========================
var text = fs.readFileSync(`data/genIRange.txt`).toString('utf-8');
// console.log(text)
var textByLine = text.split("\n");
let ranges = []

for (let i = 0; i < textByLine.length; i++) {
    const row = textByLine[i].split(".");
    ranges.push({
        start: row[0],
        end: row[1]
    })
}

module.exports = {ranges};