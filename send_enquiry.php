<?php
$to = "ashvix.solutions@gmail.com";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: contact.html");
    exit;
}

function clean($value) {
    return htmlspecialchars(trim($value ?? ""), ENT_QUOTES, "UTF-8");
}

$full_name = clean($_POST["full_name"]);
$mobile = clean($_POST["mobile"]);
$email = clean($_POST["email"]);
$company = clean($_POST["company"]);
$city = clean($_POST["city"]);
$client_type = clean($_POST["client_type"]);
$project_type = clean($_POST["project_type"]);
$platform = clean($_POST["platform"]);
$technology = clean($_POST["technology"]);
$budget = clean($_POST["budget"]);
$project_description = clean($_POST["project_description"]);
$additional_requirements = clean($_POST["additional_requirements"]);
$expected_date = clean($_POST["expected_date"]);

if (!$full_name || !$mobile || !$email || !$client_type || !$project_type || !$project_description) {
    exit("<script>alert('Please fill all required fields.'); history.back();</script>");
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit("<script>alert('Please enter a valid email address.'); history.back();</script>");
}
if (!preg_match('/^[0-9]{10}$/', $mobile)) {
    exit("<script>alert('Please enter a valid 10 digit mobile number.'); history.back();</script>");
}

$subject = "New Project Enquiry - " . $full_name;

$message = "ASHVIX SOLUTIONS - NEW PROJECT ENQUIRY\n\n";
$message .= "CLIENT DETAILS\n";
$message .= "Full Name: $full_name\nMobile: $mobile\nEmail: $email\n";
$message .= "Company / Business: $company\nCity: $city\nClient Type: $client_type\n\n";
$message .= "PROJECT DETAILS\n";
$message .= "Project Type: $project_type\nPlatform: $platform\nTechnology: $technology\n";
$message .= "Budget: $budget\nExpected Date: $expected_date\n\n";
$message .= "PROJECT DESCRIPTION\n$project_description\n\n";
$message .= "ADDITIONAL REQUIREMENTS\n$additional_requirements\n\n";
$message .= "Submitted through ASHVIX Solutions website.";

$headers = "From: ASHVIX Solutions <ashvix.solutions@gmail.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enquiry Sent</title><style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#030507;color:#fff;font-family:Arial}
    .box{width:90%;max-width:550px;padding:45px;text-align:center;border-radius:20px;background:#08111b;border:1px solid rgba(79,195,247,.2)}
    h1{color:#4fc3f7}p{color:#9aaabd;line-height:1.7}a{display:inline-block;margin-top:20px;padding:13px 22px;border-radius:8px;text-decoration:none;background:linear-gradient(90deg,#2868df,#4fc3f7);color:#00101a;font-weight:bold}
    </style></head><body><div class="box"><h1>Enquiry Sent Successfully!</h1><p>Thank you for contacting ASHVIX Solutions.<br><br>Our team will review your project requirements and contact you soon.</p><a href="index.html">Back to Home</a></div></body></html>';
} else {
    echo "<script>alert('Unable to send enquiry. Please contact ASHVIX Solutions directly.'); history.back();</script>";
}
?>