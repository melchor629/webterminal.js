webterminal.js
==============

A terminal emulator for the web.
It's inspired in the bash environment, to entertain it, as in this 404 example: [SrRBR007 404' error page](http://srrbr007.tk/melchor629/404.htm). If you clone the repository, you can open the *webterminal.html* and prove the project in a Mac-like terminal :P.

## Basic usage
It's easy to use. You, firstly, need a html file with the basics `<head> <body>` and create a `<div>` with a class identifier. Ex.:
```html
<div class="console"></div>
```
Also you can put a initial message in the div, very recomended:
```html
<div class="console">Press any key to continue...<span id="l"></span></div>
```
Before the `</body>` tag, add he needed scripts. The scripts are [jQuery](http://jquery.com) and, of course, webterminal.js
```html
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
<script src="webterminal.js"></script>
```
And finally, the code to initiate the console:
```javascript
$(".console").webconsole();
```
and that's all :D

### Styling the console
If you want a stylished console, here are some tricks to make it pretty:
In the main `<div/>`, set the style like that, for example:
```css
.console {
    width: 600px;
    height: 333px;
    text-align: justify;
    opacity: 0;
    overflow-y: auto;
}
.consola-line {
    width: 600px;
}
```
I recommand to put this CSS code in the page where you want to use the console for better looking. Explain:

`.console` is the main div used in the basic usage. I set a width and a height, and then I justify the text to have the appearence to a real console. Opacity set to 0 to allow the script to fade in the console at start. And finally, overflow is necessary.
`.consola-line` is a div created by the script. You have to set the width manually (for now…).

## Usage
### Extend commands
To extend the terminal commands, you need first to create them. See the example:
```javascript
var commands = {
    "hello": function() {
        $.webconsole.print("Hello World!");
        $.webconsole.newLine()
    },
    "salute": function(c) {
        $.webconsole.print("Hello " + c[1] + "!");
        $.webconsole.newLine()
    }
};
$(".console").webconsole(commands);
```
You create an array with the name of the command and a function to do when is called. To print something in the console while is running your command, you need this code:`$.webconsole.print()`, as you can see in the above example.
And if you, in the console, type *hello* it returns `Hello World!` and if you type *salute melchor629* it returns `Hello melchor629!`. **Very important**, the `$.webconsole.newLine()` is important to be in the function because is part of the console functionally. I put this function there because of async functions (*non-blocking functions*). You can see an example in the `ls` command or `cd` command.

### Put extra initial environment variables
To start the console with extra environment variables, you have to do something similar to the above item. See the example:
```javascript
var env = {
    'name': 'melchor629',
    'divs': $('div').length
};
$(".console").webconsole({}, env);
```
You create an array with the variable and its value. The value can be a String or Number. And after call the `.webconsole()` with the new environment variables. In the console type `env` and you will see that new variables. You may have noticed that the first parameter is a empty array `{}`, this means that we don't want to create new commands.

### Extend commands with its help information
Start doing the same as the  *extend commands* item:
```javascript
var commands = {
    "hello": function() {
        $.webconsole.print("Hello World!");
        $.webconsole.newLine()
    },
    "salute": function(c) {
        $.webconsole.print("Hello " + c[1] + "!");
        $.webconsole.newLine()
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
$(".console").webconsole(commands, {}, help);
```
In every help you have to make an array with 2 strings. The very short description, and the long description.
Type `help` in the console and you will see the commands with its help. If you type `help salute` you will see the long description.
You may have noticed that the second parameter is an empty array, again, we don't want to create new environment variables.

## TODO List
- [ ] Auto-detect the width of the console (_the selected `<div/>`_)
- [X] If is pressed the key UP or DOWN, write the before commands
- [ ] Create more commands
