/*
*
* Primary file for the API
*
*/

// Dependancies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string
function trimmedPathFunc(req){
    // Get the URL and parse it
    let parsedUrl = url.parse(req.url,true);

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');
    return trimmedPath;
};

async function createServerFunc(req,res){
    
    // Calling trimmedPathFunc
    let trimmedPath = await trimmedPathFunc(req,res);

    // Get the HTTP Method
    let method = req.method.toUpperCase();

    //Send the response
    res.end('Hello World\n');

    // Log the request path
    console.log('Request received on path: '+trimmedPath+' with this method : '+method);
};
let server = http.createServer(createServerFunc);



// Start the server, and have it listen on port 3000
server.listen(3000, ()=>console.log("The server is listening on port 3000 now"));