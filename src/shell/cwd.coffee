shell.cwd = (c, onEnd) ->
    print _this.env['PWD']
    onEnd()
