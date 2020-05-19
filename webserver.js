var http = require("http");

http.createServer(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "Text/plain"
    });
    res.end("xin chao tuan anh");
}).listen(8080);