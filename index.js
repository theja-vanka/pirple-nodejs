/*
*
* Primary file for the API
*
*/

// Dependancies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder

// The server should respond to all requests with a string
function trimmedPathFunc(parsedUrl){
    
    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');
    return trimmedPath;

};

async function createServerFunc(req,res){
    
    try {
        
        // Get the URL and parse it
        let parsedUrl = url.parse(req.url,true);

        // Calling trimmedPathFunc
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

        req.on('data', (data)=> {
            buffer += decoder.write(data);
        });

        req.on('end', ()=>{
            buffer += decoder.end();
            
            // Choose the handler this request should go to, If one is not found. use the notFound handler
            let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
            

            // Construct the data object to send to the handler
            let data = {
                'trimmedPath' : trimmedPath,
                'queryStringObject' : queryStringObject,
                'method' : method,
                'headers' : headers,
                'payload' : buffer
            };

            // Route the request to the handler specified in the router
            choosenHandler(data, function(statusCode,payload){
                // Use the status code called back by the handler, or default to 200
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

                // Use the payload called back by the handler, or default to an empty object
                payload = typeof(payload) == 'object' ? payload : {};

                // Convert the payload to a string
                let payloadString = JSON.stringify(payload);

                // Return the response
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

};

let server = http.createServer(createServerFunc);


// Start the server, and have it listen on port 3000
server.listen(3000, ()=>console.log("The server is listening on port 3000 now"));

// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = function(data, callback){
    callback(406,{'name' : 'sample handler'});
};

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};
// Define a request router
let router = {
    'sample' : handlers.sample
}

