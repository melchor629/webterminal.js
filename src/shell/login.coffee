shell.login = (c, onEnd) ->
    if c[1] isnt undefined
        url = urlHelper('login', c[1]) + '&password=' + (if c[2] isnt undefined then sha256("#{c[1]}:#{c[2]}") else 'null')
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res == 1
                    print(json.respuesta.mensaje)
                else
                    _this.env['USER'] = json.respuesta.mensaje
                onEnd()
            )
    else
        print('No user/password given')
        print('Usage: login USER [PASSWORD]')
        onEnd()
