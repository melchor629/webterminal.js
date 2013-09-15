shell.touch = (c) ->
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