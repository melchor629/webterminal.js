shell.none = (c, onEnd) ->
    if c[0] isnt ""
        print("-bash: " + c[0] + ": " + $.webterminal.idioma.shell.none)
    else
        return
    onEnd()
