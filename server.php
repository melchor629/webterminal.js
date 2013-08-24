<? ini_set('track_errors', true);
$users = json_decode(file_get_contents('lib/users.json'));
function resp(&$json, $mensaje, $res) {
    $json['respuesta'] = array(
        'mensaje' => gettype($mensaje) == "string" ? utf8_encode($mensaje) : $mensaje,
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
        'serverDir' => $serverDir,
        'PWD' => $PWD
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
                if(is_file($serverDir.$PWD.$arg)) {
                    unlink($serverDir.$PWD.$arg);
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
                $recursive = isset($_GET['recursive']);
                if(is_dir($serverDir.$PWD.$arg)) {
                    if($recursive) {
                        $dir = $serverDir.$PWD.$arg;
                        function remdir($dir) {
                            if(!$dh = @opendir($dir)) return;
                            while (false !== ($obj = readdir($dh))) {
                                if($obj=='.' || $obj=='..') continue;
                                if (!@unlink($dir.'/'.$obj)) remdir($dir.'/'.$obj);
                            }
                            closedir($dh);
                            @rmdir($dir);
                        }
                        remdir($dir);
                    } else {
                        $r = @rmdir($serverDir.$PWD.$arg);
                        if($r === true)
                            resp($json, true, 0);
                        else
                            resp($json, $arg.': '.$php_errormsg, 1);
                    }
                } elseif(is_file($serverDir.$PWD.$arg))
                    resp($json, $arg . ': Not a directory', 1);
                else
                    resp($json, $arg . ': No such file or directory', 1);
            } else
                resp($json , 'This command require special magical powers, ' . $user, 1);
            break;
        case 'touch':
            if(isAdmin($user)) {
                $result = @touch($serverDir.$PWD.$arg);
                if($result === true) {
                    resp($json, true, 0);
                } else {
                    if(is_dir($serverDir.$arg))
                        resp($json, $arg. ': is a directory', 1);
                    else
                        resp($json, $arg.': '.$php_errormsg, 1);
                }
            } else
                resp($json , 'This command require special magical powers, ' . $user, 1);
            break;
        case 'mkdir':
            if(isAdmin($user)) {
                $result = @mkdir($serverDir.$PWD.$arg);
                if($result === true)
                    resp($json, true, 0);
                else
                    resp($json, $arg.': '.$php_errormsg, 1);
            } else
                resp($json , 'This command require special magical powers, ' . $user, 1);
            break;
        case 'cat':
            if(is_file($serverDir.$PWD.$arg)) {
                $out = file_get_contents($serverDir.$PWD.$arg);
                $out = htmlentities($out);
                $out = str_replace("  ", "&nbsp;&nbsp;", $out);
                $out = str_replace("\n", "<br>", $out);
                $out = str_replace("	", "&nbsp;&nbsp;&nbsp;&nbsp;", $out);
                //var_dump($out);
                resp($json, $out, 0);
            } elseif(!is_file($serverDir.$PWD.$arg) && is_dir($serverDir.$PWD.$arg)) {
                resp($json, $arg.': Is a directory', 1);
            } elseif(!is_file($serverDir.$PWD.$arg) && !is_dir($serverDir.$PWD.$arg)) {
                resp($json, $arg.': No such file or directory', 1);
            }
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