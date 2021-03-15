
// args: numLoop, numCons, readPercentm, logData

const pidusage = require('pidusage');
const { ConnectionPool } = require('../ConnectionPool');

var args = process.argv.slice(2);
const numLoop = args[0] ?? 1;
const numCons = args[1] ?? 1;
const readPercent = args[2] ?? 0.5;
// const logData = args[3] ?? 0;

console.log(`>>> Start run ${numLoop} times with num conn: ${numCons}, read percent: ${readPercent}`);

const pool = new ConnectionPool('db.sqlite', { max: numCons });

// Load data
const {rows} = require('./arrNumberString');
const {ranges} = require('./arrNumberRange');

for (let i = 0; i < numLoop; i++) {
    const ran = Math.random();

    if (ran <= readPercent) {
        const sql = `SELECT count(*), avg(numOfMess) FROM chats WHERE numOfMess>=? AND numOfMess<?`;
        pool.acquire()
            .then(conn => {
                all(conn, sql, [ranges[i].start, ranges[i].end]);
            })
    } else {
        const sql = `INSERT INTO chats 
        (name, numOfMess, description, createdAt)
        VALUES(?, ?, ?, datetime('now'))`;

        pool.acquire()
            .then(conn => {
                run(conn, sql, ['name' + i,rows[i].number, rows[i].text]);
            })
    }
}

function all(conn, sql, params = []) {
    conn.all(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
        }

        // if (logData) {
        //     console.log(rows);
        // }
        pool.release(conn);
    });
}

function run(conn, sql, params = []) {
    conn.run(sql, params, (err) => {
        if (err) {
            console.log(err);
        }

        pool.release(conn);
    });
}

pool.onFinish = () => {

    pidusage(process.pid, function (err, stats) {
        // console.log(stats)
        console.log(stats.cpu);
        console.log(stats.memory / 1024 / 1024);
    })
}
