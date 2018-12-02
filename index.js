/**
 * 
 * Primary file for the API pizza-delivery company.
 * 
 */

// Dependencies
const server = require('./lib/server');
const cli = require('./lib/cli');


const app = {};

// Init function
app.init = () => {
    // Start the server
    server.init();

    // Start cli last important
    setTimeout(() => {
        cli.init();
    }, 50);

};


app.init();

module.exports = app;