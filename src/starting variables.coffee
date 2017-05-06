"use strict";
window = this
$ = window.$
version = '0.2-beta'
pluginName = 'webterminal'
_this = {}

conf = 
    server: false,      #Tells if we will use a server script for special commands such 'ls'
    script: undefined,  #Tells what type of script will use
    phpscript: '/'      #If we use php script, tell where in the server is the script ex: for `http://localhost/webterminal/server.php` the value will be '/webterminal/'
    width: 484          #Width of the console div
    height: 314         #Height of the console div
    colors:             #Colours
        black: 'black'
        red: '#990000'
        green: '#00A600'
        yellow: '#999900'
        blue: '#0000B2'
        magenta: '#B200B2'
        cyan: '#00A6B2'
        lightgray: '#BFBFBF'
        darkgray: '#666666'
        lightred: '#E50000'
        lightgreen: '#00D900'
        lightyellow: '#E5E500'
        lightblue: '#0000FF'
        lightmagenta: '#E500E5'
        lightcyan: '#00E5E5'
        white: '#E5E5E5'

env = 
    "TERM_PROGRAM": window.navigator.userAgent,
    "PWD": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)),
    "SHELL": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)) + "webterminal.js",
    "USER": "guest"
    "VERSION": version

help = {}
shell = {}
