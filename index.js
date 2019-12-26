/*
 *
 * Primary file for the API
 *
 */

// Dependancies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config').environmentToExport;
const httpsServerOptions = require('./config').httpsServerOptions;


// Instantiating the HTTP server
async function createServerFunc(req, res) {
    await unifiedServer(req, res);
};

let httpServer = http.createServer(createServerFunc);

// Start the HTTP server
httpServer.listen(config.httpPort, () => console.log("The server is listening on port " + config.httpPort));

// Instantiating the HTTPS server

let httpsServer = https.createServer(httpsServerOptions, createServerFunc);

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => console.log("The server is listening on port " + config.httpsPort));


// All the server logic for both the http and https server
function trimmedPathFunc(parsedUrl) {

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    return trimmedPath;

};

let unifiedServer = async function (req, res) {

    try {

        // Get the URL and parse it
        let parsedUrl = url.parse(req.url, true);

        // Calhttps://stackshare.io/postgres-js?utm_source=weekly_digest&utm_medium=email&utm_campaign=12242019&utm_content=new_toolling trimmedPathFunc
        let trimmedPath = await trimmedPathFunc(parsedUrl);
        // Get the query string as an object
        let queryStringObject = parsedUrl.query;

        // Get the HTTP Method
        let method = req.method.toUpperCase();

        // Get the headers as an object
        let headers = req.headers;

        // Get the payload, if any
        let decoder = new StringDecoder('utf-8');
        let buffer = '';

        req.on('data', (data) => {
            buffer += decoder.write(data);
        });

        req.on('end', () => {
            buffer += decoder.end();

            // Choose the handler this request should go to, If one is not found. use the notFound handler
            let choosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;


            // Construct the data object to send to the handler
            let data = {
                'trimmedPath': trimmedPath,
                'queryStringObject': queryStringObject,
                'method': method,
                'headers': headers,
                'payload': buffer
            };

            // Route the request to the handler specified in the router
            choosenHandler(data, (statusCode, payload) => {
                // Use the status code called back by the handler, or default to 200
                statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

                // Use the payload called back by the handler, or default to an empty object
                payload = typeof (payload) == 'object' ? payload : {};

                // Convert the payload to a string
                let payloadString = JSON.stringify(payload);

                // Return the response
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(statusCode);
                //Send the response
                res.end(payloadString);
                // Log the request path
                console.log('Returning the response : ', statusCode, payloadString);

            });

        });


    } catch (error) {
        console.error(error);
    }
}

// Define the handlers
let handlers = {};

// Hello handler
handlers.hello = (data, callback) => {
    callback(200, {
        'message': 'Hello World'
    });
};

// Ping handler
handlers.ping = (data, callback) => {
    callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};
// Define a request router
let router = {
    'hello': handlers.hello,
    'ping': handlers.ping
}