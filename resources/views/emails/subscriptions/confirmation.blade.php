<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Confirm your subscription</title>
</head>
<body style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
    <h1 style="font-size: 20px; margin-bottom: 16px;">Confirm your subscription</h1>
    <p style="margin-bottom: 16px;">
        We received a request to subscribe <strong>{{ $email }}</strong> to project updates.
    </p>
    <p style="margin-bottom: 24px;">
        Confirm your subscription by opening the link below:
    </p>
    <p style="margin-bottom: 24px;">
        <a href="{{ $confirmationUrl }}">{{ $confirmationUrl }}</a>
    </p>
    <p>
        If you did not request this, you can ignore this message.
    </p>
</body>
</html>
