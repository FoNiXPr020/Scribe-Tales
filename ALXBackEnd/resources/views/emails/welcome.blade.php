<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Scribe Tales!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: hsl(36, 45%, 15%);
            background-color: hsl(36, 39%, 88%);
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: hsl(36, 45%, 70%);
            color: hsl(36, 45%, 11%);
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: hsl(36, 46%, 82%);
            color: hsl(36, 45%, 20%);
            padding: 20px;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: hsl(36, 64%, 57%);
            color: hsl(36, 72%, 17%);
            padding: 10px 20px;
            text-decoration: none;
            font-weight: 600;
        }
        .footer {
            background-color: hsl(40, 35%, 77%);
            color: hsl(36, 45%, 25%);
            padding: 20px;
            text-align: center;
            font-size: 0.8em;
            margin-top: 20px;
        }
    </style>
</head>
<body style="font-family: 'Inter', sans-serif; line-height: 1.6; color: hsl(36, 45%, 15%); background-color: hsl(36, 39%, 88%); max-width: 600px; margin: 0 auto; padding: 20px;">
    <div class="header" style="background-color: hsl(36, 45%, 70%); color: hsl(36, 45%, 11%); padding: 20px; text-align: center;">
        <h1 style="font-weight: 700;">Welcome to Scribe Tales!</h1>
    </div>
    
    <div class="content" style="background-color: hsl(36, 46%, 82%); color: hsl(36, 45%, 20%); padding: 20px; margin-top: 20px;">
        <p>Dear {{ $user->first_name }} {{ $user->last_name }},</p>
        
        <p>Welcome to Scribe Tales, where your stories come to life! We're thrilled to have you join our vibrant community of storytellers and readers.</p>
        
        <p>If you have any questions or need assistance, our support team is always here to help.</p>
        
        <p style="text-align: center;">
            <a href="{{ env('FRONTEND_URL') }}/{{ $user->username }}" class="button" style="display: inline-block; background-color: hsl(36, 64%, 57%); color: hsl(36, 72%, 17%); padding: 10px 20px; text-decoration: none; font-weight: 600;">Explore Your Dashboard</a>
        </p>
        
        <p style="text-align: center;">Happy writing!<br>The Scribe Tales Team</p>
    </div>
    
    <div class="footer" style="background-color: hsl(40, 35%, 77%); color: hsl(36, 45%, 25%); padding: 20px; text-align: center; font-size: 0.8em; margin-top: 20px;">
        <p>&copy; {{ date('Y') }} Scribe Tales. All rights reserved.</p>
        <p>
            You're receiving this email because you signed up for Scribe Tales. 
            If you didn't sign up, please ignore this email or contact our support team.
        </p>
    </div>
</body>
</html>