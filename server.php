<?
$users = json_decode(file_get_contents('lib/users.json'));
function resp(&$json, $mensaje, $res) {
    $json['respuesta'] = array(
        'mensaje' => $mensaje,
        'res' => $res
    );
}
function isAdmin($user) {
    global $users;
    return $users->{$user}->range === 1;
}

if(isset($_GET)) {
    header('Content-type: text/json; charset=utf-8');
    $command = $_GET['c'];
    $arg = $_GET['0'];
    $serverDir = $_SERVER['DOCUMENT_ROOT'];
    $PWD = isset($_GET['PWD']) ? $_GET['PWD'] : null;
    $user = $_GET['USER'];
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
                resp($json, $arg . ': Not a directory', 1);
            else
                resp($json, $arg . ': No such file or directory', 1);
            break;
        case 'rm':
            if(isAdmin($user)) {
                if(substr($arg, 0, 1) != '/')
                    $serverDir = $serverDir.'/';
                if(is_file($serverDir.$arg)) {
                    unlink($serverDir.$arg);
                    resp($json, true, 0);
                } elseif(is_dir($serverDir.$arg))
                    resp($json, $arg . ': is a directory', 1);
                else
                    resp($json, $arg . ': No such file or directory', 1);
            } else
                resp($json , 'This command require special magical powers, ' . $user, 1);
            break;
        case 'rmdir':
            if(isAdmin($user)) {
                if(substr($arg, 0, 1) != '/')
                    $serverDir = $serverDir.'/';
                if(is_dir($serverDir.$arg)) {
                    rmdir($serverDir.$arg);
                    resp($json, true, 0);
                } elseif(is_file($serverDir.$arg))
                    resp($json, $arg . ': Not a directory', 1);
                else
                    resp($json, $arg . ': No such file or directory', 1);
            } else
                resp($json , 'This command require special magical powers, ' . $user, 1);
            break;
        case 'login':
            $exist = array_key_exists($arg, $users);
            if($exist && ($users->{$arg}->password == null || $_GET['password'] == $users->{$arg}->password))
                resp($json, $arg, 0);
            elseif(!$exist)
                resp($json, "User {$arg} doesn't extist", 1);
            else
                resp($json, 'Password don\'t match', 1);
            break;
        default:
            resp($json, 'Ese comando no existe…', 1);
    }
    echo json_encode($json);
}