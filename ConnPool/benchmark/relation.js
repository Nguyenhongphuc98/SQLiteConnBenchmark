
// args: command, index

const { ConnectionPool} = require('../ConnectionPool');

const pool = new ConnectionPool('db.sqlite');

var args = process.argv.slice(2);
const command = args[0];
const index = args[1];

switch (command) {
    case 'create':
        init();
        break;
    case 'destroy':
        destroy();
        break;
    case 'clear':
        clear();
        break;
    default:
        console.log('nothing');
}

function run(conn, sql, params = []) {
    conn.run(sql, params, err => {
        if (err) {
            console.log(err);
        }

        console.log(`Did ${command} chats table`);
        pool.release(conn);
    })
}

function init() {
    const sql = `
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            numOfMess INTEGER,
            description TEXT,
            createdAt TEXT
        )`;

    pool.acquire()
        .then(conn => {
            run(conn, sql);
            if (index === 'index') {
                const indexSql = 'CREATE INDEX idx_des ON chats (description)';
                run(conn, indexSql);
            }
        })
}

function destroy() {
    const sql = `DROP TABLE IF EXISTS chats`;

    pool.acquire()
        .then(conn => {
            run(conn, sql);
        })
}

function clear() {
    const sql = `DELETE FROM chats`;

    pool.acquire()
        .then(conn => {
            run(conn, sql);
        })
}

pool.onFinish = () => {
    console.log(`on finished`);
}