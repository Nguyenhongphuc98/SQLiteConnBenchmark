// export 1.000.000 item

var fs = require("fs");

module.exports = function (numRows) {
    var text = fs.readFileSync(`data/${numRows}.txt`).toString('utf-8');
    var textByLine = text.split("\n");
    let rows = []

    for (let i = 0; i < textByLine.length; i++) {
        const row = textByLine[i].split(".");
        rows.push({
            number: row[0],
            text: row[1]
        })
    }
    return rows;
};