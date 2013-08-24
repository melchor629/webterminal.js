conf = 
    server: false,      #Tells if we will use a server script for special commands such 'ls'
    script: '',      #Tells what type of script will use
    phpscript: '/'      #If we use php script, tell where in the server is the script ex: for `http://localhost/webterminal/server.php` the value will be '/webterminal/'

env = 
    "TERM_PROGRAM": window.navigator.userAgent,
    "PWD": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)),
    "SHELL": decodeURI(document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)) + "webterminal.js",
    "USER": "guest"

help = {}
