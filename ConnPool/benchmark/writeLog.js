var fs = require("fs");
const os = require('os');
const pidusage = require('pidusage');

const fileLog = "benchmark/log.txt";

function writeLog(time) {
    // Time in milisecond
    pidusage(process.pid, function (err, stats) {

        const cpus = os.cpus();
        let user = 0;
        let system = 0;
        let idle = 0;

        cpus.forEach(cpu => {
            user += cpu.times.user;
            system += cpu.times.sys;
            idle += cpu.times.idle;
        })

        const message = `
        time:\t${time}
        user:\t${user}
        sys:\t${system}
        idle:\t${idle}
        percent:\t${stats.cpu}
        mem:\t${stats.memory / 1024 / 1024}
        `;

        //console.log(message);

        fs.appendFile(fileLog, message, function (err) {
            if (err) throw err;
            console.log(message);
        });
    })
};

function writeHeader(header) {
    fs.appendFile(fileLog, header, function (err) {
        if (err) throw err;
        console.log(header);
    });
}

module.exports = { writeLog, writeHeader };