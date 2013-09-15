shell.echo = (c) ->
    str = ""
    $.each(c, (a, b) ->
        if a isnt 0
            str += " " + b
    )
    print(str)
    newLine()