  # From: http://phpjs.org/functions/sprintf
  # +   original by: Ash Searle (http://hexmen.com/blog/)
  # + namespaced by: Michael White (http://getsprink.com)
  # +    tweaked by: Jack
  # +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  # +      input by: Paulo Freitas
  # +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  # +      input by: Brett Zamir (http://brett-zamir.me)
  # +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  # +   improved by: Dj
  # +   improved by: Allidylls
  # *     example 1: sprintf("%01.2f", 123.1);
  # *     returns 1: 123.10
  # *     example 2: sprintf("[%10s]", 'monkey');
  # *     returns 2: '[    monkey]'
  # *     example 3: sprintf("[%'#10s]", 'monkey');
  # *     returns 3: '[####monkey]'
  # *     example 4: sprintf("%d", 123456789012345);
  # *     returns 4: '123456789012345'
  #
  #      Translated to coffeescript by melchor9000, with some modifications
  #      for be used as a command
shell.printf = (c) ->
    if c.length < 2
        print 'printf: usage printf format [arguments]'
        newLine()
        return

    regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g
    a = c.slice 1
    i = 0
    format = a[i++]

    pad = (str, len, chr, leftJustify) ->
        if not chr
            chr = ' ';
        padding = if (str.length >= length) then '' else
            Array(1 + len - str.length >>> 0).join(chr)
        if leftJustify then str + padding else padding + str

    justify = (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) ->
        diff = minWidth - value.length
        if diff > 0
            if leftJustify or not zeroPad
                value = pad(value, minWidth, customPadChar, leftJustify)
            else
                value = value.slice(0, prefix.length)+pad('', diff, '0', true)+
                    value.slice(prefix.length)
        value

    formatBaseX = (value,base,prefix,leftJustify,minWidth,precision,zeroPad) ->
        number = value >>> 0
        prefix = prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base] || ''
        value = prefix + pad(number.toString(base), precision || 0, '0', false)
        justify value, prefix, leftJustify, minWidth, zeroPad

    formatString = (value,leftJustify,minWidth, prec, zeroPad, customPadChar) ->
        if prec isnt null
            value = value.slice 0, prec
        justify value, '', leftJustify, minWidth, zeroPad, customPadChar

    doFormat = (substring, valueIndex, flags, minWidth, _, precision, type) ->
        if substring is '%%'
            return '%'

        leftJustify = false
        positivePrefix = ''
        zeroPad = false
        prefixBaseX = false
        customPadChar = ' '
        flagsl = flags.length
        #for j in [0..flagsl]
        `for(var j = 0; flags && j < flagsl; j++) { j`
        switch flags.charAt j
            when ' '
                positivePrefix = ' '
            when '+'
                positivePrefix = '+'
            when '-'
                leftJustify = true
            when "'"
                customPadChar = flags.charAt j + 1
            when '0'
                zeroPad = true
            when '#'
                prefixBaseX = true
        `}`

        # paremeters may be null, undefined, empty-string or real valued
        # we want to ignore null, undefined and empty-string values
        if not minWidth
            minWidth = 0
        else if minWidth is '*'
            minWidth = +a[i++]
        else if minWidth.charAt 0 is '*'
            minWidth = +a[minWidth.slice(1, -1)]
        else
            minWidth = +minWidth

        #Note: undocumented perl feature:
        if minWidth < 0
            minWidth = -minWidth
            leftJustify = true

        if not isFinite(minWidth)
            throw new Error 'sprintf: (minimum-)width must be finite'

        if not precision
            precision = if 'fFeE'.indexOf(type) > -1 then 6 else if (type is 'd') then 0 else undefined
        else if precision is '*'
            precision = +a[i++]
        else if precision.charAt(0) is '*'
            precision = +a[precision.slice(1, -1)]
        else
            precision = +precision

        #grab value using valueIndex if required?
        value = if valueIndex then a[valueIndex.slice(0, -1)] else a[i++]

        switch type
            when 's'
                formatString String(value), leftJustify, minWidth, precision, zeroPad, customPadChar
            when 'c'
                formatString String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad
            when 'b'
                formatString value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad
            when 'o'
                formatString value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad
            when 'x'
                formatString value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad
            when 'X'
                formatString(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase()
            when 'u'
                formatString value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad
            when 'i', 'd'
                number = +value || 0
                number = Math.round number - number % 1 #Plain round doesn't just truncate
                prefix = if number < 0 then '-' else positivePrefix
                value = prefix + pad(String(Math.abs(number)), precision, '0', false)
                justify value, prefix, leftJustify, minWidth, zeroPad
            when 'e', 'E', 'f', 'F', 'g', 'g' #fF should handle locales
                number = +value
                prefix = if number < 0 then '-' else positivePrefix
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())]
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2]
                value = prefix + Math.abs(number)[method](precision)
                justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]()
            else
                substring
    print format.replace(regex, doFormat)
    newLine()
