var http = require('http');
var fs = require('fs');
var qs = require('querystring');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    var url = req.url,
        comando = url.substr(1, url.indexOf('?') - 2);
    var json = {pedido: {}, respuesta: {}};
        query = qs.parse(url.substr(url.lastIndexOf('?') + 1));
    json.pedido.url = url;
    json.pedido.comando = comando;
    json.pedido.query = query;
    switch(comando) {
        case 'cd':
            try {
                var stat = fs.statSync(query['0']);
            } catch(Exception) {
                var stat = {isDirectory: function(){ return 2; }};
            }
            if(stat.isDirectory() === true) {
                json.respuesta.mensaje = stat;
                json.respuesta.res = 0;
            } else if(stat.isDirectory() === false) {
                json.respuesta.mensaje = 'Not a directory';
                json.respuesta.res = 1;
            } else if(stat.isDirectory() === 2) {
                json.respuesta.mensaje = 'No such file or directory';
                json.respuesta.res = 1;
            }
            break;
        case 'ls':
            json.respuesta.mensaje = fs.readdirSync(query['0']);
            json.respuesta.res = 0;
            break;
        default:
            json.respuesta.mensaje = 'Ese comando no existe…';
            json.respuesta.res = 1;
    }
    res.write(JSON.stringify(json));
    res.end();
    //console.log(req);
}).listen(8080, '0.0.0.0');