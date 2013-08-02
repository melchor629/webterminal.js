Plugin = (element, options) ->
    this.element = element
    this.conf = $.extend({}, conf, options.conf)
    this.shell = $.extend({}, shell, options.shell)
    this.env = $.extend({}, env, options.env)
    this.help = $.extend({}, help, options.help)
    this.historial = []

    this.init()


Plugin.prototype =
    init: ->
        ((id) ->
            fjs = document.getElementsByTagName('script')[0]
            if document.getElementById(id)
                return
            js = document.createElement('script'); js.id = id
            js.src = "lib/md5.min.js"
            fjs.parentNode.insertBefore(js, fjs)
        )('md5')

        this._showTerm()
        this.lang()
        this.enLaBusquedaDelTextoPerdido()
        this._fill(true)
        this.console()

    _showTerm: ->
        $(this.element).delay(333).animate({'opacity':1}, 1111)

    _hideTerm: (c) ->
        $(this.element).delay(333).animate({'opacity':0}, 1111, c)

    enLaBusquedaDelTextoPerdido: ->
        if $(this.element).text().length is 0
            $(this.element).append('<div class="consola"></div>').find(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# '+env["PWD"]+" "+env["USER"]+"$ ")

    lang: ->
        disponible = ['es-es', 'en-gb', 'en-us']
        idioma = window.navigator.language
        isThere = false
        $.each(disponible, (i, v) ->
            if not isThere
                if v.match(idioma)
                    isThere = true
                    idioma = v
        )
        if not isThere
            idioma = 'en-gb'
        $.getJSON('lib/lang/' + idioma + '.json', (json, stat, xhr) ->
            $.webterminal.idioma = json
            Plugin.prototype.lang = json
        )

    console: ->
        #Console
        _this = this
        $(document).keydown((e) ->
            keyCode = e.originalEvent.keyIdentifier
            lines = $(_this.element).find(".consola-line").length
            line = $(".consola-line")[lines-1]
            if e.metaKey or (e.ctrlKey and keyCode is 82) or (e.ctrlKey and keyCode is 84)
                return
            e.preventDefault()
            _this._fill(false)

            #console.log(keyCode)
            if $(".consola").length is 0
                $(_this.element).append('<div class="consola"></div>').find("span#l").remove()
            if lines is 0 
                $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>').find("span#t").text('sh-3.2# '+_this.env["PWD"]+" "+_this.env["USER"]+"$ ")
            else if not e.shiftKey and not e.altKey and chars[keyCode] isnt undefined
                append(chars[keyCode])
            else if keyCode is 'U+0008' #Eliminar caracter
                remove()
            else if e.shiftKey and not e.altKey and shift_chars[keyCode] isnt undefined
                append(shift_chars[keyCode])
            else if not e.shiftKey and e.altKey and alt_chars[keyCode] isnt undefined
                append(alt_chars[keyCode])
            else if keyCode == 'Enter' #Nueva linea -> enviar comando
                $(line).find("span#l").remove()
                $(line).append("<br>")
                comando = $(line).find("span#g").text().split(" ")
                _this.historial[_this.historial.length] = $(line).find("span#g").text()
                $.each(comando, (a, b) -> #Busca variables en el comando
                    if b.search("$") != -1
                        vars = b.split("$").length - 1
                        i = 0
                        while (i < vars)
                            variable = b.split("$")[1]
                            sustituto = _this.env[variable]
                            if sustituto
                                comando[a] = sustituto
                            else
                                comando[a] = ""
                            i++
                )
                if _this.shell[comando[0]] isnt undefined and comando[0] isnt undefined
                    try
                        _this.shell[comando[0]](comando)
                    catch e
                        print('<span style="color:red">&gt;&nbsp;Has ocurred an error. See dev tools console</span>')
                        newLine()
                        throw e
                else if _this.shell[comando[0]] is undefined and comando[0] isnt undefined
                        _this.shell["none"](comando)
            else if keyCode is 'Up' #Arriba
                if $(line).find('span#g').data('historial') is undefined
                    $(line).find("span#g").empty().data('historial', _this.historial.length - 1)
                    comando = _this.historial[_this.historial.length - 1]
                    append(comando)
                else
                    num = parseInt($(line).find('span#g').data('historial')) - 1
                    comando = _this.historial[num]
                    if num <= _this.historial.length and num >= 0
                        $(line).find("span#g").empty().data('historial', num)
                        append(comando)
            else if keyCode is 'Down' #Abajo
                if $(line).find('span#g').data('historial') is undefined
                    $(line).find("span#g").empty().data('historial', _this.historial.length + 1)
                    comando = _this.historial[_this.historial.length + 1]
                else
                    num = parseInt($(line).find('span#g').data('historial')) + 1
                    comando = _this.historial[num]
                    if num <= _this.historial.length and num >= 0
                        $(line).find("span#g").empty().data('historial', num)
                        append(comando)
            $(_this.element).scrollTop(100000)
            if $(_this.element).height() < $(".consola").height()
                $(".consola-line").addClass("consola-line-short")
        )

    _fill: (first) ->
        if first is true
            $[pluginName].shell = this.shell
            $[pluginName].print = print
            $[pluginName].help = this.help
            $[pluginName].newLine = newLine
            $[pluginName].urlHelper = urlHelper
            $[pluginName].dirHelper = dirHelper
            $[pluginName].conf = this.conf
        $[pluginName].env = this.env

$.fn[pluginName] = (options) ->
    args = arguments
    if options is undefined or typeof options is 'object'
        return this.each(->
            if not $.data(this, 'plugin_' + pluginName)
                $.data(this, 'plugin_' + pluginName, new Plugin(this, if options is undefined then {} else options))
        )

$[pluginName] = (options) ->
    $(".console").webterminal(options.element, options)

_this = Plugin.prototype
$[pluginName].env = _this.env
$[pluginName].shell = _this.shell
$[pluginName].print = print
$[pluginName].help = _this.help
$[pluginName].conf = _this.conf
$[pluginName].newLine = newLine
$[pluginName].urlHelper = urlHelper
$[pluginName].dirHelper = dirHelper

window.webterminal = Plugin