
// args: numRows, numCons

const { ConnectionPool } = require('../ConnectionPool');
const log = require('./writeLog');

var args = process.argv.slice(2);
const numRows = args[0];
const numCons = args[1];

// Data to insert
let rows = require('./arrNumberString')(numRows);

// Log info
const message = `>>> Start insert ${numRows} records with num conn: ${numCons}`;
console.log(message);
log.writeHeader(message);


// Start to insert ========================== 
// ==========================================
const pool = new ConnectionPool('db.sqlite',
    {
        max: numCons,
        acquireTimeoutMillis: 180000
    },
    {
        busyTimeout: 7000
    }
);

const sql = `INSERT INTO chats 
    (name, numOfMess, description, createdAt)
    VALUES(?, ?, ?, datetime('now'))`;

for (let i = 0; i < numRows; i++) {
    pool.acquire()
        .then(conn => {
            conn.run(sql, ['name' + i, rows[i].number, rows[i].text], (err) => {
                if (err) {
                    //numFailure += 1;
                    console.log(err);
                } else {
                    //numResolve += 1;
                }

                pool.release(conn);
            });
        })
}

// var cpu = osu.cpu;
// var mem = osu.mem;
pool.onFinish = (time) => {
    // cpu.usage()
    //     .then(info => {
    //         console.log(`CPU: ${info} %`);
    //     })
    // mem.used()
    //     .then(info => {
    //         console.log(`MEM: ${info.usedMemMb} MB`);
    //     })

    // pidusage(process.pid, function (err, stats) {
    //     // console.log(stats)
    //     //console.log(stats.cpu +'-' + stats.memory / 1024 / 1024)
    //     console.log(stats.cpu);
    //     console.log(stats.memory / 1024 / 1024);
    // })

    // console.log(`Num resolve: ${numResolve}/${numRows}`);
    // console.log(`Num failure: ${numFailure}/${numRows}`);

    log.writeLog(time);
}

