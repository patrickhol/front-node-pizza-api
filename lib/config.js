/*
 * zmienne konfiguracyjne
 *
 */

const environments = {};

// Staging(default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'dev',
    hashingSecret: 'thisIsASecret',
    templateGlobals: {
        'appName': 'Pizza API',
        'companyName': 'Pizza FUN',
        'yearCreated': '2018',
        'baseUrl': 'http://127.0.0.1:3000/'
    }
};

// Production environments
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsASecret',
    templateGlobals: {
        'appName': 'Pizza API',
        'companyName': 'Pizza FUN',
        'yearCreated': '2018',
        'baseUrl': 'http://127.0.0.1:3000/'
    }
};

// Sprawdzenie który env przeszedł
const currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Default setting Staging
const environmentToExport =
    typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;