
// args: numLoop, numCons, logData

var fs = require("fs");
var pidusage = require('pidusage')
const { ConnectionPool } = require('../ConnectionPool');

var args = process.argv.slice(2);
// const str = args[0] ?? 0;
const numLoop = args[0] ?? 1;
const numCons = args[1] ?? 1;
const logData = args[2] ?? 1;

console.log(`>>> Start run ${numLoop} times with num conn: ${numCons}`);


let numResolve = 0;
let numFailure = 0;


// Load data into arrays ==========================
var text = fs.readFileSync(`data/genIRange.txt`).toString('utf-8');
// console.log(text)
var textByLine = text.split("\n");
let rows = []

for (let i = 0; i < textByLine.length; i++) {
    const row = textByLine[i].split(".");
    rows.push({
        start: row[0],
        end: row[1]
    })
}

const pool = new ConnectionPool('db.sqlite',
    {
        max: numCons,
        acquireTimeoutMillis: 5000000
    },
    {
        busyTimeout: 1000
    }
);

// start to insert
for (let i = 0; i < numLoop; i++) {
    // This test does querie on a 1.000.000 entry table without an index, 
    // thus requiring a full table scan
    const sql = `SELECT count(*), avg(numOfMess) FROM chats WHERE numOfMess>=? AND numOfMess<?`;

    pool.acquire()
        .then(conn => {
            conn.all(sql, [rows[i].start, rows[i].end], (err, rows) => {
                if (err) {
                    console.log(err);
                    numFailure += 1;
                } else {
                    // if (logData) {
                    //     console.log(rows);
                    // }
                    numResolve += 1;
                }

                pool.release(conn);
            });
        })
}


pool.onFinish = () => {
    pidusage(process.pid, function (err, stats) {
        console.log(stats.cpu +'-' + stats.memory / 1024 / 1024)
    })

    // console.log(`Num resolve: ${numResolve}/${numLoop}`);
    // console.log(`Num failure: ${numFailure}/${numLoop}`);
}
