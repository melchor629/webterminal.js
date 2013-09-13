shell = 
    "help": (c) ->
        if c[1] is undefined
            print("webterminal, version " + version + " (" + window.navigator.userAgent + ")")
            print($.webterminal.idioma.shell.help[1])
            print($.webterminal.idioma.shell.help[2])
            print($.webterminal.idioma.shell.help[3])
            $.each(_this.lang.help, (a, b) ->
                print("&nbsp;" + a + " " + b[0])
            )
            $.each(_this.help, (a, b) ->
                print("&nbsp;" + a + " " + b[0])
            )
        else if c[1] and _this.help[c[1]] isnt undefined
            b = _this.help[c[1]]
            print(c[1] + ": " + b[0])
            print(b[1]) if b[1]
        else if c[1] and _this.lang.help[c[1]] isnt undefined
            b = _this.lang.help[c[1]]
            print(c[1] + ": " + b[0])
            print(b[1].replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')) if b[1]
        else if _this.help[c[1]] is undefined and _this.lang.help[c[1]] is undefined
            print($.webterminal.idioma.shell.help['noHelp'] + " `" + c[1] + "`.")
        newLine()

    "echo": (c) ->
        str = ""
        $.each(c, (a, b) ->
            if a isnt 0
                str += " " + b
        )
        print(str)
        newLine()

    "env": () ->
        $.each(_this.env, (a, b) ->
            print(a + "=" + b)
        )
        newLine()

    "export": (c) ->
        if c[1] isnt undefined
            kv = c[1].split("=")
            _this.env[kv[0]] = kv[1]
            print(kv[0] + " = " + kv[1])
        else
            print('usage: export VARIABLE=VALUE')
        newLine()

    "reload": () ->
        $(_this.element).delay(333).animate({'opacity':0}, 1111, () ->
            window.location = window.location
        )
        print('Wait…<span id="l">_</span>')

    "ls": (c) ->
        url = urlHelper('ls', _this.env['PWD'])
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res is 0
                    $.each(json.respuesta.mensaje, (i, v) ->
                        print(v)
                    )
                    newLine()
                else
                    errorFormat 'ls', c[1], json.respuesta.mensaje
            ).error(()-> throw 'Server script doesn\'t exist.' )
        else
            newLine()

    "cd": (c) ->
        if c[1] isnt undefined
            carpeta = dirHelper(c[1])
            url = urlHelper('cd', carpeta)
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        errorFormat 'cd', c[1], json.respuesta.mensaje
                    else
                        _this.env['PWD'] = json.respuesta.mensaje
                        newLine()
                ).error(-> throw 'Server script doesn\'t exist.')
            else newLine()
        else
            newLine()

    "rm": (c) ->
        if c[1] isnt undefined
            file = dirHelper(c[1])
            url = urlHelper('rm', file)
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        errorFormat 'rm', c[1], json.respuesta.mensaje
                    else
                        newLine()
                ).error(-> throw 'Server script doesn\'t exist.' )
            else newLine()
        else
            print('usage: rm file')
            newLine()

    "rmdir": (c) ->
        if c[1] isnt undefined
            file = dirHelper(c[1])
            url = urlHelper('rmdir', file)
            if c[2] is '-r'
                url = url + '&recursive'
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        errorFormat 'rmdir', c[1], json.respuesta.mensaje
                    else
                        newLine()
                ).error(-> throw 'Server script doesn\'t exist.')
            else newLine()
        else
            print('usage: rm directory')
            newLine()

    "touch": (c) ->
        if c[1] isnt undefined
            fileName = dirHelper c[1]
            url = urlHelper 'touch', c[1]
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        errorFormat 'touch', c[1], json.respuesta.mensaje
                    else
                        newLine()
                ).error(-> throw 'Server script doesn\'t exist.')
            else newLine()
        else
            print 'usage: touch fileName'
            newLine()

    "mkdir": (c) ->
        if c[1] isnt undefined
            fileName = dirHelper c[1]
            url = urlHelper 'mkdir', c[1]
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        errorFormat 'mkdir', c[1], json.respuesta.mensaje
                    else
                        newLine()
                ).error(-> throw 'Server script doesn\'t exist.')
            else newLine()
        else
            print 'usage: mkdir directoryName'
            newLine()

    "cwd": ->
        print _this.env['PWD']
        newLine()

    "cat": (c) ->
        #TODO add more functionality, because this command is simple but powerful
        if c[1] isnt undefined and c[2] is undefined
            fileName = encodeURI dirHelper c[1]
            url = urlHelper 'cat', fileName
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res isnt 1
                        print '<div style="text-align:left;">'+json.respuesta.mensaje+'</div>'
                        newLine()
                    else
                        errorFormat 'cat', c[1], json.respuesta.mensaje
                ).error(-> throw 'Server script doesn\'t exist.')
            else
                newLine()
        else if c[1] isnt undefined and c[2] isnt undefined
            if c[1].indexOf '-' is 0
                if c[1] is '-n'
                    fileName = encodeURI dirHelper c[2]
                    url = urlHelper 'cat', fileName
                    $.getJSON(url, (json, stat, xhr) ->
                        if json.respuesta.res isnt 1
                            slice = json.respuesta.mensaje.split('<br>')
                            out = ''
                            $.each slice, (i, v) ->
                                if i < 9
                                    out = out + '&nbsp;&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>'
                                else if i < 99
                                    out = out + '&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>'
                                else if i < 999
                                    out = out + '&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>'
                                else if i < 9999
                                    out = out + '&nbsp;' + (i + 1) + ' ' + v + '<br>'
                            print '<div style="text-align:left;">'+out+'</div>';
                            newLine()
                        else
                            errorFormat 'cat', c[2], json.respuesta.mensaje
                    ).error(-> throw 'Server script doesn\'t exist.')
                else if c[1] is '-b'
                    fileName = encodeURI dirHelper c[2]
                    url = urlHelper 'cat', fileName
                    $.getJSON(url, (json, stat, xhr) ->
                        if json.respuesta.res isnt 1
                            slice = json.respuesta.mensaje.split('<br>')
                            out = ''
                            i = 0
                            j = 0
                            `for(j = 0; j < slice.length; j++) {
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
                            }`
                            print '<div style="text-align:left;">'+out+'</div>';
                            newLine()
                        else
                            errorFormat 'cat', c[1], json.respuesta.mensaje
                    ).error(-> throw 'Server script doesn\'t exist.')
            else
                #fileName1 = encodeURI dirHelper c[1]
                #fileName2 = encodeURI dirHelper c[2]
                #url = urlHelper 'cat', fileName1, fileName2
                #$.getJSON(url, (json, stat, xhr) ->
                #    print json.respuesta.mensaje
                #    newLine()
                #).error(-> throw 'Server script doesn\'t exist.');
                print 'usage: cat [-n] file'
                newLine()
        else
            print 'usage: cat file'
            newLine()

    "login": (c) ->
        if c[1] isnt undefined 
            url = urlHelper('login', c[1]) + '&password=' + (if c[2] isnt undefined then MD5(c[2]) else 'null')
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res == 1
                        print(json.respuesta.mensaje)
                    else
                        _this.env['USER'] = json.respuesta.mensaje
                    newLine()
                )
        else
            print('No user/password given')
            print('Usage: login USER [PASSWORD]')
            newLine()

    "none": (c) ->
        if c[0] isnt ""
            print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none)
        else
            return
        newLine()