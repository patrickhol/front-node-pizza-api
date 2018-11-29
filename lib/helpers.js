const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const private = require('../.private');

// Kontener dla wszystkiech helpers
var helpers = {};

// Create SHA256 hash
helpers.hash = (str) => {
    if (typeof str == 'string' && str.length > 0) {
        var hash = crypto
            .createHmac('sha256', config.hashingSecret)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases , without throwing
helpers.parseJsonToObject = (str) => {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};
// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (strLength) => {
    strLength = typeof strLength == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the posible characters that could go into a string
        const possibleCharacters = 'abcdefghijklmnopqrstuwxyz0123456789';
        // Start the final string
        let str = '';
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacters string
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        return str;
    } else {
        return false;
    }
};

// Get the string content of a template
helpers.getTemplate = (templateName, data, callback) => {
    templateName = typeof templateName == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) == 'object' && data !== null ? data : {};
    if (templateName) {
        let templatesDir = path.join(__dirname, '/../templates/')
        fs.readFile(templatesDir + templateName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length > 0) {
                // Do interpolation on the string

                let finalString = helpers.interpolate(str, data);

                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        })

    } else {
        callback('A valid template name was not specified');
    }
};

// Add the universal header and footer to a string, and pass provided data object to the headerand footer for the ineterpolation
helpers.addUniwersalTemplates = (str, data, callback) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};
    // Get the header
    helpers.getTemplate('_header', data, (err, headerString) => {
        if (!err && headerString) {
            // Get the footer
            helpers.getTemplate('_footer', data, (err, footerString) => {
                if (!err && footerString) {
                    // Add them all together
                    let fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback("Could not find the footer template");
                }

            })

        } else {
            callback('Could not find the header template');
        }

    })

};



// Take a given string and a data object and find/replace all the key within it
helpers.interpolate = (str, data) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};

    // Add the tempateGlobals do the data object, prepending their key name with "globa"
    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in data object, insert its value into the string at the corresponding place holder
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key]) == 'string') {
            let replace = data[key];
            let find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }
    return str;
};

// Get the contents of a static (public) asset 
helpers.getStaticAsset = (fileName, callback) => {
    fileName = typeof (fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if (fileName) {
        let publicDir = path.join(__dirname, "/../public/");
        fs.readFile(publicDir + fileName, (err, data) => {
            if (!err && data) {
                callback(false, data);

            } else {
                callback("No file could be found");
            }

        })
    } else {
        callback('A valid file name was not specifed');
    }

};


// Integrate with the Sandbox of Stripe.com to accept payment.
helpers.sandboxStripe = (email, orderObject, callback) => {
    email = typeof email == 'string' && email.trim().length > 0 && email.trim().indexOf("@") > -1 ? email.trim() : false;
    orderObject = typeof orderObject == 'object' ? orderObject : false;

    if (email && orderObject) {

        // Configure the request payload
        let payload = {
            'amount': orderObject.amount,
            'currency': orderObject.currency,
            'source': orderObject.source,
            'metadata': {
                'order_id': '6735'
            }

        }

        let stringPayload = querystring.stringify(payload);
        console.log("private.stripApiTestKey: " + private.stripApiTestKey);
        console.log("stringPayload: " + stringPayload)
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.stripe.com',
            'method': 'POST',
            'path': '/v1/charges',
            'auth': private.stripApiTestKey + ':' + private.stripApiPublicKey,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };

        // Instantiate the request object
        let req = https.request(requestDetails, (res) => {
            // Grab the status of the sent request
            let status = res.statusCode;
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            }
        });
        // Bind to the error event so it doesn't get thrown
        req.on('error', (e) => {
            callback(e);
        });
        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();



    } else {
        callback('Given parameters were missing or invalid' +
            orderObject + email);
    }

}

// Integrate with the Sandbox of Mailgun.com
helpers.sandboxMailgun = (email, userOrders, callback) => {
    email = typeof email == 'string' && email.trim().length > 0 && email.trim().indexOf("@") > -1 ? email.trim() : false;
    userOrders = typeof userOrders == 'object' ? userOrders : false;

    if (email && userOrders) {

        // Configure the request payload
        let payload = {
            'from': private.from,
            'to': private.mailgunVerifiedEmail1,
            'to': private.mailgunVerifiedEmail2,
            'subject': "test",
            'text': 'Hi your order id: ' + userOrders.id + '\n\nShopping card:' + userOrders.description + '\n\n Amount: ' + userOrders.amount + ' ' + userOrders.currency + '\n payments method: ' + userOrders.source + '\n payments status: ' + userOrders.paymentStatus,

        }

        let stringPayload = querystring.stringify(payload);

        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.mailgun.net',
            'method': 'POST',
            'path': '/v3/' + private.sandboxMailgun + "/messages",
            'auth': 'api:' + private.mailgunPrivateApiKey,

            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };

        // Instantiate the request object
        let req = https.request(requestDetails, (res) => {

            // Grab the status of the sent request
            let status = res.statusCode;

            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            }
        });
        // Bind to the error event so it doesn't get thrown
        req.on('error', (e) => {
            callback(e);
        });
        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();



    } else {
        callback('Given parameters were missing or invalid' +
            userOrders);
    }

};



module.exports = helpers;