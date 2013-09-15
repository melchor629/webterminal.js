shell.rmdir = (c) ->
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