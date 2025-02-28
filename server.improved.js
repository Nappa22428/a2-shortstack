const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  {
    game: "Tetris",
    dateBought: "08-15-01",
    dateCompleted: "08-15-01",

  },
  {
    game: "Tetris",
    dateBought: "08-15-01",
    dateCompleted: "08-15-01",

  },
];

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") 
    {
      sendFile(response, "public/index.html");
    } else if (request.url === "/public/js/scripts.js") 
    {
      sendFile(response, "public/js/scripts.js");
    } else if (request.url === "/public/css/style.css") 
    {
      sendFile(response, "public/css/style.css");
    } else if (request.url === "/submit") 
    {
      response.writeHeader(200, { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    } else 
    {
      sendFile(response, filename);
    }
};
const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )
    let jsonData = JSON.parse(dataString);
    console.log(jsonData + "1");
    
     if (request.url === "/submit") {
      console.log(jsonData);
      appdata.push(jsonData); 
    }
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
