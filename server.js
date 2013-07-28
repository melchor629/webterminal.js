#!/usr/local/bin/node
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var
//Is Admin function
isAdmin = function() {
    return users[user].range === 1;
},
//Commands functions
commands = {
    'cd': function(json) {
        if(query['0'].charAt(0) != '/')
            query['0'] = query['PWD'] + query['0'] + '/';
        if(query['0'].charAt(query[0].length -1) != '/')
            query['0'] = query['0'] + '/';
        try {
            var stat = fs.statSync(query['0']);
        } catch(Exception) {
            var stat = {isDirectory: function(){ return 2; }};
        }
        if(stat.isDirectory() === true) {
            json.respuesta.mensaje = query['0'];
            json.respuesta.res = 0;
        } else if(stat.isDirectory() === false) {
            json.respuesta.mensaje = query[0] + ': Not a directory';
            json.respuesta.res = 1;
        } else if(stat.isDirectory() === 2) {
            json.respuesta.mensaje = query[0] + ': No such file or directory';
            json.respuesta.res = 1;
        }
        return json;
    },
    'ls': function(json) {
        json.respuesta.mensaje = fs.readdirSync(query['0']);
        json.respuesta.res = 0;
        return json;
    },
    'rm': function(json) {
        if(isAdmin()) {
            try {
                var err = fs.unlinkSync(query['0']);
            } catch(Exception) {
                var err = Exception;
            }
            if(err == undefined) {
                json.respuesta.mensaje = true;
                json.respuesta.res = 0;
            } else if(err.errno == 50) {
                json.respuesta.mensaje = query[0] + ': is a directory';
                json.respuesta.res = 1;
            } else if(err.errno == 34) {
                json.respuesta.mensaje = query[0] + ': no such file or directory';
                json.respuesta.res = 1;
            }
        } else {
            json.respuesta.mensaje = 'This command require special magical powers, ' + user;
            json.respuesta.res = 1;
        }
        return json;
    },
    'rmdir': function(json) {
        if(isAdmin()) {
            try {
                var err = fs.rmdirSync(query['0']);
            } catch(Exception) {
                var err = Exception;
            }
            if(err == undefined) {
                json.respuesta.mensaje = true;
                json.respuesta.res = 0;
            } else if(err.errno == 27) {
                json.respuesta.mensaje = query[0] + ': Not a directory';
                json.respuesta.res = 1;
            } else if(err.errno == 34) {
                json.respuesta.mensaje = query[0] + ': no such file or directory';
                json.respuesta.res = 1;
            }
        } else {
            json.respuesta.mensaje = 'This command require special magical powers, ' + user;
            json.respuesta.res = 1;
        }
        return json;
    },
    'login': function(json) {
        if(users[query['0']] && (users[query['0']].password == null || users[query['0']].password == query['password'])) {
            json.respuesta.mensaje = query['0'];
            json.respuesta.res = 0;
        } else if(users[query['0']] === undefined) {
            json.respuesta.mensaje = 'User ' + query["0"] + ' doesn\'t exist';
            json.respuesta.res = 1;
        } else {
            json.respuesta.mensaje = 'Password don\'t match';
            json.respuesta.res = 1;
        }
        return json;
    }
}

//Server
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    var url = req.url,
        comando = url.substr(1, url.indexOf('?') - 2);
    var json = {pedido: {}, respuesta: {}};
        query = qs.parse(url.substr(url.lastIndexOf('?') + 1)),
        user = query['user'],
        users = JSON.parse(fs.readFileSync('lib/users.json', {encoding:'utf-8'}));
    json.pedido.url = url;
    json.pedido.comando = comando;
    json.pedido.query = query;
    console.log(comando + '> ' + query['0'] + ' ≥ ' + (commands[comando] !== undefined));
    if(commands[comando] !== undefined) {
        json = commands[comando](json);
        console.log('OUT: ' + json.respuesta.mensaje);
    } else {
        json.respuesta.mensaje = 'Ese comando no existe…';
        json.respuesta.res = 1;
    }

    res.write(JSON.stringify(json));
    res.end();
}).listen(8080, '0.0.0.0');