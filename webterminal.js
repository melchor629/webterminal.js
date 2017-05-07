// Generated by CoffeeScript 1.12.4
(function() {
  "use strict";
  var $, Plugin, _this, addLang, append, conf, dirHelper, env, errorFormat, errorFormatNNL, formattingToCss, getFormatting, getLine, help, lang, newLine, parpadeo, pluginName, print, remove, shell, urlHelper, version, window;

  window = this;

  $ = window.$;

  version = '0.2-beta';

  pluginName = 'webterminal';

  _this = {};

  conf = {
    server: false,
    script: void 0,
    phpscript: '/',
    width: 484,
    height: 314,
    colors: {
      black: 'black',
      red: '#990000',
      green: '#00A600',
      yellow: '#999900',
      blue: '#0000B2',
      magenta: '#B200B2',
      cyan: '#00A6B2',
      lightgray: '#BFBFBF',
      darkgray: '#666666',
      lightred: '#E50000',
      lightgreen: '#00D900',
      lightyellow: '#E5E500',
      lightblue: '#0000FF',
      lightmagenta: '#E500E5',
      lightcyan: '#00E5E5',
      white: '#E5E5E5'
    }
  };

  env = {
    "TERM_PROGRAM": window.navigator.userAgent,
    "PWD": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)),
    "SHELL": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)) + "webterminal.js",
    "USER": "guest",
    "VERSION": version
  };

  help = {};

  shell = {};

  lang = {
    available: [],
    translations: {}
  };

  append = function(car) {
    return $(getLine()).find("span#g").append(car);
  };

  print = function(str) {
    var added, color, fmt, l, len1, newStr, num, nums, pos, pos2;
    color = {};
    added = 0;
    while (str.match(/\x1B/)) {
      pos = str.indexOf('\x1B');
      if (str.charAt(pos + 1) === '[') {
        pos2 = str.indexOf('m', pos + 2);
        nums = str.substring(pos + 2, pos2).split(';');
        for (l = 0, len1 = nums.length; l < len1; l++) {
          num = nums[l];
          num = Number(num);
          if (num === 0) {
            color = {};
          } else if (num === 21) {
            color.bold = void 0;
          } else if (num === 22) {
            color.dim = void 0;
          } else if (num === 24) {
            color.underline = void 0;
          } else if (num === 28) {
            color.hidden = void 0;
          } else {
            fmt = getFormatting(num);
            color[fmt.value] = fmt.style;
          }
        }
        newStr = added++ === 0 ? '' : '</span>';
        newStr += "<span style=\"" + (formattingToCss(color)) + "\">";
        str = str.replace(str.substring(pos, pos2 + 1), newStr);
      }
    }
    str = str.replace(/\n/g, '<br>');
    return $(getLine()).find("span#g").append(str);
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
    return $(_this.element).scrollTop(100000);
  };

  urlHelper = function(command, arg) {
    var i, l, len1, o, url;
    conf = _this.conf;
    if (conf.server === true) {
      if (conf.script === 'node.js') {
        url = "http://" + document.location.hostname + ":8080/";
        url = url + command + '/' + '?USER=' + _this.env['USER'];
      } else if (conf.script === 'php') {
        url = "http://" + document.location.hostname + conf.phpscript + "server.php?c=" + command + "&USER=" + _this.env['USER'];
      } else {
        throw $.webterminal.idioma.scriptError;
      }
      o = 0;
      for (l = 0, len1 = arguments.length; l < len1; l++) {
        i = arguments[l];
        if (o !== 0) {
          url += '&' + (o - 1) + '=' + encodeURI(i);
        }
        o++;
      }
      url += '&PWD=' + encodeURI(_this.env.PWD + '&argc=' + o);
      return url;
    }
  };

  dirHelper = function(folder) {
    var carpeta, split;
    if (folder.indexOf('..') !== -1) {
      split = _this.env['PWD'].split('/');
      carpeta = '';
      $.each(split, function(i, v) {
        if (i < (split.length - 2)) {
          return carpeta += v + '/';
        }
      });
      if (folder.indexOf('../') !== -1) {
        carpeta = folder.replace('../', carpeta);
      }
    } else if (folder === '.' || folder === './') {
      carpeta = _this.env['PWD'];
      if (folder.indexOf('./') !== -1) {
        carpeta = folder.replace('./', carpeta);
      }
    } else {
      carpeta = folder;
    }
    return carpeta;
  };

  errorFormat = function(cmd, arg, msg) {
    print(cmd + ": " + arg + ": " + msg);
    return newLine();
  };

  errorFormatNNL = function(cmd, arg, msg) {
    return print(cmd + ": " + arg + ": " + msg);
  };

  getFormatting = function(value) {
    var c;
    c = $.webterminal.conf.colors;
    switch (value) {
      case 1:
        return {
          style: 'font-weight:bold',
          value: 'bold'
        };
      case 2:
        return {
          style: 'opacity: 0.5',
          value: 'dim'
        };
      case 4:
        return {
          style: 'text-decoration:underline',
          value: 'underline'
        };
      case 8:
        return {
          style: 'visibility: hidden',
          value: 'hidden'
        };
      case 30:
        return {
          style: 'color:' + c.black,
          value: 'color'
        };
      case 31:
        return {
          style: 'color:' + c.red,
          value: 'color'
        };
      case 32:
        return {
          style: 'color:' + c.green,
          value: 'color'
        };
      case 33:
        return {
          style: 'color:' + c.yellow,
          value: 'color'
        };
      case 34:
        return {
          style: 'color:' + c.blue,
          value: 'color'
        };
      case 35:
        return {
          style: 'color:' + c.magenta,
          value: 'color'
        };
      case 36:
        return {
          style: 'color:' + c.cyan,
          value: 'color'
        };
      case 37:
        return {
          style: 'color:' + c.lightgray,
          value: 'color'
        };
      case 40:
        return {
          style: 'background-color:' + c.black,
          value: 'background'
        };
      case 41:
        return {
          style: 'background-color:' + c.red,
          value: 'background'
        };
      case 42:
        return {
          style: 'background-color:' + c.green,
          value: 'background'
        };
      case 43:
        return {
          style: 'background-color:' + c.yellow,
          value: 'background'
        };
      case 44:
        return {
          style: 'background-color:' + c.blue,
          value: 'background'
        };
      case 45:
        return {
          style: 'background-color:' + c.magenta,
          value: 'background'
        };
      case 46:
        return {
          style: 'background-color:' + c.cyan,
          value: 'background'
        };
      case 47:
        return {
          style: 'background-color:' + c.lightgray,
          value: 'background'
        };
      case 49:
        return {
          style: 'background-color:transparent',
          value: 'background'
        };
      case 90:
        return {
          style: 'color:' + c.darkgray,
          value: 'color'
        };
      case 91:
        return {
          style: 'color:' + c.lightred,
          value: 'color'
        };
      case 92:
        return {
          style: 'color:' + c.lightgreen,
          value: 'color'
        };
      case 93:
        return {
          style: 'color:' + c.lightyellow,
          value: 'color'
        };
      case 94:
        return {
          style: 'color:' + c.lightblue,
          value: 'color'
        };
      case 95:
        return {
          style: 'color:' + c.lightmagenta,
          value: 'color'
        };
      case 96:
        return {
          style: 'color:' + c.lightcyan,
          value: 'color'
        };
      case 97:
        return {
          style: 'color:' + c.white,
          value: 'color'
        };
      case 100:
        return {
          style: 'background-color:' + c.darkgray,
          value: 'background'
        };
      case 101:
        return {
          style: 'background-color:' + c.lightred,
          value: 'background'
        };
      case 102:
        return {
          style: 'background-color:' + c.lightgreen,
          value: 'background'
        };
      case 103:
        return {
          style: 'background-color:' + c.lightyellow,
          value: 'background'
        };
      case 104:
        return {
          style: 'background-color:' + c.lightblue,
          value: 'background'
        };
      case 105:
        return {
          style: 'background-color:' + c.lightmagenta,
          value: 'background'
        };
      case 106:
        return {
          style: 'background-color:' + c.lightcyan,
          value: 'background'
        };
      case 107:
        return {
          style: 'background-color:' + c.white,
          value: 'background'
        };
    }
  };

  formattingToCss = function(fmt) {
    var css, k;
    css = '';
    for (k in fmt) {
      css += fmt[k] + ";";
    }
    return css;
  };

  addLang = function(langId, translations) {
    lang.available.push(langId);
    return lang.translations[langId] = translations;
  };

  (parpadeo = function() {
    if ($('span#l').length === 0) {
      $('body').append('<span id="l" style="display:none"></span>');
    }
    return $('span#l').delay(600).animate({
      'opacity': 0
    }, 10).delay(600).animate({
      'opacity': 1
    }, 10, parpadeo);
  })();

  addLang('en-gb', {
    "shell": {
      "help": {
        "1": "These shell commands are defined internally or externally. Type `help` to see this list.",
        "2": "Type `help name` to find out more about the function `name`.",
        "3": "Maybe some commands doesn't show up in this help, it depends on the web programmer.",
        "noHelp": "-bash: help: no help topics match"
      },
      "none": "command not found."
    },
    "help": {
      "help": ["Shows this help"],
      "echo": ["[arg ...] prints the argument"],
      "env": ["prints all the environment variables"],
      "export": ["sets a variable"],
      "reload": ["reload the console"],
      "ls": ["[directory ...]", "a list of files and directories of the argument/s given"],
      "cd": ["[directory] change the current working directory"],
      "rm": ["[file] delete a file"],
      "rmdir": ["[directory] removes a directory", "Removes a empty directory. In case of not be empty, you can use the option `-r`."],
      "touch": ["[filename] create a file"],
      "mkdir": ["[directoryname] create a folder"],
      "login": ["[user] [password] like sudo, but in a session"],
      "cwd": ["prints the cwd (Current Working Directory)"],
      "cat": ["[-n -b] [file] prints the file in the normal output", "Prints any file into the normal output.\n\t-n Put the line number next the line\n\t-b Number the non-blank output lines"]
    },
    "scriptError": "The value for `server` is true but you don't give a correct value for `script` [node.js, php]"
  });

  addLang('es-es', {
    "shell": {
      "help": {
        "1": "Estos comandos de consola están definidos interna o externamente. Escriba `help` para ver esta lista.",
        "2": "Escriba `help nombre` para encontrar más información sobre el comando `nombre`.",
        "3": "Tal vez algunos comandos no se muestren en esta ayuda, depende del programador.",
        "noHelp": "-bash: help: ningún tópico de ayuda encaja con"
      },
      "none": "comando no encontrado."
    },
    "help": {
      "help": ["Muestra esta ayuda"],
      "echo": ["[arg ...] imprime el argumento"],
      "env": ["imprime todos las variables de entorno"],
      "export": ["ajusta una variable"],
      "reload": ["recarga la consola"],
      "ls": ["[directory ...]", "una lista de archivos y carpetas del argumento/s"],
      "cd": ["[directory] cambia el direcotrio actual de trabajo"],
      "rm": ["[file] elimina un archivo"],
      "rmdir": ["[directory] elimina un directorio", "Elimina una carpeta vacía. Si no está vacía puedes usar la opción `-r`."],
      "touch": ["[filename] crea un archivo"],
      "mkdir": ["[directoryname] crea una carpeta"],
      "login": ["[user] [password] como sudo, pero en sesión"],
      "cwd": ["imprime el cwd (Current Working Directory)"],
      "cat": ["[-n -b] [file] imprime el contenido de un archivo", "Muestra el contenido de cualquier archivo.\n\t-n Enumera las lineas\n\t-b Enumera las lineas que no estén en blanco"]
    },
    "scriptError": "El valor para `server` is true pero no has dado un valor correcto para `script` [node.js, php]"
  });

  shell.cat = function(c, onEnd) {
    var fileName, url;
    if (c[1] !== void 0 && c[2] === void 0) {
      fileName = encodeURI(dirHelper(c[1]));
      url = urlHelper('cat', fileName);
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res !== 1) {
            print('<div style="text-align:left;">' + json.respuesta.mensaje + '</div>');
            return onEnd();
          } else {
            return errorFormat('cat', c[1], json.respuesta.mensaje);
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else if (c[1] !== void 0 && c[2] !== void 0) {
      if (c[1].indexOf('-' === 0)) {
        if (c[1] === '-n') {
          fileName = encodeURI(dirHelper(c[2]));
          url = urlHelper('cat', fileName);
          return $.getJSON(url, function(json, stat, xhr) {
            var out, slice;
            if (json.respuesta.res !== 1) {
              slice = json.respuesta.mensaje.split('<br>');
              out = '';
              $.each(slice, function(i, v) {
                if (i < 9) {
                  return out = out + '&nbsp;&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                } else if (i < 99) {
                  return out = out + '&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                } else if (i < 999) {
                  return out = out + '&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                } else if (i < 9999) {
                  return out = out + '&nbsp;' + (i + 1) + ' ' + v + '<br>';
                }
              });
              print('<div style="text-align:left;">' + out + '</div>');
              return onEnd();
            } else {
              return errorFormat('cat', c[2], json.respuesta.mensaje);
            }
          }).error(function() {
            throw 'Server script doesn\'t exist.';
          });
        } else if (c[1] === '-b') {
          fileName = encodeURI(dirHelper(c[2]));
          url = urlHelper('cat', fileName);
          return $.getJSON(url, function(json, stat, xhr) {
            var i, j, out, slice;
            if (json.respuesta.res !== 1) {
              slice = json.respuesta.mensaje.split('<br>');
              out = '';
              i = 0;
              j = 0;
              for(j = 0; j < slice.length; j++) {
                            var v = slice[j];
                            if (v != '') {
                                if (i < 9)
                                    out = out + '&nbsp;&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                else if (i < 99)
                                    out = out + '&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                else if (i < 999)
                                    out = out + '&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                else if (i < 9999)
                                    out = out + '&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                i++;
                            } else
                                out = out + '<br>';
                        };
              print('<div style="text-align:left;">' + out + '</div>');
              return onEnd();
            } else {
              return errorFormat('cat', c[1], json.respuesta.mensaje);
            }
          }).error(function() {
            throw 'Server script doesn\'t exist.';
          });
        }
      } else {
        print('usage: cat [-n] file');
        return onEnd();
      }
    } else {
      print('usage: cat file');
      return onEnd();
    }
  };

  shell.cd = function(c, onEnd) {
    var carpeta, url;
    if (c[1] !== void 0) {
      carpeta = dirHelper(c[1]);
      url = urlHelper('cd', carpeta);
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 1) {
            return errorFormat('cd', c[1], json.respuesta.mensaje);
          } else {
            _this.env['PWD'] = json.respuesta.mensaje;
            return onEnd();
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else {
      return onEnd();
    }
  };

  shell.cwd = function(c, onEnd) {
    print(_this.env['PWD']);
    return onEnd();
  };

  shell.echo = function(c, onEnd) {
    var str;
    str = "";
    $.each(c, function(a, b) {
      if (a !== 0) {
        return str += " " + b;
      }
    });
    print(str);
    print("\n");
    return onEnd();
  };

  shell.env = function(c, onEnd) {
    $.each(_this.env, function(a, b) {
      return print(a + " = " + b + "\n");
    });
    return onEnd();
  };

  shell["export"] = function(c, onEnd) {
    var kv;
    if (c[1] !== void 0) {
      kv = c[1].split("=");
      _this.env[kv[0]] = kv[1];
      print(kv[0] + " = " + kv[1] + "\n");
    } else {
      print('usage: export VARIABLE=VALUE\n');
    }
    return onEnd();
  };

  shell.help = function(c, onEnd) {
    var b;
    if (c[1] === void 0) {
      print("webterminal, version " + version + " (" + window.navigator.userAgent + ")");
      print($.webterminal.idioma.shell.help[1]);
      print('\n');
      print($.webterminal.idioma.shell.help[2]);
      print('\n');
      print($.webterminal.idioma.shell.help[3]);
      print('\n');
      $.each(_this.lang.help, function(a, b) {
        while (a.length < 7) {
          a = a + " ";
        }
        return print("&nbsp;&nbsp;" + (a.replace(/\ /g, '&nbsp;')) + " " + b[0] + "\n");
      });
    } else if (c[1] && _this.help[c[1]] !== void 0) {
      b = _this.help[c[1]];
      print(c[1] + ": " + b[0]);
      print('\n');
      if (b[1]) {
        print(b[1]);
      }
      if (b[1]) {
        print('\n');
      }
    } else if (c[1] && _this.lang.help[c[1]] !== void 0) {
      b = _this.lang.help[c[1]];
      print(c[1] + ": " + b[0])(print('\n'));
      if (b[1]) {
        print(b[1].replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'));
      }
    } else if (_this.help[c[1]] === void 0 && _this.lang.help[c[1]] === void 0) {
      print($.webterminal.idioma.shell.help['noHelp'] + " `" + c[1] + "`.\n");
    }
    return onEnd();
  };

  shell.login = function(c, onEnd) {
    var url;
    if (c[1] !== void 0) {
      url = urlHelper('login', c[1]) + '&password=' + (c[2] !== void 0 ? sha256(c[1] + ":" + c[2]) : 'null');
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 1) {
            print(json.respuesta.mensaje);
          } else {
            _this.env['USER'] = json.respuesta.mensaje;
          }
          return onEnd();
        });
      }
    } else {
      print('No user/password given');
      print('Usage: login USER [PASSWORD]');
      return onEnd();
    }
  };

  shell.ls = function(c, onEnd) {
    var url;
    if (c[1] && c[1].search('-') !== -1) {
      errorFormatNNL('ls', c[1], 'illegal option');
      print('usage: ls [directory ...]');
      return onEnd();
    } else if (c.length === 2 || c.length === 1) {
      url = urlHelper('ls', c[1] ? _this.env.PWD + c[1] : _this.env['PWD']);
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 0) {
            $.each(json.respuesta.mensaje, function(i, v) {
              return print(v + "\n");
            });
            return onEnd();
          } else {
            return errorFormat('ls', c[1], json.respuesta.mensaje);
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else {
      $.each(c, function(value, key) {
        if (value) {
          url = urlHelper('ls', _this.env.PWD + key);
          if (url) {
            return $.getJSON(url, function(json, stat, xhr) {
              if (json.respuesta.res === 0) {
                print(key + ':');
                $.each(json.respuesta.mensaje, function(i, v) {
                  return print(v + "\n");
                });
                if (value + 1 !== c.length) {
                  return print('');
                }
              } else {
                errorFormatNNL('ls', c[1], json.respuesta.mensaje);
                return print('');
              }
            }).error(function() {
              throw 'Server script doesn\'t exist.';
            });
          } else {
            return print('');
          }
        }
      });
      return onEnd();
    }
  };

  shell.mkdir = function(c, onEnd) {
    var fileName, url;
    if (c[1] !== void 0) {
      fileName = dirHelper(c[1]);
      url = urlHelper('mkdir', c[1]);
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 1) {
            return errorFormat('mkdir', c[1], json.respuesta.mensaje);
          } else {
            return onEnd();
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else {
      print('usage: mkdir directoryName');
      return onEnd();
    }
  };

  shell.none = function(c, onEnd) {
    if (c[0] !== "") {
      print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none);
    } else {
      return;
    }
    return onEnd();
  };

  shell.printf = function(c, onEnd) {
    var a, doFormat, format, formatBaseX, formatString, i, justify, pad, regex;
    if (c.length < 2) {
      print('printf: usage printf format [arguments]');
      onEnd();
      return;
    }
    regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
    a = c.slice(1);
    i = 0;
    format = a[i++];
    pad = function(str, len, chr, leftJustify) {
      var padding;
      if (!chr) {
        chr = ' ';
      }
      padding = str.length >= length ? '' : Array(1 + len - str.length >>> 0).join(chr);
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
          value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
        }
      }
      return value;
    };
    formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
      var number;
      number = value >>> 0;
      prefix = prefix && number && {
        '2': '0b',
        '8': '0',
        '16': '0x'
      }[base] || '';
      value = prefix + pad(number.toString(base), precision || 0, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };
    formatString = function(value, leftJustify, minWidth, prec, zeroPad, customPadChar) {
      if (prec !== null) {
        value = value.slice(0, prec);
      }
      return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };
    doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
      var customPadChar, flagsl, leftJustify, method, number, positivePrefix, prefix, prefixBaseX, textTransform, value, zeroPad;
      if (substring === '%%') {
        return '%';
      }
      leftJustify = false;
      positivePrefix = '';
      zeroPad = false;
      prefixBaseX = false;
      customPadChar = ' ';
      flagsl = flags.length;
      for(var j = 0; flags && j < flagsl; j++) { j;
      switch (flags.charAt(j)) {
        case ' ':
          positivePrefix = ' ';
          break;
        case '+':
          positivePrefix = '+';
          break;
        case '-':
          leftJustify = true;
          break;
        case "'":
          customPadChar = flags.charAt(j + 1);
          break;
        case '0':
          zeroPad = true;
          break;
        case '#':
          prefixBaseX = true;
      }
      };
      if (!minWidth) {
        minWidth = 0;
      } else if (minWidth === '*') {
        minWidth = +a[i++];
      } else if (minWidth.charAt(0 === '*')) {
        minWidth = +a[minWidth.slice(1, -1)];
      } else {
        minWidth = +minWidth;
      }
      if (minWidth < 0) {
        minWidth = -minWidth;
        leftJustify = true;
      }
      if (!isFinite(minWidth)) {
        throw new Error('sprintf: (minimum-)width must be finite');
      }
      if (!precision) {
        precision = 'fFeE'.indexOf(type) > -1 ? 6 : type === 'd' ? 0 : void 0;
      } else if (precision === '*') {
        precision = +a[i++];
      } else if (precision.charAt(0) === '*') {
        precision = +a[precision.slice(1, -1)];
      } else {
        precision = +precision;
      }
      value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
      switch (type) {
        case 's':
          return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
        case 'c':
          return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case 'b':
          return formatString(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'o':
          return formatString(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'x':
          return formatString(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'X':
          return formatString(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case 'u':
          return formatString(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'i':
        case 'd':
          number = +value || 0;
          number = Math.round(number - number % 1);
          prefix = number < 0 ? '-' : positivePrefix;
          value = prefix + pad(String(Math.abs(number)), precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'g':
          number = +value;
          prefix = number < 0 ? '-' : positivePrefix;
          method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
          textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
          value = prefix + Math.abs(number)[method](precision);
          return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
        default:
          return substring;
      }
    };
    print(format.replace(regex, doFormat));
    return onEnd();
  };

  shell.reload = function() {
    $(_this.element).delay(333).animate({
      'opacity': 0
    }, 1111, function() {
      return window.location = window.location;
    });
    return print('Wait…<span id="l">_</span>');
  };

  shell.rm = function(c, onEnd) {
    var file, url;
    if (c[1] !== void 0) {
      file = dirHelper(c[1]);
      url = urlHelper('rm', file);
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 1) {
            return errorFormat('rm', c[1], json.respuesta.mensaje);
          } else {
            return onEnd();
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else {
      print('usage: rm file');
      return onEnd();
    }
  };

  shell.rmdir = function(c, onEnd) {
    var file, url;
    if (c[1] !== void 0) {
      file = dirHelper(c[1]);
      url = urlHelper('rmdir', file);
      if (c[2] === '-r') {
        url = url + '&recursive';
      }
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 1) {
            return errorFormat('rmdir', c[1], json.respuesta.mensaje);
          } else {
            return onEnd();
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else {
      print('usage: rm directory');
      return onEnd();
    }
  };

  shell.touch = function(c, onEnd) {
    var fileName, url;
    if (c[1] !== void 0) {
      fileName = dirHelper(c[1]);
      url = urlHelper('touch', c[1]);
      if (url) {
        return $.getJSON(url, function(json, stat, xhr) {
          if (json.respuesta.res === 1) {
            return errorFormat('touch', c[1], json.respuesta.mensaje);
          } else {
            return onEnd();
          }
        }).error(function() {
          throw 'Server script doesn\'t exist.';
        });
      } else {
        return onEnd();
      }
    } else {
      print('usage: touch fileName');
      return onEnd();
    }
  };

  Plugin = function(element, options) {
    this.element = element;
    this.conf = $.extend({}, conf, options.conf);
    this.conf.colors = $.extend({}, conf.colors, options.conf.colors);
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
        fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id)) {
          return;
        }
        js = document.createElement('script');
        js.id = id;
        js.src = "https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.5.0/sha256.min.js";
        return fjs.parentNode.insertBefore(js, fjs);
      })('sha256');
      this._showTerm();
      this.lang();
      this.enLaBusquedaDelTextoPerdido();
      this._fill(true);
      return this.console();
    },
    _showTerm: function() {
      return $(this.element).delay(333).animate({
        'opacity': 1
      }, 1111);
    },
    _hideTerm: function(c) {
      return $(this.element).delay(333).animate({
        'opacity': 0
      }, 1111, c);
    },
    enLaBusquedaDelTextoPerdido: function() {
      this.width = this.conf.width - 13;
      this.height = this.conf.height;
      $(this.element).css({
        'text-align': 'justify',
        'overflow-y': 'auto',
        'width': (this.width + 13) + 'px',
        'height': this.height + 'px'
      });
      if ($(this.element).text().length === 0) {
        return $(this.element).append('<div class="consola"></div>').find(".consola").append('<div class="consola-line" style="width:' + this.width + 'px"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# ' + env["PWD"] + " " + env["USER"] + "$ ");
      }
    },
    lang: function() {
      var idioma;
      idioma = window.navigator.language.toLowerCase();
      if (lang.available.indexOf(idioma) === -1) {
        idioma = 'en-gb';
      }
      $.webterminal.idioma = lang.translations[idioma];
      return Plugin.prototype.lang = lang.translations[idioma];
    },
    console: function() {
      _this = this;
      return $(document).keypress(function(e) {
        var comando, fcomando, keyCode, line, lines, tempComandoString;
        keyCode = e.which;
        lines = $(_this.element).find(".consola-line").length;
        line = $(".consola-line")[lines - 1];
        if (e.metaKey || (e.ctrlKey && keyCode === 82) || (e.ctrlKey && keyCode === 84)) {
          return;
        }
        e.preventDefault();
        _this._fill(false);
        if ($(".consola").length === 0) {
          $(_this.element).append('<div class="consola"></div>').find("span#l").remove();
        }
        if (lines === 0) {
          $(".consola").append('<div class="consola-line" style="width: ' + _this.width + 'px"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# ' + _this.env["PWD"] + " " + _this.env["USER"] + "$ ");
        } else if (String.fromCharCode(keyCode) !== void 0 && keyCode !== 8 && keyCode !== 13 && keyCode !== 0) {
          append(String.fromCharCode(keyCode));
        } else if (keyCode === 13) {
          $(line).find("span#l").remove();
          comando = $(line).find("span#g").text().split(" ");
          _this.historial[_this.historial.length] = $(line).find("span#g").text();
          $.each(comando, function(a, b) {
            var i, results, sustituto, variable, vars;
            if (b.search("$") !== -1) {
              vars = b.split("$").length - 1;
              i = 0;
              results = [];
              while (i < vars) {
                variable = b.split("$")[1];
                sustituto = _this.env[variable];
                if (sustituto) {
                  comando[a] = sustituto;
                } else {
                  comando[a] = "";
                }
                results.push(i++);
              }
              return results;
            }
          });
          fcomando = [];
          tempComandoString = '';
          $.each(comando, function(key, value) {
            if (value.search('"') !== -1 || value.search("'") !== -1) {
              if (tempComandoString) {
                tempComandoString += ' ' + value.substr(0, value.length - 1);
                fcomando.push(tempComandoString);
                return tempComandoString = '';
              } else if (!tempComandoString && (value.lastIndexOf('"') === 0 || value.lastIndexOf("'") === 0)) {
                return tempComandoString += value.substr(1);
              } else {
                return fcomando.push(value.substr(1, value.length - 2));
              }
            } else if (!tempComandoString) {
              return fcomando.push(value);
            } else if (tempComandoString) {
              return tempComandoString += ' ' + value;
            }
          });
          comando = fcomando;
          print("\n");
          if (_this.shell[comando[0]] !== void 0 && comando[0] !== void 0) {
            try {
              _this.shell[comando[0]](comando, function() {
                return newLine();
              });
            } catch (error) {
              e = error;
              print('<span style="color:red">&gt;&nbsp;Has ocurred an error. See dev tools console</span>');
              newLine();
              throw e;
              debugger;
            }
          } else if (_this.shell[comando[0]] === void 0 && comando[0] !== void 0) {
            _this.shell["none"](comando, newLine);
          }
        }
        return $(_this.element).scrollTop(100000);
      }).keydown(function(e) {
        var comando, keyCode, line, lines, num;
        keyCode = e.which;
        lines = $(_this.element).find(".consola-line").length;
        line = $(".consola-line")[lines - 1];
        if (keyCode === 38) {
          e.preventDefault();
          if ($(line).find('span#g').data('historial') === void 0) {
            $(line).find("span#g").empty().data('historial', _this.historial.length - 1);
            comando = _this.historial[_this.historial.length - 1];
            append(comando);
          } else {
            num = parseInt($(line).find('span#g').data('historial')) - 1;
            comando = _this.historial[num];
            if (num <= _this.historial.length && num >= 0) {
              $(line).find("span#g").empty().data('historial', num);
              append(comando);
            }
          }
        } else if (keyCode === 40) {
          e.preventDefault();
          if ($(line).find('span#g').data('historial') === void 0) {
            $(line).find("span#g").empty().data('historial', _this.historial.length + 1);
            comando = _this.historial[_this.historial.length + 1];
          } else {
            num = parseInt($(line).find('span#g').data('historial')) + 1;
            comando = _this.historial[num];
            if (num <= _this.historial.length && num >= 0) {
              $(line).find("span#g").empty().data('historial', num);
              append(comando);
            }
          }
        } else if (keyCode === 8) {
          remove();
        } else if (keyCode === 39) {
          e.preventDefault();
        } else if (keyCode === 37) {
          e.preventDefault();
        }
        $(_this.element).scrollTop(100000);
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
    if (options === void 0 || typeof options === 'object') {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          return $.data(this, 'plugin_' + pluginName, new Plugin(this, options === void 0 ? {} : options));
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
