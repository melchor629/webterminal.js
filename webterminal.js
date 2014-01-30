(function() {
    "use strict";
    var $, Plugin, append, conf, dirHelper, env, errorFormat, errorFormatNNL, getLine, help, newLine, parpadeo, pluginName, print, remove, shell, urlHelper, version, window, _this;
    window = this;
    $ = window.$;
    version = "0.2-beta";
    pluginName = "webterminal";
    _this = {};
    conf = {
        server: false,
        script: void 0,
        phpscript: "/",
        width: 484,
        height: 314
    };
    env = {
        TERM_PROGRAM: window.navigator.userAgent,
        PWD: decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)),
        SHELL: decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)) + "webterminal.js",
        USER: "guest",
        VERSION: version
    };
    help = {};
    shell = {};
    append = function(car) {
        return $(getLine()).find("span#g").append(car);
    };
    print = function(str) {
        return $(getLine()).find("span#g").append("<br>" + str);
    };
    getLine = function() {
        var line, lines;
        lines = $(".consola .consola-line").length;
        line = $(".consola-line")[lines - 1];
        return line;
    };
    remove = function() {
        var objG, str;
        objG = $(getLine()).find("span#g");
        str = objG.text().substr(0, objG.text().length - 1);
        return objG.empty().append(str);
    };
    newLine = function() {
        var lines;
        lines = $(_this.element).find(".consola-line").length;
        $(".consola").append('<div class="consola-line" style="width: ' + _this.width + 'px"><span id="t"></span><span id="g"></span><span id="l">_</span></div>');
        $($(".consola .consola-line")[lines]).find("span#t").text("sh-3.2# " + _this.env["PWD"] + " " + _this.env["USER"] + "$ ");
        return $(_this.element).scrollTop(1e5);
    };
    urlHelper = function(command, arg) {
        var i, o, url, _i, _len;
        conf = _this.conf;
        if (conf.server === true) {
            if (conf.script === "node.js") {
                url = "http://" + document.location.hostname + ":8080/";
                url = url + command + "/" + "?USER=" + _this.env["USER"];
            } else if (conf.script === "php") {
                url = "http://" + document.location.hostname + conf.phpscript + "server.php?c=" + command + "&USER=" + _this.env["USER"];
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
    errorFormatNNL = function(cmd, arg, msg) {
        return print("" + cmd + ": " + arg + ": " + msg);
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
    shell.cat = function(c) {
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
    };
    shell.cd = function(c) {
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
    };
    shell.cwd = function() {
        print(_this.env["PWD"]);
        return newLine();
    };
    shell.echo = function(c) {
        var str;
        str = "";
        $.each(c, function(a, b) {
            if (a !== 0) {
                return str += " " + b;
            }
        });
        print(str);
        return newLine();
    };
    shell.env = function() {
        $.each(_this.env, function(a, b) {
            return print(a + "=" + b);
        });
        return newLine();
    };
    shell["export"] = function(c) {
        var kv;
        if (c[1] !== void 0) {
            kv = c[1].split("=");
            _this.env[kv[0]] = kv[1];
            print(kv[0] + " = " + kv[1]);
        } else {
            print("usage: export VARIABLE=VALUE");
        }
        return newLine();
    };
    shell.help = function(c) {
        var b;
        if (c[1] === void 0) {
            print("webterminal, version " + version + " (" + window.navigator.userAgent + ")");
            print($.webterminal.idioma.shell.help[1]);
            print($.webterminal.idioma.shell.help[2]);
            print($.webterminal.idioma.shell.help[3]);
            $.each(_this.lang.help, function(a, b) {
                while (a.length < 7) {
                    a = a + " ";
                }
                return print("&nbsp;&nbsp;" + a.replace(/\ /g, "&nbsp;") + " " + b[0]);
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
    };
    shell.login = function(c) {
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
    };
    shell.ls = function(c) {
        var url;
        if (c[1] && c[1].search("-") !== -1) {
            errorFormatNNL("ls", c[1], "illegal option");
            print("usage: ls [directory ...]");
            return newLine();
        } else if (c.length === 2 || c.length === 1) {
            url = urlHelper("ls", c[1] ? _this.env.PWD + c[1] : _this.env["PWD"]);
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
        } else {
            $.each(c, function(value, key) {
                if (value) {
                    url = urlHelper("ls", _this.env.PWD + key);
                    if (url) {
                        return $.getJSON(url, function(json, stat, xhr) {
                            if (json.respuesta.res === 0) {
                                print(key + ":");
                                $.each(json.respuesta.mensaje, function(i, v) {
                                    return print(v);
                                });
                                if (value + 1 !== c.length) {
                                    return print("");
                                }
                            } else {
                                errorFormatNNL("ls", c[1], json.respuesta.mensaje);
                                return print("");
                            }
                        }).error(function() {
                            throw "Server script doesn't exist.";
                        });
                    } else {
                        return print("");
                    }
                }
            });
            return newLine();
        }
    };
    shell.mkdir = function(c) {
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
    };
    shell.none = function(c) {
        if (c[0] !== "") {
            print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none);
        } else {
            return;
        }
        return newLine();
    };
    shell.printf = function(c) {
        var a, doFormat, format, formatBaseX, formatString, i, justify, pad, regex;
        if (c.length < 2) {
            print("printf: usage printf format [arguments]");
            newLine();
            return;
        }
        regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
        a = c.slice(1);
        i = 0;
        format = a[i++];
        pad = function(str, len, chr, leftJustify) {
            var padding;
            if (!chr) {
                chr = " ";
            }
            padding = str.length >= length ? "" : Array(1 + len - str.length >>> 0).join(chr);
            if (leftJustify) {
                return str + padding;
            } else {
                return padding + str;
            }
        };
        justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff;
            diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad("", diff, "0", true) + value.slice(prefix.length);
                }
            }
            return value;
        };
        formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            var number;
            number = value >>> 0;
            prefix = prefix && number && {
                "2": "0b",
                "8": "0",
                "16": "0x"
            }[base] || "";
            value = prefix + pad(number.toString(base), precision || 0, "0", false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };
        formatString = function(value, leftJustify, minWidth, prec, zeroPad, customPadChar) {
            if (prec !== null) {
                value = value.slice(0, prec);
            }
            return justify(value, "", leftJustify, minWidth, zeroPad, customPadChar);
        };
        doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
            var customPadChar, flagsl, leftJustify, method, number, positivePrefix, prefix, prefixBaseX, textTransform, value, zeroPad;
            if (substring === "%%") {
                return "%";
            }
            leftJustify = false;
            positivePrefix = "";
            zeroPad = false;
            prefixBaseX = false;
            customPadChar = " ";
            flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                j;
                switch (flags.charAt(j)) {
                  case " ":
                    positivePrefix = " ";
                    break;

                  case "+":
                    positivePrefix = "+";
                    break;

                  case "-":
                    leftJustify = true;
                    break;

                  case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;

                  case "0":
                    zeroPad = true;
                    break;

                  case "#":
                    prefixBaseX = true;
                }
            }
            if (!minWidth) {
                minWidth = 0;
            } else if (minWidth === "*") {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0 === "*")) {
                minWidth = +a[minWidth.slice(1, -1)];
            } else {
                minWidth = +minWidth;
            }
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }
            if (!isFinite(minWidth)) {
                throw new Error("sprintf: (minimum-)width must be finite");
            }
            if (!precision) {
                precision = "fFeE".indexOf(type) > -1 ? 6 : type === "d" ? 0 : void 0;
            } else if (precision === "*") {
                precision = +a[i++];
            } else if (precision.charAt(0) === "*") {
                precision = +a[precision.slice(1, -1)];
            } else {
                precision = +precision;
            }
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
            switch (type) {
              case "s":
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);

              case "c":
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);

              case "b":
                return formatString(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);

              case "o":
                return formatString(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);

              case "x":
                return formatString(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);

              case "X":
                return formatString(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();

              case "u":
                return formatString(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);

              case "i":
              case "d":
                number = +value || 0;
                number = Math.round(number - number % 1);
                prefix = number < 0 ? "-" : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, "0", false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);

              case "e":
              case "E":
              case "f":
              case "F":
              case "g":
              case "g":
                number = +value;
                prefix = number < 0 ? "-" : positivePrefix;
                method = [ "toExponential", "toFixed", "toPrecision" ]["efg".indexOf(type.toLowerCase())];
                textTransform = [ "toString", "toUpperCase" ]["eEfFgG".indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();

              default:
                return substring;
            }
        };
        print(format.replace(regex, doFormat));
        return newLine();
    };
    shell.reload = function() {
        $(_this.element).delay(333).animate({
            opacity: 0
        }, 1111, function() {
            return window.location = window.location;
        });
        return print('Wait…<span id="l">_</span>');
    };
    shell.rm = function(c) {
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
    };
    shell.rmdir = function(c) {
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
    };
    shell.touch = function(c) {
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
            this.width = this.conf.width - 13;
            this.height = this.conf.height;
            $(this.element).css({
                "text-align": "justify",
                "overflow-y": "auto",
                width: this.width + 13 + "px",
                height: this.height + "px"
            });
            if ($(this.element).text().length === 0) {
                return $(this.element).append('<div class="consola"></div>').find(".consola").append('<div class="consola-line" style="width:' + this.width + 'px"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text("sh-3.2# " + env["PWD"] + " " + env["USER"] + "$ ");
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
            return $(document).keypress(function(e) {
                var comando, fcomando, keyCode, line, lines, tempComandoString;
                keyCode = e.which;
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
                    $(".consola").append('<div class="consola-line" style="width: ' + _this.width + 'px"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text("sh-3.2# " + _this.env["PWD"] + " " + _this.env["USER"] + "$ ");
                } else if (String.fromCharCode(keyCode) !== void 0 && keyCode !== 8 && keyCode !== 13 && keyCode !== 0) {
                    append(String.fromCharCode(keyCode));
                } else if (keyCode === 8) {
                    remove();
                } else if (keyCode === 13) {
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
                    fcomando = [];
                    tempComandoString = "";
                    $.each(comando, function(key, value) {
                        if (value.search('"') !== -1 || value.search("'") !== -1) {
                            if (tempComandoString) {
                                tempComandoString += " " + value.substr(0, value.length - 1);
                                fcomando.push(tempComandoString);
                                return tempComandoString = "";
                            } else if (!tempComandoString && (value.lastIndexOf('"') === 0 || value.lastIndexOf("'") === 0)) {
                                return tempComandoString += value.substr(1);
                            } else {
                                return fcomando.push(value.substr(1, value.length - 2));
                            }
                        } else if (!tempComandoString) {
                            return fcomando.push(value);
                        } else if (tempComandoString) {
                            return tempComandoString += " " + value;
                        }
                    });
                    comando = fcomando;
                    if (_this.shell[comando[0]] !== void 0 && comando[0] !== void 0) {
                        try {
                            _this.shell[comando[0]](comando);
                        } catch (_error) {
                            e = _error;
                            print('<span style="color:red">&gt;&nbsp;Has ocurred an error. See dev tools console</span>');
                            newLine();
                            throw e;
                            debugger;
                        }
                    } else if (_this.shell[comando[0]] === void 0 && comando[0] !== void 0) {
                        _this.shell["none"](comando);
                    }
                }
                return $(_this.element).scrollTop(1e5);
            }).keydown(function(e) {
                var comando, keyCode, line, lines, num;
                keyCode = e.which;
                lines = $(_this.element).find(".consola-line").length;
                line = $(".consola-line")[lines - 1];
                if (keyCode === 38) {
                    e.preventDefault();
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
                } else if (keyCode === 40) {
                    e.preventDefault();
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