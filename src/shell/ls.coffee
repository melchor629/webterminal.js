shell.ls = (c) ->
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