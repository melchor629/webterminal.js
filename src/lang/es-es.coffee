addLang('es-es', {
    "shell": {
        "help": {
            "1": "Estos comandos de consola están definidos interna o externamente. Escriba `help` para ver esta lista.",
            "2": "Escriba `help nombre` para encontrar más información sobre el comando `nombre`.",
            "3": "Tal vez algunos comandos no se muestren en esta ayuda, depende del programador.",
            "noHelp": "-bash: help: ningún tópico de ayuda encaja con"
        },
        "none": "comando no encontrado."
    },
    "help": {
        "help": ["Muestra esta ayuda"],
        "echo": ["[arg ...] imprime el argumento"],
        "env": ["imprime todos las variables de entorno"],
        "export": ["ajusta una variable"],
        "reload": ["recarga la consola"],
        "ls": ["[directory ...]","una lista de archivos y carpetas del argumento/s"],
        "cd": ["[directory] cambia el direcotrio actual de trabajo"],
        "rm": ["[file] elimina un archivo"],
        "rmdir": ["[directory] elimina un directorio", "Elimina una carpeta vacía. Si no está vacía puedes usar la opción `-r`."],
        "touch": ["[filename] crea un archivo"],
        "mkdir": ["[directoryname] crea una carpeta"],
        "login": ["[user] [password] como sudo, pero en sesión"],
        "cwd": ["imprime el cwd (Current Working Directory)"],
        "cat": ["[-n -b] [file] imprime el contenido de un archivo", "Muestra el contenido de cualquier archivo.\n\t-n Enumera las lineas\n\t-b Enumera las lineas que no estén en blanco"]
    },
    "scriptError": "El valor para `server` is true pero no has dado un valor correcto para `script` [node.js, php]"
})
