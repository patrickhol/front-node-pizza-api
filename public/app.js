/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
let app = {};

// Config
app.config = {
    sessionToken: false
};

// AJAX Client (for RESTful API)
app.client = {};

// Interface for making API calls
app.client.request = (headers, path, method, queryStringObject, payload, callback) => {
    console.log(headers, path, method, queryStringObject, +'payload' + payload, callback);
    // Set defaults
    headers = typeof headers == 'object' && headers !== null ? headers : {};
    path = typeof path == 'string' ? path : '/';
    method =
        typeof method == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ?
        method.toUpperCase() :
        'GET';
    queryStringObject = typeof queryStringObject == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof payload == 'object' && payload !== null ? payload : {};
    callback = typeof callback == 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    let requestUrl = path + '?';
    let counter = 0;
    for (let queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            // If at least one query string parameter has already been added, preprend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }
            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    // Form the http request as a JSON type
    let xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    // For each header sent, add it to the request
    for (let headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // If there is a current session token set, add that as a header
    if (app.config.sessionToken) {
        xhr.setRequestHeader('token', app.config.sessionToken.id);
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let statusCode = xhr.status;
            let responseReturned = xhr.responseText;

            // Callback if requested
            if (callback) {
                try {
                    let parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponse);
                } catch (e) {
                    callback(statusCode, false);
                }
            }
        }
    };

    // Send the payload as JSON
    let payloadString = JSON.stringify(payload);
    console.log('payloadString: ' + payloadString);
    xhr.send(payloadString);
};

// Bind the logout button
app.bindLogoutButton = function () {
    document.getElementById('logoutButton').addEventListener('click', function (e) {
        // Stop it from redirecting anywhere
        e.preventDefault();

        // Log the user out
        app.logUserOut();
    });
};

// Log the user out then redirect them
app.logUserOut = function () {
    // Get the current token id
    let tokenId = typeof app.config.sessionToken.id == 'string' ? app.config.sessionToken.id : false;

    // Send the current token to the tokens endpoint to delete it
    let queryStringObject = {
        id: tokenId
    };
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function (
        statusCode,
        responsePayload
    ) {
        // Set the app.config token as false
        app.setSessionToken(false);

        // Send the user to the logged out page
        window.location = '/session/deleted';
    });
};

// Bind the forms
app.bindForms = function () {
    let elementsArray = document.querySelectorAll('form');
    if (elementsArray) {
        elementsArray.forEach((elem) => {
            elem.addEventListener('submit', function (e) {
                // Stop it from submitting
                e.preventDefault();
                let formId = this.id;
                let path = this.action;
                let method = this.method.toUpperCase();

                var payload = {};
                if (formId == 'addToCart' || formId.trim() == 'order') {
                    payload = {
                        email: app.config.sessionToken.email
                    };
                }

                var elements = this.elements;

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].type !== 'submit') {
                        // Determine class of element and set value accordingly
                        var classOfElement =
                            typeof elements[i].classList.value == 'string' && elements[i].classList.value.length > 0 ?
                            elements[i].classList.value :
                            '';
                        var valueOfElement =
                            elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ?
                            elements[i].checked :
                            classOfElement.indexOf('intval') == -1 ?
                            elements[i].value :
                            parseInt(elements[i].value);
                        var elementIsChecked = elements[i].checked;
                        // Override the method of the form if the input's name is _method
                        var nameOfElement = elements[i].name;
                        if (nameOfElement == '_method') {
                            method = valueOfElement;
                        } else {
                            // Create an payload field named "method" if the elements name is actually httpmethod
                            if (nameOfElement == 'httpmethod') {
                                nameOfElement = 'method';
                            }
                            // Create an payload field named "id" if the elements name is actually uid
                            if (nameOfElement == 'uid') {
                                nameOfElement = 'id';
                            }
                            // If the element has the class "multiselect" add its value(s) as array elements
                            if (classOfElement.indexOf('multiselect') > -1) {
                                if (elementIsChecked) {
                                    payload[nameOfElement] =
                                        typeof payload[nameOfElement] == 'object' && payload[nameOfElement] instanceof Array ?
                                        payload[nameOfElement] : [];
                                    payload[nameOfElement].push(valueOfElement);
                                }
                            }
                            if (nameOfElement == 'pizzaId' || nameOfElement == 'quantity') {
                                payload[nameOfElement] = parseInt(valueOfElement);
                            } else {
                                payload[nameOfElement] = valueOfElement;
                            }
                        }
                    }
                }

                // If the method is DELETE, the payload should be a queryStringObject instead
                var queryStringObject = method == 'DELETE' ? payload : {};

                // Call the API
                app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode !== 200) {
                        if (statusCode == 403) {
                            // log the user out
                            app.logUserOut();
                        } else {
                            // Try to get the error from the api, or set a default error message
                            let error =
                                typeof responsePayload.Error == 'string' ?
                                responsePayload.Error :
                                'An error has occured, please try again';
                            if (formId !== 'addToCart' || formId !== 'order') {
                                // Set the formError field with the error text
                                document.querySelector('#' + formId + ' .formError').innerHTML = error;

                                // Show (unhide) the form error field on the form
                                document.querySelector('#' + formId + ' .formError').style.display = 'block';
                            }
                        }
                    } else {
                        // If successful, send to form response processor
                        if (formId !== 'addToCart' || formId !== 'order') {
                            app.formResponseProcessor(formId, payload, responsePayload);
                        }
                    }
                });
            });
        });
    }
};

// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
    let functionToCall = false;

    if (formId == 'accountCreate') {
        // Take the email and use it to log the user in
        let newPayload = {
            email: requestPayload.email
        };
        app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function (
            newStatusCode,
            newResponsePayload
        ) {
            // Display an error on the form if needed
            if (newStatusCode !== 200) {
                // Set the formError field with the error text
                document.querySelector('#' + formId + ' .formError').innerHTML =
                    'Sorry, an error has occured. Please try again.';

                // Show (unhide) the form error field on the form
                document.querySelector('#' + formId + ' .formError').style.display = 'block';
            } else {
                // If successful, set the token and redirect the user
                app.setSessionToken(newResponsePayload);
                window.location = '/menu';
            }
        });
    }
    // If login was successful, set the token in localstorage and redirect the user
    if (formId == 'sessionCreate') {
        app.setSessionToken(responsePayload);
        console.log('responsePayload ', responsePayload);

        window.location = '/menu';
    }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function () {
    let tokenString = localStorage.getItem('token');
    if (typeof tokenString == 'string') {
        try {
            let token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if (typeof token == 'object') {
                app.setLoggedInClass(true);
            } else {
                app.setLoggedInClass(false);
            }
        } catch (e) {
            app.config.sessionToken = false;
            app.setLoggedInClass(false);
        }
    }
};

// Sprawdzenie czy sa produkty w koszyku
app.checkForCart = () => {
    // Get the email from the current token, or log the user out if none is there
    let email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;

    if (email) {
        // Fetch the user data
        let queryStringObject = {
            email
        };

        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
            if (statusCode == 200) {
                let cartItem = typeof responsePayload.shoppingCart == 'object' ? responsePayload.shoppingCart : [];

                if (cartItem.length > 0) {
                    let target = document.getElementById('cart');

                    target.classList.add('cartHasItem');
                }
            }
        });
    }
};
// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function (add) {
    let target = document.querySelector('body');
    if (add) {
        target.classList.add('loggedIn');
        app.checkForCart();
    } else {
        target.classList.remove('loggedIn');
    }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function (token) {
    app.config.sessionToken = token;
    let tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    if (typeof token == 'object') {
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);
    }
};

