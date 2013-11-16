shell.ls = (c) ->
    if c[1] and c[1].search('-') isnt -1
        errorFormatNNL 'ls', c[1], 'illegal option'
        print 'usage: ls [directory ...]'
        newLine()
    else if c.length is 2 or c.length is 1
        url = urlHelper('ls', if c[1] then _this.env.PWD + c[1] else _this.env['PWD'])
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
    else
        $.each(c, (value, key) ->
            if value
                url = urlHelper('ls',  _this.env.PWD + key)
                if url
                    $.getJSON(url, (json, stat, xhr) ->
                        if json.respuesta.res is 0
                            print key + ':'
                            $.each(json.respuesta.mensaje, (i, v) ->
                                print(v)
                            )
                            if value+1 isnt c.length
                                print ''
                        else
                            errorFormatNNL 'ls', c[1], json.respuesta.mensaje
                            print ''
                    ).error(()-> throw 'Server script doesn\'t exist.' )
                else
                    print ''
        )
        newLine()