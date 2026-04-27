<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Welcome!</h2>
    <p>Thank you for signing up. To complete your registration and set up your password, please click the link below:</p>
    <p>
        <a href="{{ $link }}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
            Verify Email and Set Password
        </a>
    </p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p><a href="{{ $link }}">{{ $link }}</a></p>
    <br>
    <p>Thank you,<br>{{ config('app.name') }}</p>
</body>
</html>
