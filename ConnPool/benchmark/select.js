
// args: numLoop, numCons, logData

const { ConnectionPool } = require('../ConnectionPool');
const log = require('./writeLog');

const args = process.argv.slice(2);
const numLoop = args[0] ?? 1;
const numCons = args[1] ?? 1;
const logData = args[2] ?? 1;

const message = `>>> Start select ${numLoop} times with num conn: ${numCons}`;
console.log(message);
log.writeHeader(message);

// let numResolve = 0;
// let numFailure = 0;

// Data to compare
let ranges = require('./arrNumberRange');

// console.log(ranges);

const pool = new ConnectionPool('db.sqlite',
    {
        max: numCons,
        acquireTimeoutMillis: 5000000
    },
    {
        busyTimeout: 1000
    }
);

// start to insert ======================
// ======================================
for (let i = 0; i < numLoop; i++) {
    // This test does querie on a 1.000.000 entry table without an index, 
    // thus requiring a full table scan
    const sql = `SELECT count(*), avg(numOfMess) FROM chats WHERE numOfMess>=? AND numOfMess<?`;

    pool.acquire()
        .then(conn => {
            conn.all(sql, [ranges[i].start, ranges[i].end], (err, rows) => {
                if (err) {
                    console.log(err);
                    // numFailure += 1;
                } else {
                    // if (logData) {
                    //     console.log(rows);
                    // }
                    // numResolve += 1;
                }

                pool.release(conn);
            });
        })
}


pool.onFinish = (time) => {
    log.writeLog(time);

    // console.log(`Num resolve: ${numResolve}/${numLoop}`);
    // console.log(`Num failure: ${numFailure}/${numLoop}`);
}
