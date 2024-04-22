<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "cyberrange@miamioh.edu";
    $subject = "New Message from Contact Form";
    $headers = "From: $email\r\n";

    mail($to, $subject, $message, $headers);
}
?>