version = 'v0.2'
pluginName = 'webterminal'
_this = {}
lines = 0
line = $(".consola-line")[lines - 1]

#Append a character in the current line
append = (car) ->
    line = getLine()
    $(line).find("span#g").append(car)

#Print something in the line, HTML is valid
print = (str) ->
    line = getLine()
    $(line).find("span#g").append("<br>" + str)

#Get the current HTMLDomObject line
getLine = ->
    lines = $(".consola .consola-line").length
    line = $(".consola-line")[lines-1]
    line

#Remove a character in the current line
remove = ->
    line = getLine()
    str = $(line).find("span#g").text().substr(0, $(line).find("span#g").text().length - 1)
    $(line).find("span#g").empty().append(str)

#Create a new line, not \n
newLine = ->
    lines = $(_this.element).find(".consola-line").length
    $(".consola").append('<div class="consola-line"><span id="t"></span><span id="g"></span><span id="l">_</span></div>')
    $($(".consola .consola-line")[lines]).find("span#t").text("sh-3.2# #{_this.env["PWD"]} #{_this.env["USER"]}$ ")
    $(_this.element).scrollTop(100000)

#Helps to create the url to the configured script
urlHelper = (command, arg) ->
    conf = _this.conf
    if conf.server is true
        if conf.script == 'node.js'
            url = if document.location.protocol == 'file:' then 'http://localhost:8080/' else "http://"  + document.location.hostname + ":8080/"
            url = url + command + '/' + '?USER=' + _this.env['USER']
            #return url
        else if(conf.script == 'php')
            url = if document.location.protocol == 'file:' then "http://localhost/server.php?c=#{command}&USER=#{_this.env["USER"]}" else "http://
                #{document.location.hostname}#{conf.phpscript}server.php?c=#{command}&USER=#{_this.env['USER']}"
        else
            throw $.webterminal.idioma.scriptError
        o = 0;
        for i in arguments
            if _i isnt 0
                url += '&' + (_i-1) + '=' + encodeURI arguments[_i]
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

#Loop of the text cursor
(parpadeo = ()->
    if $('span#l').length is 0
        $('body').append('<span id="l" style="display:none"></span>')
    $('span#l').delay(600).animate({'opacity': 0}, 10)
               .delay(600).animate({'opacity': 1}, 10, parpadeo)
)()