<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');





error_reporting(E_ALL);
ini_set('display_errors', 1);


$host = 'mysql';
$dbname = 'developer_app';
$username = 'devuser';
$password = 'devpass';


header('Content-Type: application/json');

//povezava na bazo
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
     
        $stmt = $pdo->prepare("SELECT user_id, first_name, last_name, email, github_username, role, profile_image_url, created_at FROM users");
        $stmt->execute();

      
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //vrne kot json
        echo json_encode(["success" => true, "users" => $users]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch users: " . $e->getMessage()]);
    }
} else {
  
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed. Use GET."]);
}
