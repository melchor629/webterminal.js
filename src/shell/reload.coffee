shell.reload = () ->
    $(_this.element).delay(333).animate({'opacity':0}, 1111, () ->
        window.location = window.location
    )
    print('Wait…<span id="l">_</span>')