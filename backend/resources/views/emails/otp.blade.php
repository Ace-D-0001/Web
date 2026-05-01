<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #333;
            margin: 0;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            text-align: center;
        }
        .otp-code {
            display: inline-block;
            margin: 20px 0;
            padding: 15px 30px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #ffffff;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nusrat International</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            @if($type === 'verification')
                <p>Thank you for signing up. Use the following code to verify your email address:</p>
            @else
                <p>We received a request to reset your password. Use the following code to proceed:</p>
            @endif
            <div class="otp-code">{{ $otp }}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Nusrat International. All rights reserved.
        </div>
    </div>
</body>
</html>
