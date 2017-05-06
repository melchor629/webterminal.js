shell.touch = (c, onEnd) ->
    if c[1] isnt undefined
        fileName = dirHelper c[1]
        url = urlHelper 'touch', c[1]
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res is 1
                    errorFormat 'touch', c[1], json.respuesta.mensaje
                else
                    onEnd()
            ).error(-> throw 'Server script doesn\'t exist.')
        else onEnd()
    else
        print 'usage: touch fileName'
        onEnd()