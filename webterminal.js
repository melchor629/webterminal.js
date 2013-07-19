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
    chars = {
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
    },
    env = {
        "TERM_PROGRAM": window.navigator.userAgent,
        "SHELL": document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1) + "404.js",
        "USER": "root",
        "PWD": document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)
    },
    shell = {
        "help": function(c) {
            if (c[1] == undefined) {
                print("webterminal, version " + version + " (" + window.navigator.userAgent + ")");
                print("These shell commands are defined internally or externally. Type `help` to see this list.");
                print("Type `help name` to find out more about the function `name`.");
                print("Maybe some commands doesn't show up in this help, it depends on the web programmer.");
                $.each(help, function(a, b){
                    print("&nbsp;" + a + " " + b[0]);
                })
            } else if (c[1] != undefined && help[c[1]] != undefined) {
                b = help[c[1]];
                print(c[1] + ": " + b[0]);
                print(b[1]);
            } else if(help[c[1]] == undefined)
                print("-bash: help: no help topics match `" + c[1] + "`.");
        },
        "echo": function(c) {
            var str = "";
            $.each(c, function(a, b) {
                if(a != 0) {
                    str += " " + b;
                }
            });
            print(str);
        },
        "env": function() {
            $.each(env, function(a, b){
                print(a + "=" + b);
            });
        },
        "export": function(c) {
            var kv = c[1].split("=");
            env[kv[0]] = kv[1];
            print(kv[0] + " = " + kv[1]);
        },
        "reload": function() {
            $('.interior').delay(333).animate({'opacity':0}, 1111, function(){
                window.location = window.location
            })
        },
        "none": function(c) {
            if(c[0] != "")
                print("-bash: " + c[0] + ": comando no encontrado.");
            else
                return;
        }
    },
    help = {
        "help": ['Shows this help'],
        "echo": ['[arg ...] prints the argument'],
        "env": ['prints all the environment variables'],
        "export": ['sets a variable'],
        "reload": ['reload the console']
    },
    intro = 13,
    append = function(char) {
        var line = getLine();
        $(line).find("span#g").append(char);
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
    };
    //El loop del efecto del cursor de texto
    (loop = function() {
        $('span#l').delay(600).animate({'opacity': 0}, 10)
                   .delay(600).animate({'opacity': 1}, 10, loop);
    })();

    function Plugin(element, nshell, nenv, nhelp) {
        this.element = element;
        this.shell = $.extend({}, shell, nshell);
        this.env = $.extend({}, env, nenv);
        this.help = $.extend({}, help, nhelp);

        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this._showTerm();
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
            if($(this.element).text().length == 0)
                $(this.element).append('<div class="consola"></div>').find(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ");
        },
        console: function() {
            //Consola
            element = this.element;
            shell = this.shell;
            env = this.env;
            help = this.help;
            $(document).keydown(function(e) {
                var keyCode = e.keyCode,
                lines = $(element).find(".consola-line").length,
                line = $(".consola-line")[lines-1];
                !(keyCode == 82 && e.metaKey);
                if(!(keyCode == 82 && e.metaKey) || !(keyCode == 81 && e.metaKey))
                    e.preventDefault();

                //console.log(keyCode);
                if($(".consola").length == 0)
                    $(element).append('<div class="consola"></div>').find("span#l").remove();
                if(lines == 0)
                    $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ");
                else if(!e.shiftKey && !e.altKey && chars[keyCode] != undefined)
                    append(chars[keyCode]);
                else if(keyCode == 8) //Eliminar caracter
                    remove();
                else if(e.shiftKey && !e.altKey && shift_chars[keyCode] != undefined)
                    append(shift_chars[keyCode])
                else if(!e.shiftKey && e.altKey && alt_chars[keyCode] != undefined)
                    append(alt_chars[keyCode]);
                else if(keyCode == intro) { //Nueva linea -> enviar comando
                    $(line).find("span#l").remove();
                    $(line).append("<br>");
                    var comando = $(line).find("span#g").text().split(" ");
                    $.each(comando, function(a, b) { //Busca variables en el comando
                        if(b.search("$") != -1) {
                            var vars = b.split("$").length - 1, i = 0;
                            while(i < vars) {
                                var variable = b.split("$")[1];
                                var sustituto = env[variable];
                                if(sustituto != undefined)
                                    comando[a] = sustituto;
                                else
                                    comando[a] = "";
                                i++;
                            }
                        }
                    });
                    if(shell[comando[0]] != undefined && comando[0] != undefined)
                        shell[comando[0]](comando);
                    else if(shell[comando[0]] == undefined && comando[0] != undefined)
                        shell["none"](comando);
                    $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>');
                    $($(".consola .consola-line")[lines]).find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ");
                    $(element).scrollTop(100000)
                }
                $(element).scrollTop(100000);
            });
        }
    };

    $.fn[pluginName] = function(options, opt, o) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options, opt, o));
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
    }
    
    $[pluginName].env = env;
    $[pluginName].shell = shell;
    $[pluginName].print = print;
    $[pluginName].help = help;

    window.webterminal = Plugin;

}(jQuery, this, document));