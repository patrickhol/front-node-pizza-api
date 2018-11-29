// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Przydatna do formatowania
const util = require('util');

// Definiowanie handlers
var handlers = {};

/**
 * HTML Handlers
 *
 */

// index handler
handlers.index = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Pizza FUN taste everyday',
            'head.description': 'Pizza is made with old receipt. Eat in or take it.',
            'body.class': 'index'
        };

        // Read in template as a string
        helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniwersalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Favicon
handlers.favicon = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Read in the favicon's data
        helpers.getStaticAsset('favicon.ico', (err, data) => {
            if (!err && data) {
                callback(200, data, 'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

// Public assets
handlers.public = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Get the filename being requested
        let trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, (err, data) => {
                if (!err && data) {
                    // Determine the content type (default to plain text)
                    let contentType = 'plain';
                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }
                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }
                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }
                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }
                    if (trimmedAssetName.indexOf('.js') > -1) {
                        contentType = 'js';
                    }

                    if (trimmedAssetName.indexOf('.svg') > -1) {
                        contentType = 'svg';
                    }
                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            });
        } else {
            callback(404);
        }
    } else {
        callback(405);
    }
};

// Create Account
handlers.accountCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Crate an Account',
            'head.description': 'Singup is easy and only takes a few seconds.',
            'body.class': 'accountCreate'
        };

        // Read in template as a string
        helpers.getTemplate('accountCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniwersalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Create New Session
handlers.sessionCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Login to Your Account',
            'head.description': 'Please enter your phone number and password to access your panel',
            'body.class': 'sessionCreate'
        };

        // Read in template as a string
        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniwersalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Session has been delete
handlers.sessionDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Logged Out',
            'head.description': 'You have been Logged out of your account.',
            'body.class': 'sessionDeleted'
        };

        // Read in template as a string
        helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniwersalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//menu
