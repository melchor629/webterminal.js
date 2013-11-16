Shell functions
---------------
This folder contains all the _software_ (functions) that works with the terminal.

To make a new command create a new file, called as you want but it has to end ( _extension_ ) with `.coffee`. To define the new command start the file like this:
```coffeescript
shell.exampleCommand = (c) ->
    print "Hello World!"
    newLine()
```
**Watch out!** This folder is only to create shell commands directly to _webterminal.js_ when compiling.

### Helper functions
`void append(string car)` Appends a string to the current line

`void print(string str)` Print a string in a new line

`HTMLDomObject getLine()` Gets the current line DOMObject

`void remove()` Remove the last character from the current line

`void newLine()` Create a new command line, in shell functions is like the end of the command

`string urlHelper(string command, string ...)` Return a url based on the server script configuration. The first argument is the command name, and the second arguments to pass passed like the number of the argument and its value (ex.: `urlHelper("", "hi", "hola, "halo")` -> `...&0=hi&1=hola&2=halo`).

`string dirHelper(string folder)` Parses some special paths and returns a better path. The argument is the string from the command argument.

`void errorFormat(string cmd, string arg, string msg)` Prints a Bash like error and calls `newLine()`. The first argument is the command (ex.: cat), the second the argument with error, and the third a message to the user.

`void errorFormatNNL(string cmd, string arg, string msg)` Same as `errorFormat(cmd, arg, msg)` but without using `newLine()`
