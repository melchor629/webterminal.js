shell.none = (c) ->
    if c[0] isnt ""
        print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none)
    else
        return
    newLine()