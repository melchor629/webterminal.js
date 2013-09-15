shell.env = () ->
    $.each(_this.env, (a, b) ->
        print(a + "=" + b)
    )
    newLine()