handlers.menu = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Pizza menu',
            'head.description': 'All pizza select one for you',
            'body.class': 'menu'
        };

        // Read in template as a string
        helpers.getTemplate('menu', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniwersalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//cart
handlers.cart = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Cart',
            'head.description': 'Order Pizza ',
            'body.class': 'cart'
        };

        // Read in template as a string
        helpers.getTemplate('cart', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniwersalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

/**
 *  JSON API Handlers
 *
 */

// Users
handlers.users = (data, callback) => {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Kontener dla users submetod
handlers._users = {};

// Users - Post
// Required data: name, email address, street address
// Optional data: none
handlers._users.post = (data, callback) => {
    // Sprawdzenie wszystkich pól
    const shortName = data.payload.name;
    const shortEmail = data.payload.email;
    const shortStreet = data.payload.street;
    let name = typeof shortName == 'string' && shortName.trim().length > 0 ? shortName.trim() : false;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;
    let street = typeof shortStreet == 'string' && shortStreet.trim().length > 0 ? shortStreet.trim() : false;
    if (name && email && street) {
        // Sprawdzenie czy user juz jest
        _data.read('users', email, (err, data) => {
            if (err) {
                // Create the user object
                let userObject = {
                    name,
                    email,
                    street,
                    shoppingCart: []
                };

                // Store the users
                _data.create('users', email, userObject, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            Error: 'Nie udało się stworzyć usera'
                        });
                    }
                });
            } else {
                // User istnieje
                callback(400, {
                    Error: 'User o tym adresie email istnieje'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Brakuje wymaganych pól'
        });
    }
};

// Required data: email
// Optional data: none
handlers._users.get = function (data, callback) {
    // Check that emial number is valid
    const shortEmail = data.queryStringObject.email;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;

    if (email) {
        // Get token from headers
        var token = typeof data.headers.token == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, function (err, data) {

                    if (!err && data) {
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {
                    Error: 'Missing required token in header, or token is invalid.'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required field'
        });
    }
};

// Users - Put UPDATE
// Required data: email
// Optional data: name, street address (jedno pole musi być określone)
handlers._users.put = (data, callback) => {
    // Sprawdzenie Required data
    const shortEmail = data.payload.email;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;

    // Sprawdzenie Optional data
    const shortName = data.payload.name;
    const shortStreet = data.payload.street;
    let name = typeof shortName == 'string' && shortName.trim().length > 0 ? shortName.trim() : false;
    let street = typeof shortStreet == 'string' && shortStreet.trim().length > 0 ? shortStreet.trim() : false;
    // Error gdy email false
    if (email) {
        // Error gdy nic nie jest wysłane do update
        if (name || street) {
            // Pobranie token z headers
            let token = typeof data.headers.token == 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
                if (tokenIsValid) {
                    // Lookup the User
                    _data.read('users', email, (err, userData) => {
                        if (!err && userData) {
                            // Update file =>>>
                            if (name) {
                                userData.name = name;
                            }
                            if (street) {
                                userData.street = street;
                            }

                            // Store the new Updates
                            _data.update('users', email, userData, (err) => {
                                if (!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500, {
                                        Error: 'Nie mozna updatowac usera'
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                Error: 'Wskazany user nie istnieje'
                            });
                        }
                    });
                } else {
                    callback(403, {
                        Error: 'Missing required token in header, or token is invalid'
                    });
                }
            });
        } else {
            callback(400, {
                Error: 'Brakuje name || street'
            });
        }
    } else {
        callback(400, {
            Error: 'Brakuje emaila'
        });
    }
};

// Users - Delete
// Required data: email
// Optional data: none
handlers._users.delete = (data, callback) => {
    const shortEmail = data.queryStringObject.email;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;
    if (email) {
        // Pobranie token z headers
        let token = typeof data.headers.token == 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('users', email, (err, userData) => {
                    if (!err && userData) {
                        // Remove user data <<<=
                        _data.delete('users', email, (err) => {
                            if (!err) {
                                callback(200);
                            } else {
                                callback(200);
                            }
                        });
                    } else {
                        callback(400, {
                            Error: 'Could not find the specified user'
                        });
                    }
                });
            } else {
                callback(403, {
                    Error: 'Missing required token in header, or token is invalid'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Missing email field'
        });
    }
};

// Tokens
handlers.tokens = (data, callback) => {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Kontener na wszystkie metody tokens
handlers._tokens = {};

// Tokens - post
// Required data: email
// Optional data: none
handlers._tokens.post = (data, callback) => {
    const shortEmail = data.payload.email;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;
    if (email) {
        // Lookup user ktory ma taki nr email
        _data.read('users', email, (err, userData) => {
            if (!err && userData) {
                // If valid, create a new token with a random name. Set expiration date 1 hour in the future
                let tokenId = helpers.createRandomString(20);
                let expires = Date.now() + 1000 * 60 * 60; // 1 godzina
                let tokenObject = {
                    email,
                    id: tokenId,
                    expires: expires
                };

                // Store the token
                _data.create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            Error: 'Could not create the new token'
                        });
                    }
                });
            } else {
                callback(400, {
                    Error: 'Could not find the specified user '
                });
            }
        });
    } else {
        callback(400, {
            Erroe: 'Brakuje wymaganych pól'
        });
    }
};

// Tokens - get
// Wymagane dane: id
// Opcjonalne dane

handlers._tokens.get = function (data, callback) {
    // Check that id is valid
    var id =
        typeof data.queryStringObject.id == 'string' && data.queryStringObject.id.trim().length == 20 ?
        data.queryStringObject.id.trim() :
        false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required field, or field invalid'
        });
    }
};

// Tokens - put
// Wymagane dane: id
// Opcjonalne dane

handlers._tokens.put = (data, callback) => {
    // Sprawdzenie Required data
    var id = typeof data.payload.id == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof data.payload.extend == 'boolean' && data.payload.extend == true ? true : false;
    // Error gdy email false
    if (id && extend) {
        // Lookup the existing token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                // Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new updates
                    _data.update('tokens', id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                Error: "Could not update the token's expiration."
                            });
                        }
                    });
                } else {
                    callback(400, {
                        Error: 'The token has already expired, and cannot be extended.'
                    });
                }
            } else {
                callback(400, {
                    Error: 'Specified user does not exist.'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required field(s) or field(s) are invalid.'
        });
    }
};

// Tokens - delete
// Wymagane dane: id
// Opcjonalne dane: brak
handlers._tokens.delete = (data, callback) => {
    // Sprawdzenie czy ID True
    const shortId = data.payload.id;
    let id = typeof shortId == 'string' && shortId.trim().length == 20 ? shortId.trim() : false;
    if (id) {
        _data.read('tokens', id, (err, data) => {
            if (!err && data) {
                // Remove user data <<<=
                _data.delete('tokens', id, (err, data) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            Error: 'Could not delete the specified token'
                        });
                    }
                });
            } else {
                callback(400, {
                    Error: 'Could not find the specified token'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Missing id field'
        });
    }
};

