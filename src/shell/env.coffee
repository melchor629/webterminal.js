shell.env = (c, onEnd) ->
    $.each(_this.env, (a, b) ->
        print("#{a} = #{b}\n")
    )
    onEnd()