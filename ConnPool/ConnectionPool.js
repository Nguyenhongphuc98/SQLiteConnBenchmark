const EventEmitter = require('events');
const genericPool = require('generic-pool');
const sqlite3 = require('sqlite3');

const CommandType = {
    ALL: 'all',
    GET: 'get',
    RUN: 'run'
}

const ConnectionMessage = {
    OPEN: 'open',
    ERR: 'err',
    SUCCESS: 'success',
    ALL: 'all',
    GET: 'get',
    RUN: 'run'
}

class ConnectionPool extends EventEmitter {

    constructor(filename = ':memory:', poolOptions = {}, sqliteOption = {}) {
        super();

        this.totalWork = 0;
        this.numProcessed = 0;

        // Setup config pool infos
        Object.assign(this,
            {
                min: 1,
                max: 4,
                acquireTimeoutMillis: 1000
            }, poolOptions);

        // Setup config sqlite infos
        Object.assign(this,
            {
                filename,
                openMode: null,
                verbose: false,
                busyTimeout: 1000, // ms
                foreignKeys: true,
                walMode: true,
            }, sqliteOption);


        if (filename === '' || filename === ':memory:') {
            this.min = 1;
            this.max = 1;
        }

        this._poolFactory = {
            create: () => this._create(),
            destroy: connector => this._destroy(connector),
        };

        this._pool = genericPool.createPool(this._poolFactory,
            {
                min: this.min,
                max: this.max,
                acquireTimeoutMillis: this.acquireTimeoutMillis
            });

        this._pool.on('factoryCreateError', err => this.emit('error', err));
        this._pool.on('factoryDestroyError', err => this.emit('error', err));
    }

    _create() {
        let sqliteOpts = {
            fileName: this.filename,
            openMode: this.openMode,
            verbose: this.verbose,
            busyTimeout: this.busyTimeout,
            foreignKeys: this.foreignKeys,
            walMode: this.walMode,
        }

        return new Promise((resolve, reject) => {

            let connection
            const callback = (err) => {
                if (err) {
                    reject(err)
                }
                // connection did created success
                // config connection
                if (sqliteOpts.verbose) {
                    connection.verbose();
                    connection.on('trace', (...args) => this.emit('trace', ...args));
                    connection.on('profile', (...args) => this.emit('profile', ...args));
                }

                connection.configure('busyTimeout', sqliteOpts.busyTimeout);

                if (sqliteOpts.foreignKeys) {
                    connection.exec('PRAGMA foreign_keys = ON;');
                }

                if (sqliteOpts.walMode) {
                    connection.exec('PRAGMA journal_mode = WAL;');
                }

                return resolve(connection);
            }
            
            if (sqliteOpts.openMode !== null) {
                connection = new sqlite3.Database(sqliteOpts.fileName, sqliteOpts.openMode, callback);
            } else {
                connection = new sqlite3.Database(sqliteOpts.fileName, callback);
            }
        })
    }

    _destroy(connection) {
        return new this.Promise((resolve, reject) => {
            const callback = (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            }
            
            connection.close(callback);
        });
    }

    release(connection) {
        this.numProcessed += 1;
        if (this.numProcessed === this.totalWork) {
            console.timeEnd('pool');
            this.onFinish();
        }
        return this._pool.release(connection);
    }

    close() {
        return this._pool.drain()
            .then(function () {
                // Terminate all the available resources in pool 
                // before any timeouts they might have are reached
                return this._pool.clear();
            });
    }

    acquire() {
        if (this.totalWork === 0) {
            console.time('pool');
        }
        this.totalWork += 1;
        
        return this._pool.acquire();
    }
}

module.exports = { ConnectionPool, CommandType, ConnectionMessage };
