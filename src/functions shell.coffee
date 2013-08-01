shell = 
    "help": (c) ->
        if c[1] is undefined
            print("webterminal, version " + version + " (" + window.navigator.userAgent + ")");
            print($.webterminal.idioma.shell.help[1]);
            print($.webterminal.idioma.shell.help[2]);
            print($.webterminal.idioma.shell.help[3]);
            $.each(help, (a, b) ->
                print("&nbsp;" + a + " " + b[0]);
            );
        else if c[1] and help[c[1]] isnt undefined
            b = _this.help[c[1]];
            print(c[1] + ": " + b[0]);
            print(b[1]);
        else if help[c[1]] is undefined
            print($.webterminal.idioma.shell.help['noHelp'] + " `" + c[1] + "`.");
        newLine();

    "echo": (c) ->
        str = "";
        $.each(c, (a, b) ->
            if a isnt 0
                str += " " + b;
        );
        print(str);
        newLine();

    "env": () ->
        $.each(_this.env, (a, b) ->
            print(a + "=" + b);
        );
        newLine();

    "export": (c) ->
        if c[1] isnt undefined
            kv = c[1].split("=");
            _this.env[kv[0]] = kv[1];
            print(kv[0] + " = " + kv[1]);
        else
            print('usage: export VARIABLE=VALUE');
        newLine();

    "reload": () ->
        $(element).delay(333).animate({'opacity':0}, 1111, () ->
            window.location = window.location;
        );
        print('Wait…<span id="l">_</span>');

    "ls": (c) ->
        url = urlHelper('ls', _this.env['PWD']);
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res is 0
                    $.each(json.respuesta.mensaje, (i, v) ->
                        print(v)
                    );
                else
                    print json.respuesta.mensaje
                newLine();
            ).error(()-> throw 'Server script doesn\'t exist.' );
        else
            newLine();

    "cd": (c) ->
        if c[1] isnt undefined
            carpeta = dirHelper(c[1]);
            url = urlHelper('cd', carpeta);
            url = url + '&PWD=' + _this.env['PWD'];
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        print(json.respuesta.mensaje);
                    else
                        _this.env['PWD'] = json.respuesta.mensaje;
                    newLine();
                ).error(-> throw 'Server script doesn\'t exist.');
            else newLine();
        else
            newLine();

    "rm": (c) ->
        if c[1] isnt undefined
            file = dirHelper(c[1]);
            url = urlHelper('rm', file);
            url = url + '&PWD=' + _this.env['PWD'];
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        print(json.respuesta.mensaje);
                    newLine();
                ).error(-> throw 'Server script doesn\'t exist.' );
            else newLine();
        else
            print('usage: rm file');
            newLine();

    "rmdir": (c) ->
        if c[1] isnt undefined
            file = dirHelper(c[1]);
            url = urlHelper('rmdir', file);
            url = url + '&PWD=' + _this.env['PWD'];
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        print(json.respuesta.mensaje);
                    newLine();
                ).error(-> throw 'Server script doesn\'t exist.');
            else newLine();
        else
            print('usage: rm directory');
            newLine();

    "touch": (c) ->
        if c[1] isnt undefined
            fileName = dirHelper c[1]
            url = urlHelper 'touch', c[1]
            url = url + '&PWD=' + _this.env['PWD']
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        print json.respuesta.mensaje
                    newLine()
                ).error(-> throw 'Server script doesn\'t exist.');
            else newLine()
        else
            print 'usage: touch fileName'
            newLine()

    "mkdir": (c) ->
        if c[1] isnt undefined
            fileName = dirHelper c[1]
            url = urlHelper 'mkdir', c[1]
            url = url + '&PWD=' + _this.env['PWD']
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res is 1
                        print json.respuesta.mensaje
                    newLine()
                ).error(-> throw 'Server script doesn\'t exist.');
            else newLine()
        else
            print 'usage: mkdir directoryName'
            newLine()

    "login": (c) ->
        if c[1] isnt undefined 
            url = urlHelper('login', c[1]) + '&password=' + (if c[2] isnt undefined then MD5(c[2]) else 'null');
            if url
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res == 1
                        print(json.respuesta.mensaje);
                    else
                        _this.env['USER'] = json.respuesta.mensaje;
                    newLine();
                );
        else
            print('No user/password given');
            print('Usage: login USER [PASSWORD]');
            newLine();

    "none": (c) ->
        if c[0] isnt ""
            print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none);
        else
            return;
        newLine();