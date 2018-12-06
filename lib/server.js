/* 
 * Server -related 
 *
 */


const config = require('./config');
const http = require('http');
const https = require('https');
const hostname = '127.0.0.1';
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

const server = {};

// Instancja http
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});

// Instancja https
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// Cała logika dla połączenia http i https
server.unifiedServer = (req, res) => {
    // Ustawienie hosta
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    // Pobranie url i parsowanie
    const parsedUrl = url.parse(req.url, true);

    // Pobranie sciezki
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Pobranie ciągu zapytań
    const queryStringObject = parsedUrl.query;

    // Pobranie metody HTTP
    let method = req.method.toLowerCase();

    // Pobranie HEAD jako objekt
    const headers = req.headers;

    // Pobranie payload jeśli jest jakieś
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Wybierz handler do jakiego ządanie ma zostać wysłane. Jeśli brak to wybierz nothandlers.notFound
        let chosenHandler = typeof server.router[trimmedPath] !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;


        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Konstrukcja obiektu do wysłania do handler
        const data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the server.router
        chosenHandler(data, (statusCode, payload, contentType) => {
            // Setermine the type of response (fallback JSON)
            contentType = typeof contentType == 'string' ? contentType : 'json';

            // Uzycie statusCode
            statusCode = typeof statusCode === 'number' ? statusCode : 200;


            // Return the response parts that are content specific
            let payloadString = '';
            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json'); // Pretty w Postman pokazuje JSON w kolorach ;)
                payload = typeof payload === 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }
            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof payload == 'string' ? payload : '';
            }
            if (contentType == 'favicon') {
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof payload !== 'undefined' ? payload : '';
            }
            if (contentType == 'css') {
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof payload !== 'undefined' ? payload : '';
            }
            if (contentType == 'js') {
                res.setHeader('Content-Type', 'application/x-javascript');
                payloadString = typeof payload !== 'undefined' ? payload : '';
            }
            if (contentType == 'png') {
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof payload !== 'undefined' ? payload : '';
            }
            if (contentType == 'jpg') {
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof payload !== 'undefined' ? payload : '';
            }
            if (contentType == 'svg') {
                res.setHeader('Content-Type', 'image/svg+xml');
                payloadString = typeof payload == 'string' ? payload : '';
            }
            if (contentType == 'plain') {
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof payload == 'string' ? payload : '';
            }

            res.writeHead(statusCode);
            res.end(payloadString);

            if (statusCode == 200) {
                console.log('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode+' PID: ' +process.pid);

            } else {
                console.log('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            }


        });


    });
};

// Definiowanie routingu
server.router = {
    '': handlers.index,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'account/create': handlers.accountCreate,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'menu': handlers.menu,
    'cart': handlers.cart,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/menuitems': handlers.menuItems,
    'api/shoppingcart': handlers.shoppingCart,
    'api/orders': handlers.orders,



};

// Init script
server.init = () => {
    //Start serwera http
    server.httpServer.listen(config.httpPort, hostname, () => {
        console.log('\x1b[36m%s\x1b[0m', `Serwer słucha ${hostname}:${config.httpPort} in ${config.envName} mode`);
    });

    // Start serwera https
    server.httpsServer.listen(config.httpsPort, hostname, () => {
        console.log('\x1b[36m%s\x1b[0m', `Serwer słucha ${hostname}:${config.httpsPort} in ${config.envName} mode`);
    });
};


module.exports = server;