// Renew the token
app.renewToken = function (callback) {
    let currentToken = typeof app.config.sessionToken == 'object' ? app.config.sessionToken : false;
    if (currentToken) {
        // Update the token with a new expiration
        let payload = {
            id: currentToken.id,
            extend: true
        };
        app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode == 200) {
                // Get the new token details
                let queryStringObject = {
                    id: currentToken.id
                };
                app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function (
                    statusCode,
                    responsePayload
                ) {
                    // Display an error on the form if needed
                    if (statusCode == 200) {
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    }
};

// Loop to renew token often 60 seconds
app.tokenRenewalLoop = function () {
    setInterval(function () {
        app.renewToken(function (err) {
            if (!err) {
                console.log('Token renewed successfully @ ' + Date.now());
            }
        });
    }, 1000 * 60);
};

// Init (bootstrapping)
app.init = function () {
    // Bind logout logout button
    app.bindLogoutButton();

    // Get the token from localstorage
    app.getSessionToken();

    // Renew token
    app.tokenRenewalLoop();

    // Load data on page
    app.loadDataOnPage();
    // Bind all form submissions
    app.bindForms();

    app.checkForCart();
};

// Call the init processes after the window loads
window.onload = function () {
    app.init();
};

// Load data on the page
app.loadDataOnPage = () => {
    // Get the current page from the body class
    let bodyClasses = document.querySelector('body').classList;
    let primaryClass = typeof bodyClasses[0] == 'string' ? bodyClasses[0] : false;
    // Logic for cart page
    if (primaryClass == 'cart') {
        app.loadCart();
    }

    // Logic for menu page
    if (primaryClass == 'menu') {
        app.loadMenuPage();
    }
};

// Load the menu page specifically
app.loadMenuPage = () => {
    // Get the email from the current token, or log the user out if none is there
    let email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;

    if (email) {
        // Fetch the user data
        let queryStringObject = {
            email
        };

        app.client.request(
            undefined,
            'api/menuitems',
            'GET',
            queryStringObject,
            undefined,
            (statusCode, responsePayload) => {
                if (statusCode == 200) {
                    let pizzaMenuList = typeof responsePayload.pizzaMenu == 'object' ? responsePayload.pizzaMenu : [];

                    if (pizzaMenuList.length > 0) {
                        for (let i = 0; i < pizzaMenuList.length; i++) {
                            let formAdd =
                                '<div class="formWrapper"> <form id="addToCart" action="/api/shoppingcart" method="POST"><div class="inputWrapper"><div class="inputLabel">Quantity</div> <select class="intval" name="quantity"><option  value="1">1</option> <option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option> <option value="7">7</option><option value="8">8</option> <option value="9">9</option><option value="10">10</option> </select> </div> <div class=" ctaWrapper"><button  type="submit" id="' +
                                (i + 1) +
                                '" class="button">ADD</button><input type="hidden" name="pizzaId" value="' +
                                (i + 1) +
                                '"/> </div> </form> </div>';

                            // Make the pizzaMenu data into a table row
                            let table = document.getElementById('checksListTable');

                            let tr = table.insertRow(-1);
                            tr.classList.add('checkRow');
                            let td0 = tr.insertCell(0);
                            let td1 = tr.insertCell(1);
                            let td2 = tr.insertCell(2);
                            let td3 = tr.insertCell(3);
                            let td4 = tr.insertCell(4);

                            td0.innerHTML = pizzaMenuList[i].pizzaId;
                            td1.innerHTML = pizzaMenuList[i].name;
                            td2.innerHTML = pizzaMenuList[i].size;
                            td3.innerHTML = pizzaMenuList[i].price + ' USD';
                            td4.innerHTML = formAdd;
                        }
                        // Bind bindAddButton
                        app.bindForms();
                    }
                }
            }
        );
    } else {
        app.logUserOut();
    }
};

app.loadCart = function () {
    // Get the email from the current token, or log the user out if none is there
    let email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;

    if (email) {
        // Fetch the user data
        let queryStringObject = {
            email
        };

        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
            if (statusCode == 200) {
                let cartItem = typeof responsePayload.shoppingCart == 'object' ? responsePayload.shoppingCart : [];
                console.log('cartItem ', cartItem);
                if (cartItem.length > 0) {
                    for (let i = 0; i < cartItem.length; i++) {
                        // Make the cart data into a table row
                        let table = document.getElementById('checksListTable');

                        let tr = table.insertRow(-1);
                        tr.classList.add('checkRow');
                        let td0 = tr.insertCell(0);
                        let td1 = tr.insertCell(1);
                        let td2 = tr.insertCell(2);
                        let td3 = tr.insertCell(3);

                        td0.innerHTML = cartItem[i].menuId;
                        td1.innerHTML = cartItem[i].name + ' ' + cartItem[i].size;
                        td2.innerHTML = cartItem[i].quantity;
                        td3.innerHTML = cartItem[i].sum + ' USD';
                    }
                    // Bind bindAddButton
                    app.bindForms();
                }
            }
        });
    } else {
        app.logUserOut();
    }
};