shell.login = (c) ->
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