#Append a character in the current line
append = (car) ->
    $(getLine()).find("span#g").append(car)

#Print something in the line, HTML is valid
print = (str) ->
    color = null
    while str.match(/\x1B/)
        pos = str.indexOf('\x1B')
        if str.charAt(pos + 1) is '['
            pos2 = str.indexOf('m', pos+2)
            num = Number str.substring(pos + 2, pos2)
            newStr = ''
            if num is 0
                color = null
                newStr += '</span>'
            else
                fmt = getFormatting num
                newStr += if color isnt null then '</span>' else ''
                newStr += '<span style="'+fmt.style+'">'
                color = fmt.value
            str = str.replace(str.substring(pos, pos2 + 1), newStr)
    str = str.replace(/\n/g, '<br/>')
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
        when 0
            { style: '', value: null }
        when 30
            { style: 'color:'+c.black, value: 'black' }
        when 31
            { style: 'color:'+c.red, value: 'red' }
        when 32
            { style: 'color:'+c.green, value: 'green' }
        when 33
            { style: 'color:'+c.yellow, value: 'yellow' }
        when 34
            { style: 'color:'+c.blue, value: 'blue' }
        when 35
            { style: 'color:'+c.magenta, value: 'magenta' }
        when 36
            { style: 'color:'+c.cyan, value: 'cyan' }
        when 37
            { style: 'color:'+c.lightgray, value: 'light gray' }
        when 90
            { style: 'color:'+c.darkgray, value: 'dark gray' }
        when 91
            { style: 'color:'+c.lightred, value: 'light red' }
        when 92
            { style: 'color:'+c.lightgreen, value: 'light green' }
        when 93
            { style: 'color:'+c.lightyellow, value: 'light yellow' }
        when 94
            { style: 'color:'+c.lightblue, value: 'light blue' }
        when 95
            { style: 'color:'+c.lightmagenta, value: 'light magenta' }
        when 96
            { style: 'color:'+c.lightcyan, value: 'light cyan' }
        when 97
            { style: 'color:'+c.white, value: 'white' }

#Loop of the text cursor
(parpadeo = ()->
    if $('span#l').length is 0
        $('body').append('<span id="l" style="display:none"></span>')
    $('span#l').delay(600).animate({'opacity': 0}, 10)
               .delay(600).animate({'opacity': 1}, 10, parpadeo)
)()