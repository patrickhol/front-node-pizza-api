/**
 * 
 * Primary file for the API pizza-delivery company. Cluster active
 * 
 */

// Dependencies
const server = require('./lib/server');
const cli = require('./lib/cli');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


const app = {};

// Init function
app.init = () => {
    if (cluster.isMaster) {


        // Start cli last important
        setTimeout(() => {
            cli.init();

        }, 50);
        console.log(`Threet Master ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Threet Master ${worker.process.pid} died`);
        });

    } else {
        // Start the server
        server.init();
        console.log(`Threet child ${process.pid} started`);
    }

};


app.init();

module.exports = app;