<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


$host = 'mysql';
$dbname = 'developer_app';
$username = 'devuser';
$password = 'devpass';


require_once 'github_scraper.php';

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);


    if (empty($data['password']) || empty($data['role'])) {
        http_response_code(400);
        echo json_encode(["error" => "Password and role are required"]);
        exit;
    }


    $firstName = $data['first_name'] ?? '';
    $lastName = $data['last_name'] ?? '';
    $email = $data['email'] ?? '';


    if (!empty($data['github_url'])) {
        $scrapedData = scrapeGitHubProfile($data['github_url']);

        if (isset($scrapedData['error'])) {
            http_response_code(400);
            echo json_encode(["error" => $scrapedData['error']]);
            exit;
        }


        $fullName = $scrapedData['name'] ?? '';
        if ($fullName) {
            $nameParts = explode(' ', $fullName, 2);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';
        }
        $email = $scrapedData['email'] ?? $email;
    }

    // Hashiranje gesla
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    
    $sql = "INSERT INTO users (first_name, last_name, email, password, github_username, role, profile_image_url) 
            VALUES (:first_name, :last_name, :email, :password, :github_username, :role, :profile_image_url)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':github_username', $data['github_url']);
        $stmt->bindParam(':role', $data['role']);
        $stmt->bindParam(':profile_image_url', $data['profile_image_url']);

        $stmt->execute();

        $to = $email;
        $subject = "Welcome to Developer App!";
        $message = "Hi $firstName,\n\nThank you for registering with Developer App. We're excited to have you on board!\n\nBest Regards,\nDeveloper App Team";
        $headers = "From: app.develop2025@gmail.com\r\n" .
            "Reply-To: app.develop2025@gmail.com\r\n" .
            "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(["success" => true, "message" => "User registered and email sent successfully"]);
        } else {
            echo json_encode(["success" => true, "message" => "User registered successfully, but email sending failed"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Registration failed: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed. Use POST."]);
}
