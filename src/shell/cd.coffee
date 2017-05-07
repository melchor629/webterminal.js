shell.cd = (c, onEnd) ->
    if c[1] isnt undefined
        carpeta = dirHelper(c[1])
        url = urlHelper('cd', carpeta)
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res is 1
                    errorFormat 'cd', c[1], json.respuesta.mensaje
                else
                    _this.env['PWD'] = json.respuesta.mensaje
                    onEnd()
            ).error(-> throw 'Server script doesn\'t exist.')
        else onEnd()
    else
        onEnd()
