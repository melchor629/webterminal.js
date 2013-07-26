/*!
 * webterminal.js v0.1
 * http:// ...
 * 
 * Copyright 2013, Melchor Garau
 * This content is released under the MIT license
 * http://markdalgleish.mit-license.org
 */

;(function($, window, document, undefined) {
    var
    version = 'v0.1',
    pluginName = 'webterminal',
    lines = 0,
    line = $(".consola-line")[lines-1],
    /*chars = {
        81: 'q',
        87: 'w',
        69: 'e',
        82: 'r',
        84: 't',
        89: 'y',
        85: 'u',
        73: 'i',
        79: 'o',
        80: 'p',
        65: 'a',
        83: 's',
        68: 'd',
        70: 'f',
        71: 'g',
        72: 'h',
        74: 'j',
        75: 'k',
        76: 'l',
        186: 'ñ',
        220: 'ç',
        90: 'z',
        88: 'x',
        67: 'c',
        86: 'v',
        66: 'b',
        78: 'n',
        77: 'm',
        32: ' ',
        190: '.',
        188: ',',
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
        222: "'",
        187: '¡',
        189: '-'
    },
    shift_chars = {
        81: 'Q',
        87: 'W',
        69: 'E',
        82: 'R',
        84: 'T',
        89: 'Y',
        85: 'U',
        73: 'I',
        79: 'O',
        80: 'P',
        65: 'A',
        83: 'S',
        68: 'D',
        70: 'F',
        71: 'G',
        72: 'H',
        74: 'J',
        75: 'K',
        76: 'L',
        186: 'Ñ',
        220: 'Ç',
        90: 'Z',
        88: 'X',
        67: 'C',
        86: 'V',
        66: 'B',
        78: 'N',
        77: 'M',
        32: ' ',
        190: ':',
        188: ';',
        48: '=',
        49: '!',
        50: '"',
        51: '·',
        52: '$',
        53: '%',
        54: '&',
        55: '/',
        56: '(',
        57: ')',
        191: '?',
        187: '¿',
        189: '_'
    },
    alt_chars = {
        220: '}',
        190: '…',
        188: '„',
        48: '≠',
        49: '|',
        50: '@',
        51: '#',
        52: '¢',
        53: '∞',
        54: '¬',
        55: '÷',
        56: '“',
        57: '”',
        189: "=",
        191: '´',
        187: '‚',
        222: '{',
        219: '[',
        221: ']'
    },*/
    chars = {
        'q': "U+0051",
        'w': "U+0057",
        'e': "U+0045",
        'r': "U+0052",
        't': "U+0054",
        'y': "U+0059",
        'u': "U+0055",
        'i': "U+0049",
        'o': "U+004F",
        'p': "U+0050",
        'a': "U+0041",
        's': "U+0053",
        'd': "U+0044",
        'f': "U+0046",
        'g': "U+0047",
        'h': "U+0048",
        'j': "U+004A",
        'k': "U+004B",
        'l': "U+004C",
        'ñ': "U+00F1",
        'ç': "U+00E7",
        'z': "U+005A",
        'x': "U+0058",
        'c': "U+0043",
        'v': "U+0056",
        'b': "U+0042",
        'n': "U+004E",
        'm': "U+004D",

        ' ': "U+0020",
        '.': "U+002E",
        ',': "U+002C",
        '0': "U+0030",
        '1': "U+0031",
        '2': "U+0032",
        '3': "U+0033",
        '4': "U+0034",
        '5': "U+0035",
        '6': "U+0036",
        '7': "U+0037",
        '8': "U+0038",
        '9': "U+0039",
        '\'': "U+0027",
        '¡': "U+00A1",
        '-': "U+002D"
    },
    shiftChars = {
        'Q': "U+0051",
        'W': "U+0057",
        'E': "U+0045",
        'R': "U+0052",
        'T': "U+0054",
        'Y': "U+0059",
        'U': "U+0055",
        'I': "U+0049",
        'O': "U+004F",
        'P': "U+0050",
        'A': "U+0041",
        'S': "U+0053",
        'D': "U+0044",
        'F': "U+0046",
        'G': "U+0047",
        'H': "U+0048",
        'J': "U+004A",
        'K': "U+004B",
        'L': "U+004C",
        'Ñ': "U+00F1",
        'Ç': "U+00E7",
        'Z': "U+005A",
        'X': "U+0058",
        'C': "U+0043",
        'V': "U+0056",
        'B': "U+0042",
        'N': "U+004E",
        'M': "U+004D",
        //Mac
        ' ': "U+0020",
        ':': "U+003A",
        ';': "U+003B",
        '=': "U+003D",
        '!': "U+0021",
        '"': "U+0022",
        '·': "U+00B7",
        '$': "U+0024",
        '%': "U+0025",
        '&': "U+0026",
        '/': "U+002F",
        '(': "U+0028",
        ')': "U+0029",
        '?': "U+003F",
        '¿': "U+00BF",
        '_': "U+005F",
        //Windows/Linux
        ':': "U+00BE",
        ';': "U+00BC",
        '=': "U+0030",
        '!': "U+0031",
        '"': "U+0032",
        '·': "U+0033",
        '$': "U+0034",
        '%': "U+0035",
        '&': "U+0036",
        '/': "U+0037",
        '(': "U+0038",
        ')': "U+0039",
        '?': "U+00DB",
        '¿': "U+00DD",
        '_': "U+00BD"
    },
    altChars = {
        '–': 'U+002D',
        '…': 'U+002E',
        '„': 'U+002C',
        '≠': 'U+0030',
        '|': 'U+0031',
        '@': 'U+0032',
        '#': 'U+0033',
        '¢': 'U+0034',
        '∞': 'U+0035',
        '¬': 'U+0036',
        '÷': 'U+0037',
        '“': 'U+0038',
        '”': 'U+0039',
        '´': 'U+0027',
        '‚': 'U+00A1',
        '[': 'Unidentified',
        ']': 'U+002B',
        '{': 'Unidentified',
        '}': 'U+00E7',
        '\\': 'U+00BA',
        //Windows
        '[': 'U+00BA',
        ']': 'U+00BB',
        '{': 'U+00DE',
        '}': 'U+00BF'
    },
    conf = {
        server: false,      //Tells if we will use a server script for special commands such 'ls'
        script: '',      //Tells what type of script will use
        phpscript: '/'      //If we use php script, tell where in the server is the script ex: for `http://localhost/webterminal/server.php` the value will be '/webterminal/'
    },
    env = {
        "TERM_PROGRAM": window.navigator.userAgent,
        "SHELL": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)) + "webterminal.js",
        "USER": "root",
        "PWD": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1))
    },
    shell = {
        "help": function(c) {
            if (c[1] === undefined) {
                print("webterminal, version " + version + " (" + window.navigator.userAgent + ")");
                print($.webterminal.idioma.shell.help[1]);
                print($.webterminal.idioma.shell.help[2]);
                print($.webterminal.idioma.shell.help[3]);
                $.each(help, function(a, b){
                    print("&nbsp;" + a + " " + b[0]);
                });
            } else if (c[1] !== undefined && help[c[1]] !== undefined) {
                b = help[c[1]];
                print(c[1] + ": " + b[0]);
                print(b[1]);
            } else if(help[c[1]] === undefined)
                print($.webterminal.idioma.shell.help['noHelp'] + " `" + c[1] + "`.");
            newLine();
        },
        "echo": function(c) {
            var str = "";
            $.each(c, function(a, b) {
                if(a !== 0) {
                    str += " " + b;
                }
            });
            print(str);
            newLine();
        },
        "env": function() {
            $.each(env, function(a, b){
                print(a + "=" + b);
            });
            newLine();
        },
        "export": function(c) {
            var kv = c[1].split("=");
            env[kv[0]] = kv[1];
            print(kv[0] + " = " + kv[1]);
            newLine();
        },
        "reload": function() {
            $(element).delay(333).animate({'opacity':0}, 1111, function(){
                window.location = window.location;
            });
            newLine();
        },
        "ls": function(c) {
            var url = urlHelper('ls', env['PWD']);
            $.getJSON(url, function(json, stat, xhr) {
                $.each(json.respuesta.mensaje, function(i, v) {
                    print(v);
                });
                newLine();
            }).error(function(){throw 'Server script doesn\'t exist.'});
        },
        "cd": function(c) {
            if(c[1] !== undefined) {
                if(c[1].indexOf('..') !== -1) {
                    var split = env['PWD'].split('/'), carpeta = '';
                    $.each(split, function(i, v){
                        if(i < (split.length - 2))
                            carpeta += v + '/';
                    });
                } else if(c[1] == '.' || c[1] == './')
                    var carpeta = env['PWD'];
                else {
                    var carpeta = c[1];
                }
                var url = urlHelper('cd', carpeta);
                $.getJSON(url, function(json, stat, xhr) {
                    if(json.respuesta.res == 1)
                        print(json.respuesta.mensaje);
                    else
                        env['PWD'] = carpeta;
                    newLine();
                }).error(function(){throw 'Server script doesn\'t exist.'});
            } else {
                newLine();
            }
        },
        "none": function(c) {
            if(c[0] !== "")
                print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none);
            else
                return;
            newLine();
        }
    },
    help = {
        "help": ['Shows this help'],
        "echo": ['[arg ...] prints the argument'],
        "env": ['prints all the environment variables'],
        "export": ['sets a variable'],
        "reload": ['reload the console']
    },
    append = function(car) {
        var line = getLine();
        $(line).find("span#g").append(car);
    },
    print = function(str) {
        var line = getLine();
        $(line).find("span#g").append("<br>" + str);
    },
    getLine = function() {
        var lines = $(".consola .consola-line").length,
        line = $(".consola-line")[lines-1];
        return line;
    },
    remove = function() {
        var line = getLine(),
        str = $(line).find("span#g").text().substr(0, $(line).find("span#g").text().length - 1);
        $(line).find("span#g").empty().append(str);
    },
    newLine = function() {
        var lines = $(element).find(".consola-line").length;
        $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>');
        $($(".consola .consola-line")[lines]).find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ");
        $(element).scrollTop(100000);
    },
    urlHelper = function(command, arg) {
        var conf = window.webterminal.prototype.conf;
        if(conf.server === true) {
            if(conf.script == 'node.js') {
                return document.location.protocol == 'file:' ? 'http://localhost:8080/' : document.location.protocol + "//"
                    + document.location.hostname + ":8080/" + command + '/?0=' + encodeURI(arg);
            } else if(conf.script == 'php') {
                return document.location.protocol + "//" + document.location.hostname + "/" + conf.phpscript + '?c=' + command + '&0=' + encodeURI(arg);
            } else {
                throw 'The value for `server` is true but you don\'t give a correct value for `script` [node.js, php]';
            }
        }
    };
    //El loop del efecto del cursor de texto
    (loop = function() {
        if($('span#l').length === 0)
            $('body').append('<span id="l" style="display:none"></span>');
        $('span#l').delay(600).animate({'opacity': 0}, 10)
                   .delay(600).animate({'opacity': 1}, 10, loop);
    })();
    var ch = {}, sh = {}, al = {};
    $.each(chars, function(i, v){
        ch[v] = i;
    });
    $.each(shiftChars, function(i, v) {
        sh[v] = i;
    });
    $.each(altChars, function(i, v) {
        al[v] = i;
    });
    chars = ch;shift_chars = sh;alt_chars = al;

    function Plugin(element, nconf, nshell, nenv, nhelp) {
        this.element = element;
        this.conf = $.extend({}, conf, nconf);
        this.shell = $.extend({}, shell, nshell);
        this.env = $.extend({}, env, nenv);
        this.help = $.extend({}, help, nhelp);
        this.historial = [];

        this.init(this.conf, this.shell, this.env, this.help);
    }

    Plugin.prototype = {
        init: function(conf, shell, env, help) {
            Plugin.prototype.conf = conf;
            Plugin.prototype.shell = shell;
            Plugin.prototype.env = env;
            Plugin.prototype.help = help;

            this._showTerm();
            this.lang();
            this.enLaBusquedaDelTextoPerdido();
            this.console();
        },
        _showTerm: function() {
            $(this.element).delay(333).animate({'opacity':1}, 1111);
        },
        _hideTerm: function(c) {
            $(this.element).delay(333).animate({'opacity':0}, 1111, c);
        },
        enLaBusquedaDelTextoPerdido: function() {
            if($(this.element).text().length === 0)
                $(this.element).append('<div class="consola"></div>').find(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ");
        },
        lang: function() {
            var disponible = ['es-es', 'en-gb', 'en-us'],
                idioma = window.navigator.language,
                isThere = false;
            $.each(disponible, function(i, v) {
                if(!isThere) isThere = v == idioma;
            });
            if(!isThere) idioma = 'en-gb';
            this.idioma = {};
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "lang/" + idioma + ".js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'webterminal-lang'));
        },
        console: function() {
            //Consola
            element = this.element;
            shell = this.shell;
            env = this.env;
            help = this.help;
            historial = this.historial;
            $(document).keydown(function(e) {
                var keyCode = e.originalEvent.keyIdentifier,//e.which,
                lines = $(element).find(".consola-line").length,
                line = $(".consola-line")[lines-1];
                if(e.metaKey || (e.ctrlKey && keyCode == 82) || (e.ctrlKey && keyCode == 84))
                    return;
                e.preventDefault();

                //console.log(keyCode);
                if($(".consola").length === 0)
                    $(element).append('<div class="consola"></div>').find("span#l").remove();
                if(lines === 0)
                    $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ");
                else if(!e.shiftKey && !e.altKey && chars[keyCode] !== undefined)
                    append(chars[keyCode]);
                else if(keyCode == 'U+0008') //Eliminar caracter
                    remove();
                else if(e.shiftKey && !e.altKey && shift_chars[keyCode] !== undefined)
                    append(shift_chars[keyCode]);
                else if(!e.shiftKey && e.altKey && alt_chars[keyCode] !== undefined)
                    append(alt_chars[keyCode]);
                else if(keyCode == 'Enter') { //Nueva linea -> enviar comando
                    $(line).find("span#l").remove();
                    $(line).append("<br>");
                    var comando = $(line).find("span#g").text().split(" ");
                    historial[historial.length] = $(line).find("span#g").text();
                    $.each(comando, function(a, b) { //Busca variables en el comando
                        if(b.search("$") != -1) {
                            var vars = b.split("$").length - 1, i = 0;
                            while(i < vars) {
                                var variable = b.split("$")[1];
                                var sustituto = env[variable];
                                if(sustituto !== undefined)
                                    comando[a] = sustituto;
                                else
                                    comando[a] = "";
                                i++;
                            }
                        }
                    });
                    if(shell[comando[0]] !== undefined && comando[0] !== undefined) {
                        try {
                            shell[comando[0]](comando);
                        } catch(e) {
                            print('<span style="color:red">&gt;&nbsp;Has ocurred an error. See dev tools console</span>');
                            newLine();
                            throw e;
                        }
                    }
                    else if(shell[comando[0]] === undefined && comando[0] !== undefined)
                            shell["none"](comando);
                } else if(keyCode === 38) { //Arriba
                    if($(line).find('span#g').data('historial') === undefined) {
                        $(line).find("span#g").empty().data('historial', historial.length - 1);
                        var comando = historial[historial.length - 1];
                        append(comando);
                    } else {
                        var num = parseInt($(line).find('span#g').data('historial')) - 1,
                        comando = historial[num];
                        if(num <= historial.length && num >= 0) {
                            $(line).find("span#g").empty().data('historial', num);
                            append(comando);
                        }
                    }
                } else if(keyCode === 40) { //Abajo
                    if($(line).find('span#g').data('historial') === undefined) {
                        $(line).find("span#g").empty().data('historial', historial.length + 1);
                        var comando = historial[historial.length + 1];
                    } else {
                        var num = parseInt($(line).find('span#g').data('historial')) + 1,
                        comando = historial[num];
                        if(num <= historial.length && num >= 0) {
                            $(line).find("span#g").empty().data('historial', num);
                            append(comando);
                        }
                    }
                }
                $(element).scrollTop(100000);
                if($(element).height() < $(".consola").height())
                    $(".consola-line").addClass("consola-line-short");
            });
        }
    };

    $.fn[pluginName] = function(conf, options, opt, o) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, conf, options, opt, o));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
        }
    };

    $[pluginName] = function(options) {
        return $(".console").webterminal($(".console"));
    };
    
    $[pluginName].env = env;
    $[pluginName].shell = shell;
    $[pluginName].print = print;
    $[pluginName].help = help;
    $[pluginName].newLine = newLine;
    $[pluginName].urlHelper = urlHelper;

    window.webterminal = Plugin;

}(jQuery, this, document));
