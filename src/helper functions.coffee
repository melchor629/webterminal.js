#Append a character in the current line
append = (car) ->
    $(getLine()).find("span#g").append(car)

#Print something in the line, HTML is valid
print = (str) ->
    color = {}
    added = 0
    while str.match(/\x1B/)
        pos = str.indexOf('\x1B')
        if str.charAt(pos + 1) is '['
            pos2 = str.indexOf('m', pos+2)
            nums = str.substring(pos + 2, pos2).split ';'
            for num in nums
                num = Number num
                if num is 0
                    color = {}
                else if num is 21
                    color.bold = undefined
                else if num is 22
                    color.dim = undefined
                else if num is 24
                    color.underline = undefined
                else if num is 28
                    color.hidden = undefined
                else
                    fmt = getFormatting num
                    color[fmt.value] = fmt.style
            newStr = if added++ is 0 then '' else '</span>'
            newStr += "<span style=\"#{formattingToCss color}\">"
            str = str.replace(str.substring(pos, pos2 + 1), newStr)
    str = str.replace(/\n/g, '<br>')
    $(getLine()).find("span#g").append(str)

#Get the current HTMLDomObject line
getLine = ->
    lines = $(".consola .consola-line").length
    line = $(".consola-line")[lines-1]
    line

#Remove a character in the current line
remove = ->
    objG = $(getLine()).find("span#g")
    str = objG.text().substr(0, objG.text().length - 1)
    objG.empty().append(str)

#Create a new line, not \n
newLine = ->
    lines = $(_this.element).find(".consola-line").length
    $(".consola").append('<div class="consola-line" style="width: ' + _this.width + 'px"><span id="t"></span><span id="g"></span><span id="l">_</span></div>')
    $($(".consola .consola-line")[lines]).find("span#t").text("sh-3.2# #{_this.env["PWD"]} #{_this.env["USER"]}$ ")
    $(_this.element).scrollTop(100000)

#Helps to create the url to the configured script
urlHelper = (command, arg) ->
    conf = _this.conf
    if conf.server is true
        if conf.script is 'node.js'
            url = "http://"  + document.location.hostname + ":8080/"
            url = url + command + '/' + '?USER=' + _this.env['USER']
        else if conf.script is 'php'
            url = "http://#{document.location.hostname}#{conf.phpscript}server.php?c=#{command}&USER=#{_this.env['USER']}"
        else
            throw $.webterminal.idioma.scriptError
        o = 0;
        for i in arguments
            if o isnt 0
                url += '&' + (o-1) + '=' + encodeURI i
            o++
        url += '&PWD=' + encodeURI _this.env.PWD + '&argc=' + o
        url


#Parses some special directions, like ../
dirHelper = (folder) ->
    if folder.indexOf('..') isnt -1
        split = _this.env['PWD'].split '/'
        carpeta = ''
        $.each(split, (i, v) ->
            if i < (split.length - 2)
                carpeta += v + '/'
        )
        if folder.indexOf('../') isnt -1
            carpeta = folder.replace('../', carpeta)
    else if folder == '.' or folder == './'
        carpeta = _this.env['PWD']
        if folder.indexOf('./') isnt -1
            carpeta = folder.replace('./', carpeta)
    else
        carpeta = folder
    carpeta

#Bash error message format
errorFormat = (cmd, arg, msg) ->
    print "#{cmd}: #{arg}: #{msg}"
    newLine()

#Bash error message format without newLine()
errorFormatNNL = (cmd, arg, msg) ->
    print "#{cmd}: #{arg}: #{msg}"

#ANSI/VT100 colors and text styles
getFormatting = (value) ->
    c = $.webterminal.conf.colors
    switch value
        when 1
            { style: 'font-weight:bold', value: 'bold' }
        when 2
            { style: 'opacity: 0.5', value: 'dim' }
        when 4
            { style: 'text-decoration:underline', value: 'underline' }
        when 8
            { style: 'visibility: hidden', value: 'hidden' }
        when 30
            { style: 'color:'+c.black, value: 'color' }
        when 31
            { style: 'color:'+c.red, value: 'color' }
        when 32
            { style: 'color:'+c.green, value: 'color' }
        when 33
            { style: 'color:'+c.yellow, value: 'color' }
        when 34
            { style: 'color:'+c.blue, value: 'color' }
        when 35
            { style: 'color:'+c.magenta, value: 'color' }
        when 36
            { style: 'color:'+c.cyan, value: 'color' }
        when 37
            { style: 'color:'+c.lightgray, value: 'color' }
        when 40
            { style: 'background-color:'+c.black, value: 'background' }
        when 41
            { style: 'background-color:'+c.red, value: 'background' }
        when 42
            { style: 'background-color:'+c.green, value: 'background' }
        when 43
            { style: 'background-color:'+c.yellow, value: 'background' }
        when 44
            { style: 'background-color:'+c.blue, value: 'background' }
        when 45
            { style: 'background-color:'+c.magenta, value: 'background' }
        when 46
            { style: 'background-color:'+c.cyan, value: 'background' }
        when 47
            { style: 'background-color:'+c.lightgray, value: 'background' }
        when 49
            { style: 'background-color:transparent', value: 'background' }
        when 90
            { style: 'color:'+c.darkgray, value: 'color' }
        when 91
            { style: 'color:'+c.lightred, value: 'color' }
        when 92
            { style: 'color:'+c.lightgreen, value: 'color' }
        when 93
            { style: 'color:'+c.lightyellow, value: 'color' }
        when 94
            { style: 'color:'+c.lightblue, value: 'color' }
        when 95
            { style: 'color:'+c.lightmagenta, value: 'color' }
        when 96
            { style: 'color:'+c.lightcyan, value: 'color' }
        when 97
            { style: 'color:'+c.white, value: 'color' }
        when 100
            { style: 'background-color:'+c.darkgray, value: 'background' }
        when 101
            { style: 'background-color:'+c.lightred, value: 'background' }
        when 102
            { style: 'background-color:'+c.lightgreen, value: 'background' }
        when 103
            { style: 'background-color:'+c.lightyellow, value: 'background' }
        when 104
            { style: 'background-color:'+c.lightblue, value: 'background' }
        when 105
            { style: 'background-color:'+c.lightmagenta, value: 'background' }
        when 106
            { style: 'background-color:'+c.lightcyan, value: 'background' }
        when 107
            { style: 'background-color:'+c.white, value: 'background' }

formattingToCss = (fmt) ->
    css = ''
    for k of fmt
        css += "#{fmt[k]};"
    css

#Loop of the text cursor
(parpadeo = ()->
    if $('span#l').length is 0
        $('body').append('<span id="l" style="display:none"></span>')
    $('span#l').delay(600).animate({'opacity': 0}, 10)
               .delay(600).animate({'opacity': 1}, 10, parpadeo)
)()
