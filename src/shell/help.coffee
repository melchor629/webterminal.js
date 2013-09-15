shell.help = (c) ->
    if c[1] is undefined
        print("webterminal, version " + version + " (" + window.navigator.userAgent + ")")
        print($.webterminal.idioma.shell.help[1])
        print($.webterminal.idioma.shell.help[2])
        print($.webterminal.idioma.shell.help[3])
        $.each(_this.lang.help, (a, b) ->
            print("&nbsp;" + a + " " + b[0])
        )
        $.each(_this.help, (a, b) ->
            print("&nbsp;" + a + " " + b[0])
        )
    else if c[1] and _this.help[c[1]] isnt undefined
        b = _this.help[c[1]]
        print(c[1] + ": " + b[0])
        print(b[1]) if b[1]
    else if c[1] and _this.lang.help[c[1]] isnt undefined
        b = _this.lang.help[c[1]]
        print(c[1] + ": " + b[0])
        print(b[1].replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')) if b[1]
    else if _this.help[c[1]] is undefined and _this.lang.help[c[1]] is undefined
        print($.webterminal.idioma.shell.help['noHelp'] + " `" + c[1] + "`.")
    newLine()