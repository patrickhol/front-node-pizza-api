/**
 *
 * CLI-Related Tasks
 *
 *
 */


const readline = require('readline');
const events = require('events');
class _events extends events {}
let e = new _events();
const _data = require('./data');
const helpers = require('./helpers');

// Instantiate the CLI module object
let cli = {};


// Input handlers

e.on('man', (str) => {
    cli.responders.help();
});

e.on('help', (str) => {
    cli.responders.help();
});
e.on('exit', (str) => {
    cli.responders.exit();
});

e.on('list menu items', (str) => {
    cli.responders.listMenuItems();
});

e.on('all recent orders', (str) => {
    cli.responders.allRecentOrders();
});

e.on("more details order", (str) => {
    cli.responders.moreDetailsOrder(str);
});


// Responders object
cli.responders = {};

// Help  / man
cli.responders.help = () => {
    const commands = {
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'exit': 'Kill the CLI and Application',
        'list menu items': 'SHow list of pizza menu',
        'all recent orders': 'View all the recent orders in the system (orders placed in the last 24 hours)',
        'more details order --{id}': 'Lookup the details of a specific order by order ID',
        'all users signed up': 'View all the users who have signed up in the last 24 hours',
        'more details user': 'Lookup the details of a specific user by email address'
    };
    cli.horizontalLine();
    cli.centered('CLI PIZZA FUN MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace(1);
        }
    }
    cli.verticalSpace(1);
    cli.horizontalLine();
};

cli.verticalSpace = (lines) => {
    lines = typeof lines == 'number' && lines > 0 ? lines : 0;
    for (let i = 0; i < lines; i++) {
        console.log('');
    }
};

cli.horizontalLine = () => {
    // Get the available screen size
    let width = process.stdout.columns;
    let line = '';
    for (let i = 0; i < width; i++) {
        line += '-';
    }
    console.log(line);
};

// Create centered text on the screen
cli.centered = (str) => {
    str = typeof str == 'string' && str.trim().length > 0 ? str.trim() : '';
    // Get the available screen size
    let width = process.stdout.columns;

    // Calculate the left padding there should be
    let leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    let line = '';
    for (let i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
};

cli.responders.exit = () => {
    process.exit(0);
};


cli.responders.listMenuItems = () => {
    _data.list('menuItems', (err, menuData) => {
        if (!err && menuData) {
            menuData.forEach((menuData) => {
                cli.verticalSpace(1);
                _data.read('menuItems', menuData, (err, data) => {
                    if (!err && data) {
                        // console.log(data.pizzaMenu[0].pizzaId);
                        for (let i = 0; i < data.pizzaMenu.length; i++) {
                            // console.log(data);
                            let line =
                                'Pizza ID: ' + data.pizzaMenu[i].pizzaId + ' Name: ' + data.pizzaMenu[i].name + ' Size: ' + data.pizzaMenu[i].size + ' Price: ' + data.pizzaMenu[i].price + ' USD';

                            console.log(line);
                            cli.verticalSpace(1);
                        }

                    }
                });
            });


        }
    });
};

cli.responders.allRecentOrders = () => {
    _data.list('orders', (err, ordersIds) => {
        if (!err && ordersIds && ordersIds.length > 0) {
            cli.verticalSpace();
            ordersIds.forEach((ordersIds) => {
                _data.read('orders', ordersIds, (err, orderData) => {
                    let dataLast24 = Date.now() - (1000 * 60 * 60 * 24);
                    if (!err && orderData && dataLast24 < orderData.time) {

                        let line =
                            'Id: ' + orderData.id + ' Time: ' + orderData.time + ' Amount: ' + orderData.amount;
                        console.log(line);
                        cli.verticalSpace();
                    }
                });
            });
        }
    });
};

cli.responders.moreDetailsOrder = (str) => {
    // Get the ID from the string
    let arr = str.split('--');
    let orderId = typeof arr[1] == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (orderId) {
        // Lookup the user
        _data.read('orders', orderId, (err, orderData) => {
            if (!err && orderData) {


                // Print the JSON object this user
                cli.verticalSpace();
                console.dir(orderData, {
                    colors: true
                });
                cli.verticalSpace();
            }
        });
    }
};

// Input processor
cli.processInput = (str) => {
    str = typeof str == 'string' && str.trim().length > 0 ? str.trim() : false;
    // Only process the input if the user actually wrote something. Otherwise ignore
    if (str) {
        // Codify the unique string that identify the unique questions allowed to be actually
        var uniqueInputs = [
            'man',
            'help',
            'exit',
            'list menu items',
            'all recent orders',
            'more details order',
            'all users signed up',
            'more details user'
        ];

        // Go through the possible inputs, emit an event when a match is found
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some((input) => {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input, and include the full string
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell the user to try again
        if (!matchFound) {
            console.log('Sorry, try again or type "man/help"');
        }
    }
};

// Init script
cli.init = () => {
    // Send the start message
    console.log('\x1b[34m%s\x1b[0m', `The CLI is running`);

    // Start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Admin CLI>'
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on('line', (str) => {
        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associated process
    _interface.on('close', () => {
        process.exit(0);
    });
};

module.exports = cli;