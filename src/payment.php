<?php

include_once ("Instamojo\Instamojo.php");
$api = new Instamojo\Instamojo("test_aefcb9d7d18d4ec8ac568e581d0", "test_a4e95f47fe9bb5e281508f44233",
            'https://test.instamojo.com/api/1.1/');

$purpose=$_GET['purpose'];
$amount=$_GET['amount'];
$email=$_GET['email'];
$course_id=$_GET['course_id'];

try {
    $response = $api->paymentRequestCreate(array(
        "purpose" => $purpose,
        "amount" => $amount,
        "send_email" => false,
        "email" => $email,
        "redirect_url" => "https://shaneromel.github.io/bankers-point/status.php?course_id=".$course_id
        ));

    $url = $response['longurl'];
    
    header("Location: $url");
    exit();
}
catch (Exception $e) {
    print('Error: ' . $e->getMessage());
}

?>