const fs = require('fs');

// Data which will need to add in a file. 
let data = '';

const max = 1000000;
for (let i = 1; i < max; i++) {
    const end = Math.floor(Math.random()*max);
    const start =Math.floor(Math.random()*end) - 1;
    data += `${start}.${end}\n`;
}
 
fs.writeFile('genIRange.txt', data, (error) => {

    // In case of a error throw err exception. 
    if (error) throw err;
}) 