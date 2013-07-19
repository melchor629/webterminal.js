webterminal.js
==============

A terminal emulator for the web.
It's inspired in the bash environment, to entertain it, as in this 404 example: [SrRBR007 404' error page](http://srrbr007.tk/melchor629/404.htm).

## Basic usage
It's easy to use. You, firstly, need a html file with the basics `<head> <body>` and create a *<div>* with a class identifier. Ex.:
```html
<div class="console"></div>
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

## Usage
To extend the terminal commands, you need first to create them. See the example:
```javascript
var commands = {
    "hello": function() {
        $.webconsole.print("Hello World!")
    },
    "salute": function(c) {
        $.webconsole.print("Hello " + c[1] + "!")
    }
};
$(".console").webconsole(commands);
```
And in the console you type *hello* it returns `Hello World!` and if you type *salute melchor620* it returns `Hello melchor629!`.
