// export 1.000.000 item

var fs = require("fs");

const numRows = 1000000;

// Load data into arrays ==========================
var text = fs.readFileSync(`data/${numRows}.txt`).toString('utf-8');
// console.log(text)
var textByLine = text.split("\n");
let rows = []

for (let i = 0; i < textByLine.length; i++) {
    const row = textByLine[i].split(".");
    rows.push({
        number: row[0],
        text: row[1]
    })
}

module.exports = {rows};