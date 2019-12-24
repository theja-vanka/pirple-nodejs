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
            
            //Send the response
            res.end('Hello World\n');

            // Log the request path
            console.log('Request received with this payload', buffer);
        
        });

        
    } catch (error) {
        console.error(error);
    }

};

let server = http.createServer(createServerFunc);


// Start the server, and have it listen on port 3000
server.listen(3000, ()=>console.log("The server is listening on port 3000 now"));