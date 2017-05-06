shell.echo = (c, onEnd) ->
    str = ""
    $.each(c, (a, b) ->
        if a isnt 0
            str += " " + b
    )
    print(str)
    print("\n")
    onEnd()