<?
function resp(&$json, $mensaje, $res) {
    $json['respuesta'] = array(
        'mensaje' => $mensaje,
        'res' => $res
    );
}

if(isset($_GET)) {
    header('Content-type: text/json; charset=utf-8');
    $command = $_GET['c'];
    $arg = $_GET['0'];
    $serverDir = $_SERVER['DOCUMENT_ROOT'];
    $PWD = isset($_GET['PWD']) ? $_GET['PWD'] : null;
    $json = array('pedido' => array(), 'respuesta' => array());
    $json['pedido'] = array(
        'comando' => $command,
        'query' => $arg,
        'serverDir' => $serverDir
    );

    switch($command) {
        case 'ls':
                $d = dir($serverDir . $arg);
                $out = array();
                while(false !== ($entry = $d->read())) {
                    if($entry != '.' && $entry != '..')
                        $out[] = $entry;
                }
                $d->close();
                resp($json, $out, 0);
            break;
        case 'cd':
            if(strpos($arg, '/') !== 0)
                $serverDir = $serverDir.$PWD;
            else
                $serverDir = $serverDir;
            if(substr($serverDir.$arg, strlen($serverDir.$arg) -1) != '/')
                $arg = $arg.'/';
            if(is_dir($serverDir . $arg)) 
                resp($json, str_replace($_SERVER['DOCUMENT_ROOT'], '', $serverDir.$arg), 0);
            elseif(is_file($serverDir . $arg))
                resp($json, 'Not a directory', 1);
            else
                resp($json, 'No such file or directory', 1);
            break;
        default:
            resp($json, 'Ese comando no existe…', 1);
    }
    echo json_encode($json);
}