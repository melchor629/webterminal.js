shell.cat = (c) ->
    #TODO add more functionality, because this command is simple but powerful
    if c[1] isnt undefined and c[2] is undefined
        fileName = encodeURI dirHelper c[1]
        url = urlHelper 'cat', fileName
        if url
            $.getJSON(url, (json, stat, xhr) ->
                if json.respuesta.res isnt 1
                    print '<div style="text-align:left;">'+json.respuesta.mensaje+'</div>'
                    newLine()
                else
                    errorFormat 'cat', c[1], json.respuesta.mensaje
            ).error(-> throw 'Server script doesn\'t exist.')
        else
            newLine()
    else if c[1] isnt undefined and c[2] isnt undefined
        if c[1].indexOf '-' is 0
            if c[1] is '-n'
                fileName = encodeURI dirHelper c[2]
                url = urlHelper 'cat', fileName
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res isnt 1
                        slice = json.respuesta.mensaje.split('<br>')
                        out = ''
                        $.each slice, (i, v) ->
                            if i < 9
                                out = out + '&nbsp;&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>'
                            else if i < 99
                                out = out + '&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>'
                            else if i < 999
                                out = out + '&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>'
                            else if i < 9999
                                out = out + '&nbsp;' + (i + 1) + ' ' + v + '<br>'
                        print '<div style="text-align:left;">'+out+'</div>';
                        newLine()
                    else
                        errorFormat 'cat', c[2], json.respuesta.mensaje
                ).error(-> throw 'Server script doesn\'t exist.')
            else if c[1] is '-b'
                fileName = encodeURI dirHelper c[2]
                url = urlHelper 'cat', fileName
                $.getJSON(url, (json, stat, xhr) ->
                    if json.respuesta.res isnt 1
                        slice = json.respuesta.mensaje.split('<br>')
                        out = ''
                        i = 0
                        j = 0
                        `for(j = 0; j < slice.length; j++) {
                            var v = slice[j];
                            if (v != '') {
                                if (i < 9)
                                    out = out + '&nbsp;&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                else if (i < 99)
                                    out = out + '&nbsp;&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                else if (i < 999)
                                    out = out + '&nbsp;&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                else if (i < 9999)
                                    out = out + '&nbsp;' + (i + 1) + ' ' + v + '<br>';
                                i++;
                            } else
                                out = out + '<br>';
                        }`
                        print '<div style="text-align:left;">'+out+'</div>';
                        newLine()
                    else
                        errorFormat 'cat', c[1], json.respuesta.mensaje
                ).error(-> throw 'Server script doesn\'t exist.')
        else
            print 'usage: cat [-n] file'
            newLine()
    else
        print 'usage: cat file'
        newLine()