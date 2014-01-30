var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var os = require('os');
var version = 'v.0.3';

var
//Is Admin function
isAdmin = function() {
    return users[user].range === 1;
},
//File help functions
exists = function(file) {
    return fs.existsSync(file);
},
isDir = function(file) {
    return fs.statSync(file).isDirectory();
},
isFile = function(file) {
    return fs.statSync(file).isFile();
},
//Commands functions
commands = {
    'cd': function(json) {
        var stat;
        if(query['0'].charAt(0) != '/')
            query['0'] = query.PWD + query['0'] + '/';
        if(query['0'].charAt(query[0].length -1) != '/')
            query['0'] = query['0'] + '/';
        try {
            stat = fs.statSync(query['0']);
        } catch(Exception) {
            stat = {isDirectory: function(){ return 2; }};
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
        var out, err;
        try {
            out = fs.readdirSync(query['0']);
        } catch(Exception) {
            err = Exception;
        }
        if(out) {
            json.respuesta.mensaje = out;
            json.respuesta.res = 0;
        } else if(err) {
            json.respuesta.mensaje = query[0] + ': Permission denied';
            json.respuesta.res = 1;
        }
        return json;
    },
    'rm': function(json) {
        if(isAdmin()) {
            var err;
            try {
                err = fs.unlinkSync(query.PWD + query['0']);
            } catch(Exception) {
                err = Exception;
            }
            if(err === undefined) {
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
            if(query.recursive === "") {
                var remdir = function(dir) {
                    ls = fs.readdirSync(dir);
                    for (var i = ls.length - 1; i >= 0; i--) {
                        try {
                            fs.unlinkSync(dir + '/'+  ls[i]);
                        } catch(err) {
                            if(err.errno == 50)
                                remdir(dir + '/' + ls[i]);
                        }
                    }
                    fs.rmdirSync(dir);
                };
                remdir(query.PWD + query['0']);
                json.respuesta.mensaje = true;
                json.respuesta.mensaje = 0;
            } else {
                var err;
                try {
                    err = fs.rmdirSync(query.PWD + query['0']);
                } catch(Exception) {
                    err = Exception;
                }
                if(err === undefined) {
                    json.respuesta.mensaje = true;
                    json.respuesta.res = 0;
                } else if(err.errno == 27) {
                    json.respuesta.mensaje = query[0] + ': Not a directory';
                    json.respuesta.res = 1;
                } else if(err.errno == 34) {
                    json.respuesta.mensaje = query[0] + ': no such file or directory';
                    json.respuesta.res = 1;
                } else {
                    json.respuesta.mensaje = query[0] + ': ' + err.toString();
                    json.respuesta.res = 1;
                }
            }
        } else {
            json.respuesta.mensaje = 'This command require special magical powers, ' + user;
            json.respuesta.res = 1;
        }
        return json;
    },
    'touch': function(json) {
        if(isAdmin()) {
            try {
                fs.writeFileSync(query.PWD + query[0], '');
            } catch(Exception) {
                var err = Exception;
            }
            if(err === undefined) {
                json.respuesta.mensaje = true;
                json.respuesta.res = 0;
            } else {
                json.respuesta.mensaje = err.toString();
                json.respuesta.res = 1;
            }
        } else {
            json.respuesta.mensaje = 'This command require special magical powers, ' + user;
            json.respuesta.res = 1;
        }
        return json;
    },
    'mkdir': function(json) {
        if(isAdmin()) {
            try {
                fs.mkdirSync(query.PWD + query[0]);
            } catch(Exception) {
                var err = Exception;
            }
            if(err === undefined) {
                json.respuesta.mensaje = true;
                json.respuesta.res = 0;
            } else {
                json.respuesta.mensaje = err.toString();
                json.respuesta.res = 1;
            }
        } else {
            json.respuesta.mensaje = 'This command require special magical powers, ' + user;
            json.respuesta.res = 1;
        }
        return json;
    },
    'cat': function(json) {
        var out;
        if(exists(query.PWD + query['0']) && isFile(query.PWD + query['0'])) {
            out = fs.readFileSync(query['0'], {encoding: 'utf-8'});
            out = out.replace(/&/g, '&amp;').replace(/</g, '&lt;');
            out = out.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            out = out.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
            json.respuesta.mensaje = out;
            json.respuesta.res = 0;
        } else if(!exists(query.PWD + query['0'])) {
            json.respuesta.mensaje = query['0'] + ': no such file or directory';
            json.respuesta.res = 1;
        } else if(isDir(query.PWD + query['0'])) {
            json.respuesta.mensaje = query['0'] + ': Is a directory';
            json.respuesta.res = 1;
        }
        return json;
    },
    'login': function(json) {
        if(users[query['0']] && (users[query['0']].password === null || users[query['0']].password == query['password'])) {
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
};

//Server
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Server': 'node.js (' + process.version + ') ' + os.platform() + ' ' + os.arch() + ' ' + os.release()});
    var url = req.url,
        comando = url.substr(1, url.indexOf('?') - 2);
    var json = {pedido: {}, respuesta: {}};
        query = qs.parse(url.substr(url.lastIndexOf('?') + 1)),
        user = query['USER'],
        users = JSON.parse(fs.readFileSync('lib/users.json', {encoding:'utf-8'}));
    json.pedido.url = url;
    json.pedido.comando = comando;
    json.pedido.query = query;
    console.log(comando + ' > ' + query['0'] + ' ≥ ' + (commands[comando] !== undefined));
    if(commands[comando] !== undefined) {
        json = commands[comando](json);
        if(process.argv[2] === '--debugOut' || process.argv[3] === '--debugOut')
            console.log('-> ' + json.respuesta.mensaje);
    } else {
        json.respuesta.mensaje = '-bash: ' + comando + ': command not found';
        json.respuesta.res = 0;
    }

    res.write(JSON.stringify(json));
    res.end();
}).listen(8080, '0.0.0.0');

console.log('webterminal.js node server script ' + version);
console.log('node.js (' + process.version + ') ' + os.type() + ' ' + os.arch() + ' ' + os.release());

//Simple HTTP Server for avoid Chrome problems
if(process.argv[2] === '--http' || process.argv[3] === '--http') {
    var port = 80;
    if((process.argv[2] && process.argv[3]) || (process.argv[3] && process.argv[4]))
        port = parseInt(process.argv[3] | process.argv[4], 10);
    var server = http.createServer().listen(port, 'localhost');
    console.log('Local http server running at http://localhost:'+port+'/');
    server.on('request', function(req, res) {
        if(req.method === "GET") {
            req.url = req.url.replace('/', './');
            if(req.url === "./") req.url = './webterminal.html';
            var file_contents;
            try {
                file_contents = fs.readFileSync(os.type().indexOf('Windows') !== -1 ? req.url.replace(/\//g, '\\') : req.url, 'utf-8');
            } catch(e) {
                res.statusCode = 404;
                res.end('<h1>Error 404 | Page not found</h1><br><p>'+req.url+'</p>');
                console.log('HTTP > ' + req.url + ' (' + 404 + ')');
                return;
            }
            var mime = 'text/plain';
            res.setHeader('Access-Control-Allow-Origin', 'all');
            if(req.url.lastIndexOf('.') !== -1) {
                var ext = req.url.substr(req.url.lastIndexOf('.') +1);
                if(ext === 'html' || ext === 'htm')
                    mime = 'text/html';
                if(ext === 'js')
                    mime = 'text/javascript';
                if(ext === 'css')
                    mime = 'text/stylesheet';
                if(ext === 'json')
                    mime = 'text/json';
            }
            res.setHeader('Content-type', mime + '; charset=utf-8');
            res.end(file_contents);
            console.log('HTTP > ' + req.url + ' (' + mime + ')');
        }
    });
}
console.log('');
