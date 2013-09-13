(function() {
    "use strict";
    var $, Plugin, al, altChars, alt_chars, append, ch, chars, conf, dirHelper, env, errorFormat, getLine, help, line, lines, newLine, parpadeo, pluginName, print, remove, sh, shell, shiftChars, shift_chars, urlHelper, version, window, _this;
    window = this;
    $ = window.$;
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
    help = {};
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
        var i, o, url, _i, _len;
        conf = _this.conf;
        if (conf.server === true) {
            if (conf.script === "node.js") {
                url = document.location.protocol === "file:" ? "http://localhost:8080/" : "http://" + document.location.hostname + ":8080/";
                url = url + command + "/" + "?USER=" + _this.env["USER"];
            } else if (conf.script === "php") {
                url = document.location.protocol === "file:" ? "http://localhost/server.php?c=" + command + "&USER=" + _this.env["USER"] : "http://                " + document.location.hostname + conf.phpscript + "server.php?c=" + command + "&USER=" + _this.env["USER"];
            } else {
                throw $.webterminal.idioma.scriptError;
            }
            o = 0;
            for (_i = 0, _len = arguments.length; _i < _len; _i++) {
                i = arguments[_i];
                if (_i !== 0) {
                    url += "&" + (_i - 1) + "=" + encodeURI(arguments[_i]);
                    o++;
                }
            }
            url += "&PWD=" + encodeURI(_this.env.PWD + "&argc=" + o);
            return url;
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
            if (folder.indexOf("../") !== -1) {
                carpeta = folder.replace("../", carpeta);
            }
        } else if (folder === "." || folder === "./") {
            carpeta = _this.env["PWD"];
            if (folder.indexOf("./") !== -1) {
                carpeta = folder.replace("./", carpeta);
            }
        } else {
            carpeta = folder;
        }
        return carpeta;
    };
    errorFormat = function(cmd, arg, msg) {
        print("" + cmd + ": " + arg + ": " + msg);
        return newLine();
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
                $.each(_this.lang.help, function(a, b) {
                    return print("&nbsp;" + a + " " + b[0]);
                });
                $.each(_this.help, function(a, b) {
                    return print("&nbsp;" + a + " " + b[0]);
                });
            } else if (c[1] && _this.help[c[1]] !== void 0) {
                b = _this.help[c[1]];
                print(c[1] + ": " + b[0]);
                if (b[1]) {
                    print(b[1]);
                }
            } else if (c[1] && _this.lang.help[c[1]] !== void 0) {
                b = _this.lang.help[c[1]];
                print(c[1] + ": " + b[0]);
                if (b[1]) {
                    print(b[1].replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"));
                }
            } else if (_this.help[c[1]] === void 0 && _this.lang.help[c[1]] === void 0) {
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
            $(_this.element).delay(333).animate({
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
                    if (json.respuesta.res === 0) {
                        $.each(json.respuesta.mensaje, function(i, v) {
                            return print(v);
                        });
                        return newLine();
                    } else {
                        return errorFormat("ls", c[1], json.respuesta.mensaje);
                    }
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
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            return errorFormat("cd", c[1], json.respuesta.mensaje);
                        } else {
                            _this.env["PWD"] = json.respuesta.mensaje;
                            return newLine();
                        }
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
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            return errorFormat("rm", c[1], json.respuesta.mensaje);
                        } else {
                            return newLine();
                        }
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
                if (c[2] === "-r") {
                    url = url + "&recursive";
                }
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            return errorFormat("rmdir", c[1], json.respuesta.mensaje);
                        } else {
                            return newLine();
                        }
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
        touch: function(c) {
            var fileName, url;
            if (c[1] !== void 0) {
                fileName = dirHelper(c[1]);
                url = urlHelper("touch", c[1]);
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            return errorFormat("touch", c[1], json.respuesta.mensaje);
                        } else {
                            return newLine();
                        }
                    }).error(function() {
                        throw "Server script doesn't exist.";
                    });
                } else {
                    return newLine();
                }
            } else {
                print("usage: touch fileName");
                return newLine();
            }
        },
        mkdir: function(c) {
            var fileName, url;
            if (c[1] !== void 0) {
                fileName = dirHelper(c[1]);
                url = urlHelper("mkdir", c[1]);
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res === 1) {
                            return errorFormat("mkdir", c[1], json.respuesta.mensaje);
                        } else {
                            return newLine();
                        }
                    }).error(function() {
                        throw "Server script doesn't exist.";
                    });
                } else {
                    return newLine();
                }
            } else {
                print("usage: mkdir directoryName");
                return newLine();
            }
        },
        cwd: function() {
            print(_this.env["PWD"]);
            return newLine();
        },
        cat: function(c) {
            var fileName, url;
            if (c[1] !== void 0 && c[2] === void 0) {
                fileName = encodeURI(dirHelper(c[1]));
                url = urlHelper("cat", fileName);
                if (url) {
                    return $.getJSON(url, function(json, stat, xhr) {
                        if (json.respuesta.res !== 1) {
                            print('<div style="text-align:left;">' + json.respuesta.mensaje + "</div>");
                            return newLine();
                        } else {
                            return errorFormat("cat", c[1], json.respuesta.mensaje);
                        }
                    }).error(function() {
                        throw "Server script doesn't exist.";
                    });
                } else {
                    return newLine();
                }
            } else if (c[1] !== void 0 && c[2] !== void 0) {
                if (c[1].indexOf("-" === 0)) {
                    if (c[1] === "-n") {
                        fileName = encodeURI(dirHelper(c[2]));
                        url = urlHelper("cat", fileName);
                        return $.getJSON(url, function(json, stat, xhr) {
                            var out, slice;
                            if (json.respuesta.res !== 1) {
                                slice = json.respuesta.mensaje.split("<br>");
                                out = "";
                                $.each(slice, function(i, v) {
                                    if (i < 9) {
                                        return out = out + "&nbsp;&nbsp;&nbsp;&nbsp;" + (i + 1) + " " + v + "<br>";
                                    } else if (i < 99) {
                                        return out = out + "&nbsp;&nbsp;&nbsp;" + (i + 1) + " " + v + "<br>";
                                    } else if (i < 999) {
                                        return out = out + "&nbsp;&nbsp;" + (i + 1) + " " + v + "<br>";
                                    } else if (i < 9999) {
                                        return out = out + "&nbsp;" + (i + 1) + " " + v + "<br>";
                                    }
                                });
                                print('<div style="text-align:left;">' + out + "</div>");
                                return newLine();
                            } else {
                                return errorFormat("cat", c[2], json.respuesta.mensaje);
                            }
                        }).error(function() {
                            throw "Server script doesn't exist.";
                        });
                    } else if (c[1] === "-b") {
                        fileName = encodeURI(dirHelper(c[2]));
                        url = urlHelper("cat", fileName);
                        return $.getJSON(url, function(json, stat, xhr) {
                            var i, j, out, slice;
                            if (json.respuesta.res !== 1) {
                                slice = json.respuesta.mensaje.split("<br>");
                                out = "";
                                i = 0;
                                j = 0;
                                for (j = 0; j < slice.length; j++) {
                                    var v = slice[j];
                                    if (v != "") {
                                        if (i < 9) out = out + "&nbsp;&nbsp;&nbsp;&nbsp;" + (i + 1) + " " + v + "<br>"; else if (i < 99) out = out + "&nbsp;&nbsp;&nbsp;" + (i + 1) + " " + v + "<br>"; else if (i < 999) out = out + "&nbsp;&nbsp;" + (i + 1) + " " + v + "<br>"; else if (i < 9999) out = out + "&nbsp;" + (i + 1) + " " + v + "<br>";
                                        i++;
                                    } else out = out + "<br>";
                                }
                                print('<div style="text-align:left;">' + out + "</div>");
                                return newLine();
                            } else {
                                return errorFormat("cat", c[1], json.respuesta.mensaje);
                            }
                        }).error(function() {
                            throw "Server script doesn't exist.";
                        });
                    }
                } else {
                    print("usage: cat [-n] file");
                    return newLine();
                }
            } else {
                print("usage: cat file");
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
    Plugin = function(element, options) {
        this.element = element;
        this.conf = $.extend({}, conf, options.conf);
        this.shell = $.extend({}, shell, options.shell);
        this.env = $.extend({}, env, options.env);
        this.help = $.extend({}, help, options.help);
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
            this._fill(true);
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
                    if (v.match(idioma)) {
                        isThere = true;
                        return idioma = v;
                    }
                }
            });
            if (!isThere) {
                idioma = "en-gb";
            }
            return $.getJSON("lib/lang/" + idioma + ".json", function(json, stat, xhr) {
                $.webterminal.idioma = json;
                return Plugin.prototype.lang = json;
            });
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
                _this._fill(false);
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
        },
        _fill: function(first) {
            if (first === true) {
                $[pluginName].shell = this.shell;
                $[pluginName].print = print;
                $[pluginName].help = this.help;
                $[pluginName].newLine = newLine;
                $[pluginName].urlHelper = urlHelper;
                $[pluginName].dirHelper = dirHelper;
                $[pluginName].conf = this.conf;
            }
            return $[pluginName].env = this.env;
        }
    };
    $.fn[pluginName] = function(options) {
        var args;
        args = arguments;
        if (options === void 0 || typeof options === "object") {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    return $.data(this, "plugin_" + pluginName, new Plugin(this, options === void 0 ? {} : options));
                }
            });
        }
    };
    $[pluginName] = function(options) {
        return $(".console").webterminal(options.element, options);
    };
    _this = Plugin.prototype;
    $[pluginName].env = _this.env;
    $[pluginName].shell = _this.shell;
    $[pluginName].print = print;
    $[pluginName].help = _this.help;
    $[pluginName].conf = _this.conf;
    $[pluginName].newLine = newLine;
    $[pluginName].urlHelper = urlHelper;
    $[pluginName].dirHelper = dirHelper;
    $[pluginName].errorFormat = errorFormat;
}).call(this);