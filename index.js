/*
*
* Primary file for the API
*
*/

// Dependancies
let http = require('http');

// The server should respond to all requests with a string
async function createServerFunc(req,res){
    return await res.end('Hello World\n');
};
let server = http.createServer(createServerFunc);

// Start the server, and have it listen on port 3000
server.listen(3000, ()=>console.log("The server is listening on port 3000 now"));