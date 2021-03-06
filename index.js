var http = require("http");
var fs = require("fs");
var path = require("path");
const port = parseInt(process.env.PORT, 10) || 3000;
http
  .createServer(function (request, response) {
    console.log("request ", request.url);

    var filePath = path.join(
      __dirname,
      "view",
      request.url === "/" ? "index.html" : request.url
    );
    if (filePath == "./") {
      filePath = "./view/index.html";
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
      ".json": "application/json",
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".eot": "text/fonts",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };

    var contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", function (error, content) {
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(port);

console.log("Server running at https://obesity-tw.herokuapp.com/");
