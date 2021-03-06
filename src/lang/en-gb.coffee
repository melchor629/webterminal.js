addLang('en-gb', {
    "shell": {
        "help": {
            "1": "These shell commands are defined internally or externally. Type `help` to see this list.",
            "2": "Type `help name` to find out more about the function `name`.",
            "3": "Maybe some commands doesn't show up in this help, it depends on the web programmer.",
            "noHelp": "-bash: help: no help topics match"
        },
        "none": "command not found."
    },
    "help": {
        "help": ["Shows this help"],
        "echo": ["[arg ...] prints the argument"],
        "env": ["prints all the environment variables"],
        "export": ["sets a variable"],
        "reload": ["reload the console"],
        "ls": ["[directory ...]", "a list of files and directories of the argument/s given"],
        "cd": ["[directory] change the current working directory"],
        "rm": ["[file] delete a file"],
        "rmdir": ["[directory] removes a directory", "Removes a empty directory. In case of not be empty, you can use the option `-r`."],
        "touch": ["[filename] create a file"],
        "mkdir": ["[directoryname] create a folder"],
        "login": ["[user] [password] like sudo, but in a session"],
        "cwd": ["prints the cwd (Current Working Directory)"],
        "cat": ["[-n -b] [file] prints the file in the normal output", "Prints any file into the normal output.\n\t-n Put the line number next the line\n\t-b Number the non-blank output lines"]
    },
    "scriptError": "The value for `server` is true but you don't give a correct value for `script` [node.js, php]"
})
