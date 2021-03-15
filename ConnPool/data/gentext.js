const fs = require('fs');
const converter = require('number-to-words');

var args = process.argv.slice(2);
const numRows = args[0];

// Data which will need to add in a file. 
let data = '';

for (let i = 1; i <= numRows; i++) {
    data += `${i}.${converter.toWords(i)}\n`;
}

// Write data in 'number.txt' . 
fs.writeFile(`data/${numRows}.txt`, data, (error) => {

    // In case of a error throw err exception. 
    if (error) throw err;
}) 

// let data2 = '';
// for (let i = 5000001; i <= 10000000; i++) {
//     data2 += `${i}.${converter.toWords(i)}\n`;
// }

// fs.appendFile('10-000-000.txt', data2, function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
  