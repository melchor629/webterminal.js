shell.rm = (c, onEnd) ->
    if c[1] isnt undefined
        file = dirHelper(c[1])
        url = urlHelper('rm', file)
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res is 1
                    errorFormat 'rm', c[1], json.respuesta.mensaje
                else
                    onEnd()
            ).error(-> throw 'Server script doesn\'t exist.' )
        else onEnd()
    else
        print('usage: rm file')
        onEnd()