// Weryfikacja czy obecny id TOKEN jest aktywny dla USERA
handlers._tokens.verifyToken = (id, email, callback) => {
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            // Sprawdzenie czy Token jest przypisany do tej osoby i nie wygasł
            if (tokenData.email == email && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// menuItems
handlers.menuItems = (data, callback) => {
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menuItems[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Kontener dla menuItems metod
handlers._menuItems = {};

// menuItems - GET
// Wymagane dane : pizzaMenu
// Opcjonalne dane : brak
handlers._menuItems.get = (data, callback) => {
    // Sprawdzenie czy email true
    const shortEmail = data.queryStringObject.email;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;

    if (email) {
        // Pobranie token z headers
        let token = typeof data.headers.token == 'string' ? data.headers.token : false;
        // Weryfikacja czy token i email jest true
        handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.list('menuItems', (err, menuData) => {
                    if (!err && menuData) {
                        menuData.forEach((menuData) => {
                            // Read in the menuItems data
                            _data.read('menuItems', menuData, (err, data) => {
                                callback(200, data);
                            });
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(403, {
                    Error: 'Missing required token in header, or token is invalid'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Missing email field'
        });
    }
};

// shoppingCart
handlers.shoppingCart = (data, callback) => {
    var acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._shoppingCart[data.method](data, callback);
    } else {
        callback(405);
    }
};
// Kontener dla shoppingCart metod
handlers._shoppingCart = {};

// shoppingCart - POST
// Wymagane dane : email, pizzaId, quantity
// Opcjonalne dane : brak
handlers._shoppingCart.post = (data, callback) => {
    let log = util.format('Przekazane data to: %o', data);
    console.log(log);
    // // Sprawdzenie Required data
    const shortEmail = data.payload.email;
    let email =
        typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf('@') > -1 ?
        shortEmail.trim() :
        false;

    // Sprawdzenie Optional data
    const shortPizza = data.payload.pizzaId;

    let pizzaId = typeof shortPizza == 'number' && shortPizza > 0 && shortPizza <= 10 ? shortPizza : false;

    const shortQuantity = data.payload.quantity;
    let quantity = typeof shortQuantity == 'number' && shortQuantity > 0 && shortPizza <= 10 ? shortQuantity : false;

    // Error gdy email false
    if (email) {
        // Pobranie token z headers
        let token = typeof data.headers.token == 'string' ? data.headers.token : false;

        handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
            if (tokenIsValid) {
                // Lookup the User
                _data.read('users', email, (err, userData) => {
                    if (!err && userData) {
                        _data.list('menuItems', (err, menuData) => {
                            if (!err && menuData) {
                                menuData.forEach((menuData) => {
                                    // Read in the menuItems data
                                    _data.read('menuItems', menuData, (err, menuDataList) => {
                                        let userShoppingCart = typeof userData.shoppingCart == 'object' ? userData.shoppingCart : {};
                                        let userMenuItem = typeof menuDataList.pizzaMenu == 'object' ? menuDataList.pizzaMenu : false;
                                        let oneItem = {};
                                        if (!userMenuItem) {
                                            callback(500, {
                                                Error: 'Brak menuItems'
                                            });
                                        }

                                        for (let i in userMenuItem) {
                                            if (userMenuItem[i].pizzaId == pizzaId) {
                                                oneItem = userMenuItem[i];
                                            }
                                        }
                                        let orderId = helpers.createRandomString(20);
                                        // Create the shoppingCart object
                                        let userObject = {

                                            cartId: orderId,
                                            menuId: pizzaId,
                                            quantity: quantity,
                                            name: oneItem.name,
                                            size: oneItem.size,
                                            sum: oneItem.price * quantity
                                        };

                                        userData.shoppingCart = userShoppingCart;
                                        userData.shoppingCart.push(userObject);

                                        // Store the users
                                        _data.update('users', email, userData, (err) => {
                                            if (!err) {
                                                callback(200, userData.shoppingCart);
                                            } else {
                                                callback(500, {
                                                    Error: 'Nie udało się dodać pizzy do koszyka'
                                                });
                                            }
                                        });
                                    });
                                });
                            } else {
                                callback(403);
                            }
                        });
                    } else {
                        // User istnieje
                        callback(400, {
                            Error: 'User o tym adresie email istnieje'
                        });
                    }
                });
            } else {
                callback(403, {
                    Error: 'Missing required token in header, or token is invalid'
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Brakuje emaila lub pizzaId'
        });
    }
};


// orders 
handlers.orders = (data, callback) => {
    var acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._orders[data.method](data, callback);
    } else {
        callback(405);
    }
};


// Kontener dla orders metod
handlers._orders = {};

// orders - POST
// Wymagane dane : email,
// Opcjonalne dane : brak
handlers._orders.post = (data, callback) => {
    let log = util.format('Przekazane data to: %o', data);
    console.log(log);
    // Sprawdzenie wszystkich pól
    const shortEmail = data.payload.email;
    let email = typeof shortEmail == 'string' && shortEmail.trim().length > 0 && shortEmail.trim().indexOf("@") > -1 ? shortEmail.trim() : false;
    if (email) {
        let token = typeof data.headers.token == 'string' ? data.headers.token : false;
        // Lookup the user by reading the token
        console.log('token: ' + data.headers.token.id + 'email: ' + email)
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                //Lokup the user data
                _data.read('users', email, (err, userData) => {
                    if (!err && userData) {
                        // Sumowanie koszyka do zamowienia
                        let totalAmount = 0;
                        for (let i in userData.shoppingCart) {
                            totalAmount += userData.shoppingCart[i].sum;
                        }

                        // Description String do zamowienia oraz email
                        let orderDescription = "";
                        for (let i in userData.shoppingCart) {
                            orderDescription += "\nName: " + userData.shoppingCart[i].name + "\nSize: " + userData.shoppingCart[i].size + "\n Quantity: " + userData.shoppingCart[i].quantity + "\nSum: " + userData.shoppingCart[i].sum + " usd";
                        }



                        let userOrders =
                            typeof userData.orders == 'object' && userData.orders instanceof Array ? userData.orders : [];
                        if (userOrders) {
                            let orderId = helpers.createRandomString(20);
                            // Create the order object
                            let orderObject = {
                                email,
                                id: orderId,
                                amount: totalAmount,
                                currency: 'usd',
                                description: orderDescription,
                                source: 'tok_visa',
                                paymentStatus: false
                            };

                            // Save the object
                            _data.create('orders', orderId, orderObject, (err) => {
                                if (!err) {
                                    // Add the order id to the user's object
                                    _data.create('orders', orderId, orderObject, (err) => {
                                        userData.orders = userOrders;
                                        userData.orders.push(orderId);

                                        // Save the new user data
                                        _data.update('users', email, userData, (err) => {
                                            if (!err) {

                                                // Platnosc karta
                                                helpers.sandboxStripe(email, orderObject, (err) => {
                                                    if (!err) {
                                                        orderObject.paymentStatus = true;
                                                        _data.update('orders', orderId, orderObject, (err) => {
                                                            if (!err) {
                                                                helpers.sandboxMailgun(email, orderObject, (err) => {
                                                                    if (!err) {
                                                                        userData.shoppingCart = [];
                                                                        _data.update('users', email, userData, (err) => {
                                                                            if (!err) {




                                                                                callback(200);
                                                                            } else {
                                                                                callback(500, {
                                                                                    Error: "Could not send email Order to sandboxMailgun ",
                                                                                    err
                                                                                });
                                                                            }



                                                                        });



                                                                    } else {
                                                                        callback(500, {
                                                                            Error: "Could not send email Order to sandboxMailgun ",
                                                                            err
                                                                        });
                                                                    }

                                                                });

                                                            }
                                                        });




                                                        // Potwierdzenie wyslane na adress email


                                                    } else {
                                                        callback(500, {
                                                            Error: "Could not send Order to sandboxStripe ",
                                                            err
                                                        });
                                                    }
                                                })


                                            } else {
                                                callback(500, {
                                                    Error: 'Could not update the order'
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    callback(403);
                                }


                            });


                        } else {
                            callback(403);
                        }
                    } else {
                        callback(403);
                    }

                });
            } else {
                callback(403);
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required inputs, or inputs are invalid',
        });
    }
};





module.exports = handlers;