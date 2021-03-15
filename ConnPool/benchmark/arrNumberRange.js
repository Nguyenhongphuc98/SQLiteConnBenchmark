var fs = require("fs");

module.exports = function (numRows) {
    var text = fs.readFileSync(`data/genIRange.txt`).toString('utf-8');
    var textByLine = text.split("\n");
    let ranges = []

    for (let i = 0; i < textByLine.length; i++) {
        const row = textByLine[i].split(".");
        ranges.push({
            start: row[0],
            end: row[1]
        })
    }

    return ranges;
};