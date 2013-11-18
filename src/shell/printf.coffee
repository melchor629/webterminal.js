shell.printf = (c) ->
    format = (string, arg) ->
        switch string.charAt 0
            when "d", "i"
                number = Number(arg)
                if Number(number.toFixed()) is number
                    return number + string.substr 1
                else
                    errorFormat 'printf', "'" + arg + "'", 'invalid number'
                    undefined
            when "o"
                undefined #uint in Octal
            when "u"
                undefined #uint
            when "X", "x"
                undefined #uint in Hexadecimal
            when "f", "F"
                undefined #Float Double
            when "e", "E"
                undefined #Como el de arriba pero ni puta idea
            when "g", "G"
                undefined #Auto eE o fF
            when "h", "H"
                undefined #Hexagesimal Float
            when "c"
                arg.charAt 0 + string.substr 1
            when "s"
                arg + string.substr 1
            when "b"
                undefined #algo como el de arriba pero especial
            when "%"
                string.substr 1
            else
                errorFormat 'printf', "'" + string.charAt(0) + "'", 'invalid format character'
                undefined
    if not c[1]
        errorFormat 'printf', 'usage', 'printf [-v var] format [arguments ...]'
    else
        splitted = c[1].split '%'
        formatted = ''
        argc = 1
        `for(var i = 0; i < splitted.length; i++) {
            var strPiece = splitted[i], Sformat = '';
            if(i === 0 && !strPiece) {
                Sformat = format(splitted[i+1], c[1 + argc]);
                i++;
                argc++;
            } else if(i !== 0 && strPiece) {
                Sformat = format(strPiece, c[1 + argc]);
                argc++;
            } else 
                Sformat = strPiece;
            if(!Sformat) return;
            else formatted += Sformat;
        }`
        print formatted
        newLine()