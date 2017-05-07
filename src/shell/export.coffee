shell.export = (c, onEnd) ->
    if c[1] isnt undefined
        kv = c[1].split("=")
        _this.env[kv[0]] = kv[1]
        print("#{kv[0]} = #{kv[1]}\n")
    else
        print('usage: export VARIABLE=VALUE\n')
    onEnd()
