(function() {
    var Plugin, al, altChars, alt_chars, append, ch, chars, conf, dirHelper, env, getLine, help, line, lines, newLine, parpadeo, pluginName, print, remove, sh, shell, shiftChars, shift_chars, urlHelper, version, _this;
    chars = {
        q: "U+0051",
        w: "U+0057",
        e: "U+0045",
        r: "U+0052",
        t: "U+0054",
        y: "U+0059",
        u: "U+0055",
        i: "U+0049",
        o: "U+004F",
        p: "U+0050",
        a: "U+0041",
        s: "U+0053",
        d: "U+0044",
        f: "U+0046",
        g: "U+0047",
        h: "U+0048",
        j: "U+004A",
        k: "U+004B",
        l: "U+004C",
        "ñ": "U+00F1",
        "ç": "U+00E7",
        z: "U+005A",
        x: "U+0058",
        c: "U+0043",
        v: "U+0056",
        b: "U+0042",
        n: "U+004E",
        m: "U+004D",
        " ": "U+0020",
        ".": "U+002E",
        ",": "U+002C",
        "0": "U+0030",
        "1": "U+0031",
        "2": "U+0032",
        "3": "U+0033",
        "4": "U+0034",
        "5": "U+0035",
        "6": "U+0036",
        "7": "U+0037",
        "8": "U+0038",
        "9": "U+0039",
        "'": "U+0027",
        "¡": "U+00A1",
        "-": "U+002D"
    };
    shiftChars = {
        Q: "U+0051",
        W: "U+0057",
        E: "U+0045",
        R: "U+0052",
        T: "U+0054",
        Y: "U+0059",
        U: "U+0055",
        I: "U+0049",
        O: "U+004F",
        P: "U+0050",
        A: "U+0041",
        S: "U+0053",
        D: "U+0044",
        F: "U+0046",
        G: "U+0047",
        H: "U+0048",
        J: "U+004A",
        K: "U+004B",
        L: "U+004C",
        "Ñ": "U+00F1",
        "Ç": "U+00E7",
        Z: "U+005A",
        X: "U+0058",
        C: "U+0043",
        V: "U+0056",
        B: "U+0042",
        N: "U+004E",
        M: "U+004D",
        " ": "U+0020",
        ":": "U+003A",
        ";": "U+003B",
        "=": "U+003D",
        "!": "U+0021",
        '"': "U+0022",
        "·": "U+00B7",
        $: "U+0024",
        "%": "U+0025",
        "&": "U+0026",
        "/": "U+002F",
        "(": "U+0028",
        ")": "U+0029",
        "?": "U+003F",
        "¿": "U+00BF",
        _: "U+005F"
    };
    altChars = {
        "–": "U+002D",
        "…": "U+002E",
        "„": "U+002C",
        "≠": "U+0030",
        "|": "U+0031",
        "@": "U+0032",
        "#": "U+0033",
        "¢": "U+0034",
        "∞": "U+0035",
        "¬": "U+0036",
        "÷": "U+0037",
        "“": "U+0038",
        "”": "U+0039",
        "´": "U+0027",
        "‚": "U+00A1",
        "[": "Unidentified",
        "]": "U+002B",
        "{": "Unidentified",
        "}": "U+00E7",
        "\\": "U+00BA"
    };
    if (window.navigator.platform !== "MacIntel") {
        shiftChars = $.extend({}, shiftChars, {
            ":": "U+00BE",
            ";": "U+00BC",
            "=": "U+0030",
            "!": "U+0031",
            '"': "U+0032",
            "·": "U+0033",
            $: "U+0034",
            "%": "U+0035",
            "&": "U+0036",
            "/": "U+0037",
            "(": "U+0038",
            ")": "U+0039",
            "?": "U+00DB",
            "¿": "U+00DD",
            _: "U+00BD"
        });
        altChars = $.extend({}, altChars, {
            "[": "U+00BA",
            "]": "U+00BB",
            "{": "U+00DE",
            "}": "U+00BF"
        });
    }
    ch = {};
    sh = {};
    al = {};
    $.each(chars, function(i, v) {
        return ch[v] = i;
    });
    $.each(shiftChars, function(i, v) {
        return sh[v] = i;
    });
    $.each(altChars, function(i, v) {
        return al[v] = i;
    });
    chars = ch;
    shift_chars = sh;
    alt_chars = al;
    conf = {
        server: false,
        script: "",
        phpscript: "/"
    };
    env = {
        TERM_PROGRAM: window.navigator.userAgent,
        PWD: decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)),
        SHELL: decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)) + "webterminal.js",
        USER: "guest"
    };
    help = {
        help: [ "Shows this help" ],
        echo: [ "[arg ...] prints the argument" ],
        env: [ "prints all the environment variables" ],
        "export": [ "sets a variable" ],
        reload: [ "reload the console" ]
    };
    version = "v0.2";
    pluginName = "webterminal";
    _this = {};
    lines = 0;
    line = $(".consola-line")[lines - 1];
    append = function(car) {
        line = getLine();
        return $(line).find("span#g").append(car);
    };
    print = function(str) {
        line = getLine();
        return $(line).find("span#g").append("<br>" + str);
    };
    getLine = function() {
        lines = $(".consola .consola-line").length;
        line = $(".consola-line")[lines - 1];
        return line;
    };
    remove = function() {
        var str;
        line = getLine();
        str = $(line).find("span#g").text().substr(0, $(line).find("span#g").text().length - 1);
        return $(line).find("span#g").empty().append(str);
    };
    newLine = function() {
        lines = $(_this.element).find(".consola-line").length;
        $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>');
        $($(".consola .consola-line")[lines]).find("span#t").text("sh-3.2# " + _this.env["PWD"] + " " + _this.env["USER"] + "$ ");
        return $(_this.element).scrollTop(1e5);
    };
    urlHelper = function(command, arg) {
        var url;
        conf = _this.conf;
        if (conf.server === true) {
            if (conf.script === "node.js") {
                url = document.location.protocol === "file:" ? "http://localhost:8080/" : document.location.protocol + "//" + document.location.hostname + ":8080/";
                url = url + command + "/?0=" + encodeURI(arg) + "&USER=" + _this.env["USER"];
                return url;
            } else if (conf.script === "php") {
                if (document.location.protocol === "file:") {
                    return "http://localhost/server.php?c=" + command + "&0=" + encodeURI(arg) + "&USER=" + _this.env["USER"];
                } else {
                    return "" + document.location.protocol + "//                " + document.location.hostname + conf.phpscript + "server.php?c=" + command + "&0=" + encodeURI(arg) + "&USER=" + _this.env["USER"];
                }
            } else {
                throw "The value for `server` is true but you don't give a correct value for `script` [node.js, php]";
            }
        }
    };
    dirHelper = function(folder) {
        var carpeta, split;
        if (folder.indexOf("..") !== -1) {
            split = _this.env["PWD"].split("/");
            carpeta = "";
            $.each(split, function(i, v) {
                if (i < split.length - 2) {
                    return carpeta += v + "/";
                }
            });
        } else if (folder === "." || folder === "./") {
            carpeta = _this.env["PWD"];
        } else {
            carpeta = folder;
        }
        return carpeta;
    };
    (parpadeo = function() {
        if ($("span#l").length === 0) {
            $("body").append('<span id="l" style="display:none"></span>');
        }
        return $("span#l").delay(600).animate({
            opacity: 0
        }, 10).delay(600).animate({
            opacity: 1
        }, 10, parpadeo);
    })();
    shell = {
        help: function(c) {
            var b;
            if (c[1] === void 0) {
                print("webterminal, version " + version + " (" + window.navigator.userAgent + ")");
                print($.webterminal.idioma.shell.help[1]);
                print($.webterminal.idioma.shell.help[2]);
                print($.webterminal.idioma.shell.help[3]);
                $.each(help, function(a, b) {
                    return print("&nbsp;" + a + " " + b[0]);
                });
            } else if (c[1] && help[c[1]] !== void 0) {
                b = _this.help[c[1]];
                print(c[1] + ": " + b[0]);
                print(b[1]);
            } else if (help[c[1]] === void 0) {
                print($.webterminal.idioma.shell.help["noHelp"] + " `" + c[1] + "`.");
            }
            return newLine();
        },
        echo: function(c) {
            var str;
            str = "";
            $.each(c, function(a, b) {
                if (a !== 0) {
                    return str += " " + b;
                }
            });
            print(str);
            return newLine();
        },
        env: function() {
            $.each(_this.env, function(a, b) {
                return print(a + "=" + b);
            });
            return newLine();
        },
        "export": function(c) {
            var kv;
            if (c[1] !== void 0) {
                kv = c[1].split("=");
                _this.env[kv[0]] = kv[1];
                print(kv[0] + " = " + kv[1]);
            } else {
                print("usage: export VARIABLE=VALUE");
            }
            return newLine();
        },
        reload: function() {
            $(element).delay(333).animate({
                opacity: 0
            }, 1111, function() {
                return window.location = window.location;
            });
            return print('Wait…<span id="l">_</span>');
        },
        ls: function(c) {
            var url;
            url = urlHelper("ls", _this.env["PWD"]);
            if (url) {
                return $.getJSON(url, function(json, stat, xhr) {
                    $.each(json.respuesta.mensaje, function(i, v) {
                        return print(v);
                    });
                    return newLine();
                }).error(function() {
                    throw "Server script doesn't exist.";
                });
            } else {
                return newLine();
            }
        },
        cd: function(c) {
            var carpeta, url;
            if (c[1] !== void 0) {
                carpeta = dirHelper(c[1]);
                url = urlHelper("cd", carpeta);
                url = url + "&PWD=" + _this.env["PWD"];
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            print(json.respuesta.mensaje);
                        } else {
                            _this.env["PWD"] = json.respuesta.mensaje;
                        }
                        return newLine();
                    }).error(function() {
                        throw "Server script doesn't exist.";
                    });
                } else {
                    return newLine();
                }
            } else {
                return newLine();
            }
        },
        rm: function(c) {
            var file, url;
            if (c[1] !== void 0) {
                file = dirHelper(c[1]);
                url = urlHelper("rm", file);
                url = url + "&PWD=" + _this.env["PWD"];
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            print(json.respuesta.mensaje);
                        }
                        return newLine();
                    }).error(function() {
                        throw "Server script doesn't exist.";
                    });
                } else {
                    return newLine();
                }
            } else {
                print("usage: rm file");
                return newLine();
            }
        },
        rmdir: function(c) {
            var file, url;
            if (c[1] !== void 0) {
                file = dirHelper(c[1]);
                url = urlHelper("rmdir", file);
                url = url + "&PWD=" + _this.env["PWD"];
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            print(json.respuesta.mensaje);
                        }
                        return newLine();
                    }).error(function() {
                        throw "Server script doesn't exist.";
                    });
                } else {
                    return newLine();
                }
            } else {
                print("usage: rm directory");
                return newLine();
            }
        },
        login: function(c) {
            var url;
            if (c[1] !== void 0) {
                url = urlHelper("login", c[1]) + "&password=" + (c[2] !== void 0 ? MD5(c[2]) : "null");
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            print(json.respuesta.mensaje);
                        } else {
                            _this.env["USER"] = json.respuesta.mensaje;
                        }
                        return newLine();
                    });
                }
            } else {
                print("No user/password given");
                print("Usage: login USER [PASSWORD]");
                return newLine();
            }
        },
        none: function(c) {
            if (c[0] !== "") {
                print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none);
            } else {
                return;
            }
            return newLine();
        }
    };
    Plugin = function(element, nconf, nshell, nenv, nhelp) {
        this.element = element;
        this.conf = $.extend({}, conf, nconf);
        this.shell = $.extend({}, shell, nshell);
        this.env = $.extend({}, env, nenv);
        this.help = $.extend({}, help, nhelp);
        this.historial = [];
        return this.init();
    };
    Plugin.prototype = {
        init: function() {
            (function(id) {
                var fjs, js;
                fjs = document.getElementsByTagName("script")[0];
                if (document.getElementById(id)) {
                    return;
                }
                js = document.createElement("script");
                js.id = id;
                js.src = "lib/md5.min.js";
                return fjs.parentNode.insertBefore(js, fjs);
            })("md5");
            this._showTerm();
            this.lang();
            this.enLaBusquedaDelTextoPerdido();
            return this.console();
        },
        _showTerm: function() {
            return $(this.element).delay(333).animate({
                opacity: 1
            }, 1111);
        },
        _hideTerm: function(c) {
            return $(this.element).delay(333).animate({
                opacity: 0
            }, 1111, c);
        },
        enLaBusquedaDelTextoPerdido: function() {
            if ($(this.element).text().length === 0) {
                return $(this.element).append('<div class="consola"></div>').find(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text("sh-3.2# " + env["PWD"] + " " + env["USER"] + "$ ");
            }
        },
        lang: function() {
            var disponible, idioma, isThere;
            disponible = [ "es-es", "en-gb", "en-us" ];
            idioma = window.navigator.language;
            isThere = false;
            $.each(disponible, function(i, v) {
                if (!isThere) {
                    return isThere = v === idioma;
                }
            });
            if (!isThere) {
                idioma = "en-gb";
            }
            this.idioma = {};
            return function(id) {
                var fjs, js;
                fjs = document.getElementsByTagName("script")[0];
                if (document.getElementById(id)) {
                    return;
                }
                js = document.createElement("script");
                js.id = id;
                js.src = "lib/lang/" + idioma + ".js";
                return fjs.parentNode.insertBefore(js, fjs);
            }("webterminal-lang");
        },
        console: function() {
            _this = this;
            return $(document).keydown(function(e) {
                var comando, keyCode, num;
                keyCode = e.originalEvent.keyIdentifier;
                lines = $(_this.element).find(".consola-line").length;
                line = $(".consola-line")[lines - 1];
                if (e.metaKey || e.ctrlKey && keyCode === 82 || e.ctrlKey && keyCode === 84) {
                    return;
                }
                e.preventDefault();
                if ($(".consola").length === 0) {
                    $(_this.element).append('<div class="consola"></div>').find("span#l").remove();
                }
                if (lines === 0) {
                    $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text("sh-3.2# " + _this.env["PWD"] + " " + _this.env["USER"] + "$ ");
                } else if (!e.shiftKey && !e.altKey && chars[keyCode] !== void 0) {
                    append(chars[keyCode]);
                } else if (keyCode === "U+0008") {
                    remove();
                } else if (e.shiftKey && !e.altKey && shift_chars[keyCode] !== void 0) {
                    append(shift_chars[keyCode]);
                } else if (!e.shiftKey && e.altKey && alt_chars[keyCode] !== void 0) {
                    append(alt_chars[keyCode]);
                } else if (keyCode === "Enter") {
                    $(line).find("span#l").remove();
                    $(line).append("<br>");
                    comando = $(line).find("span#g").text().split(" ");
                    _this.historial[_this.historial.length] = $(line).find("span#g").text();
                    $.each(comando, function(a, b) {
                        var i, sustituto, variable, vars, _results;
                        if (b.search("$") !== -1) {
                            vars = b.split("$").length - 1;
                            i = 0;
                            _results = [];
                            while (i < vars) {
                                variable = b.split("$")[1];
                                sustituto = _this.env[variable];
                                if (sustituto) {
                                    comando[a] = sustituto;
                                } else {
                                    comando[a] = "";
                                }
                                _results.push(i++);
                            }
                            return _results;
                        }
                    });
                    if (_this.shell[comando[0]] !== void 0 && comando[0] !== void 0) {
                        try {
                            _this.shell[comando[0]](comando);
                        } catch (_error) {
                            e = _error;
                            print('<span style="color:red">&gt;&nbsp;Has ocurred an error. See dev tools console</span>');
                            newLine();
                            throw e;
                        }
                    } else if (_this.shell[comando[0]] === void 0 && comando[0] !== void 0) {
                        _this.shell["none"](comando);
                    }
                } else if (keyCode === "Up") {
                    if ($(line).find("span#g").data("historial") === void 0) {
                        $(line).find("span#g").empty().data("historial", _this.historial.length - 1);
                        comando = _this.historial[_this.historial.length - 1];
                        append(comando);
                    } else {
                        num = parseInt($(line).find("span#g").data("historial")) - 1;
                        comando = _this.historial[num];
                        if (num <= _this.historial.length && num >= 0) {
                            $(line).find("span#g").empty().data("historial", num);
                            append(comando);
                        }
                    }
                } else if (keyCode === "Down") {
                    if ($(line).find("span#g").data("historial") === void 0) {
                        $(line).find("span#g").empty().data("historial", _this.historial.length + 1);
                        comando = _this.historial[_this.historial.length + 1];
                    } else {
                        num = parseInt($(line).find("span#g").data("historial")) + 1;
                        comando = _this.historial[num];
                        if (num <= _this.historial.length && num >= 0) {
                            $(line).find("span#g").empty().data("historial", num);
                            append(comando);
                        }
                    }
                }
                $(_this.element).scrollTop(1e5);
                if ($(_this.element).height() < $(".consola").height()) {
                    return $(".consola-line").addClass("consola-line-short");
                }
            });
        }
    };
    $.fn[pluginName] = function(conf, options, opt, o) {
        var args;
        args = arguments;
        if (options === void 0 || typeof options === "object") {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    return $.data(this, "plugin_" + pluginName, new Plugin(this, conf, options, opt, o));
                }
            });
        }
    };
    $[pluginName] = function(options) {
        return $(".console").webterminal(options.element, options.conf, options.shell, options.help, options.env);
    };
    _this = Plugin.prototype;
    $[pluginName].env = _this.env;
    $[pluginName].shell = _this.shell;
    $[pluginName].print = _this.print;
    $[pluginName].help = _this.help;
    $[pluginName].newLine = newLine;
    $[pluginName].urlHelper = urlHelper;
    $[pluginName].dirHelper = dirHelper;
    window.webterminal = Plugin;
}).call(this);