webterminal.js
==============

A terminal emulator for the web.
It's inspired in the bash environment, to entertain it, as in this 404 example: [SrRBR007 404' error page](http://srrbr007.tk/melchor629/404.htm). If you clone the repository, you can open the *webterminal.html* and prove the project in a Mac-like terminal :P.
```
Sizes:                  Uncompressed G-Zipped
    webterminal.js      ~26,9kb      ~4,4kb
    webterminal.min.js  ~11,5kb      ~3,2kb
not bad ·_·
```

## Basic usage
It's easy to use. You, firstly, need a html file with the basics `<head> <body>` and create a `<div>` with a class identifier. Ex.:
```html
<div class="console"></div>
```
Also you can put a initial message in the div, very recomended:
```html
<div class="console">Press any key to continue...<span id="l"></span></div>
```
Before the `</body>` tag, add the needed scripts. The scripts are [jQuery](http://jquery.com) and, of course, webterminal.js
```html
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
<script src="webterminal.js"></script>
```
And finally, the javascript code to initiate the console:
```javascript
$(".console").webconsole();
```
and that's all :D

### Styling the console
If you want a stylished console, here are some tricks to make it pretty:
In the main `<div/>`, you could set the style like that:
```css
.console {
    opacity: 0;
    padding: 3px;
}
```
`.console` is the main div used in the console script. There's some CSS rules that is set automatically. In above code, opacity is set to 0 to allow the script to fade in the console at start. Padding is for, in the example html, to set a padding to well looking like a Mac terminal.

## Extended Usage
### Configuration
The configuration is optional, but recommended because some commands need a server program which sends information to the client. The configuration is:
```javascript
configuration = {
    server: false,      //Tells if we will use a server script for special commands such 'ls'
    script: 'node.js',  //Tells what type of script will use
    phpscript: '/',     //If we use php script, tell where in the server is the script ex: for 'http://localhost/webterminal/server.php the value will be '/webterminal/'
    width: 484,         //Width of the console div
    height: 314,        //Height of the console div
    colors: {...}       //A list of ANSI/VT100 Colors
}
$('.console').webterminal({conf: configuration});
```
The `server.js` and `server.php` are script to use in the server. Use `server.php` if you use a basic server or you haven't node.js. The limitation of use the PHP script is you can navigate only with the server directory. Node.js script is for navigate in all computer and if you execute the server with a normal user will need sudo for change files, and fortunately I haven't implement sudo and I won't do it, for security reasons ;), but there's a login command for do special commands like `rm`.
### Extend commands
To extend the terminal commands, you need first to create them. See the example:
```javascript
var commands = {
    "hello": function(args, cbk) {
        $.webconsole.print("Hello World!");
        cbk()
    },
    "salute": function(args, cbk) {
        $.webconsole.print("Hello " + c[1] + "!");
        cbk()
    }
};
$(".console").webconsole({shell: commands});
```
You create an array with the name of the command and a function to do when is called. To print something in the console while is running your command, you need this code:`$.webconsole.print()`, as you can see in the above example.
And if you, in the console, type *hello* it returns `Hello World!` and if you type *salute melchor629* it returns `Hello melchor629!`. **Very important**, the `cbk()` is important to be in the function because is part of the console functionally. With this `callback`, you can safely make asynchronous code, but **you must** call this callback to make sure that the webterminal will contine working when you're done. You can see an example in the `ls` command or `cd` command.

### Put extra initial environment variables
To start the console with extra environment variables, you have to do something similar to the above item. See the example:
```javascript
var environment = {
    'name': 'melchor629',
    'divs': $('div').length
};
$(".console").webconsole({env: environment});
```
You create an array with the variable and its value. The value can be a String or Number. And after call the `.webconsole()` with the new environment variables. In the console type `env` and you will see that new variables.

### Extend commands with its help information
Start doing the same as the  *extend commands* item:
```javascript
var commands = {
    "hello": function(args, cbk) {
        $.webconsole.print("Hello World!");
        cbk()
    },
    "salute": function(args, cbk) {
        $.webconsole.print("Hello " + args[1] + "!");
        cbk()
    }
};
```
After that, you create a new array with the help to every new commands. See the example:
```javascript
var help = {
    'hello': ['It says hello', 'This is a simple command that it says hello to you.'],
    'salute': ['[name] It says hello with your name.', 'This is a simple command with an argument that salutes with the `name` given.']
};
```
And finally, create the console:
```javascript
$(".console").webconsole({shell: commands, help: help});
```
In every help you have to make an array with 2 strings. The very short description, and the long description.
Type `help` in the console and you will see the commands with its help. If you type `help salute` you will see the long description.

## Build
For build from the source (`src/`) you need firstly [node.js](http://nodejs.org), [uglify.js](https://github.com/mishoo/UglifyJS2) and [CoffeeScript](http://coffeescript.org). When you've installed them, node.js, uglify.js and CoffeeScript, you can build it. Open a terminal and go to the project directory. Then type `cake` and you will see a list of tasks you can use, see descriptions near every task. And also you can use the feature watch for auto-build the source when a file is changed. Ex.: `cake -b build:full watch` ( *You have to put the argument in this way* ). Also you can test the project, or both, test and watch.

## API
There's some ways to modify the default functionaly of the terminal, you has just read before. But when you create commands you have special functions for help you.
### .shell
Is objectobject of the current shell, no modificable. To access it, in the command function type: `$.webterminal.shell`
### .env
Is the object that contains the current environment variables. In a function this is unmodificable `$.webterminal.env`, but if you want to modify any environment variable, use `_this.env` instead.
### .print()
This function prints something to the terminal. Accepts html. In a function use `$.webterminal.print('<b>Hello :D</b>')`.
### .help
Is the object with the help data. Is unmodificable. To access it, type `$.webterminal.help`
### .conf
If you need to access the configuration, use this object. In a function you will use it like that: `$.webterminal.conf`.
### .newLine()
In all the command functions, at the end of that you have to put this function: `$.webterminal.newLine()`
### .urlHelper(command, arg)
For get the URL for a functions that connects with the node.js or php script this function will help you. Supplying the command and the argument to pass to the server, this function will return the URL ready to use. Ex.: `url = $.webterminal.urlHelper('kill', 'me');` the value of `url` will be (if the server is node.js) http://HOSTNAME:8080/kill/?0=me&USER=THEVAULEFORTHECURRENTUSER.
### .dirHelper(folder)
Depending on the value of the argument `folder` will return a different value. For example, if you supply a value like `../` will return the parent directory of the current directory. If you supply `./` will return the same directory. And of you supply `/usr` will return `/usr`.
### .errorFormat(cmd, arg, msg)
Prints a Bash error message (Ex.: _cat: filename: No such file or directory_) passing the command executed (`cmd`), the argument with error (`arg`) and the error message (`msg`). Giving the before example, with this function you will write `$.webterminal.errorFormat('cat', 'filename', 'No such file or directory');`. __Watch out!__ This function calls for you `.newLine()`. If you don't want to use `.newLine()`, see below...
### .errorFormatNNL(cmd, arg, msg)
Same as above, but without using `.newLine()`

## TODO List
- [ ] Auto-detect the width of the console (_the selected `<div/>`_)
- [X] If is pressed the key UP or DOWN, write the before commands
- [ ] Create more commands
- [ ] Complete `cat` command
- [ ] Complete `ls` command
