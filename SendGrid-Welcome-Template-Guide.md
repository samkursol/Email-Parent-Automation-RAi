# SendGrid Welcome Template Setup Guide

## Step 1: Create Welcome Template in SendGrid Dashboard

1. **Go to SendGrid Dashboard** → Email API → Templates
2. **Click "Create Template"**
3. **Template Name**: "Welcome Email - Student Registration"
4. **Template ID**: You'll get something like `d-xxxxxxxxxxxxxxxxx`

## Step 2: Template Design (Same structure as Acceptance Template)

Use this HTML for your welcome template (copy your acceptance template structure):

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <style type="text/css">
    /* Copy the same CSS from your acceptance template */
    body, table, td, p {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .welcome-header {
      color: #2563eb;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .highlight-box {
      background-color: #eff6ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #2563eb;
    }
    .info-box {
      background-color: #f0fdf4;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #16a34a;
    }
    .next-steps {
      background-color: #eff6ff;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Same header structure as acceptance template -->
    <div class="welcome-header">🚀 Welcome to {{platform_name}}!</div>
    
    <p>Dear Parent/Guardian,</p>
    
    <p>We're excited to welcome <strong>{{student_name}}</strong> to {{platform_name}}, your child's new AI-powered learning assistant!</p>
    
    <!-- Student info box (same styling as acceptance) -->
    <div class="highlight-box">
      <h3 style="color: #1d4ed8; margin-top: 0;">Welcome to Our Platform</h3>
      <p><strong>{{student_name}}</strong> has successfully registered and can now:</p>
      <ul>
        <li>Access personalized AI tutoring support</li>
        <li>Get help with homework and learning challenges</li>
        <li>Receive guidance tailored to their academic goals</li>
        <li>Track their learning progress over time</li>
      </ul>
    </div>
    
    <!-- Features box (same styling as acceptance) -->
    <div class="info-box">
      <h3 style="color: #15803d; margin-top: 0;">What You Can Expect:</h3>
      <ul>
        <li>Weekly email summaries of {{student_name}}'s learning activities</li>
        <li>Safe, monitored, and educationally focused interactions</li>
        <li>Progress insights and learning recommendations</li>
        <li>24/7 access to AI learning support</li>
      </ul>
    </div>
    
    <!-- Next steps (same styling as acceptance) -->
    <div class="next-steps">
      <p style="margin: 0;"><strong>Getting Started:</strong> {{student_name}} can log in at <a href="{{login_url}}">{{login_url}}</a> and start exploring immediately!</p>
    </div>
    
    <p>We're thrilled to support {{student_name}}'s learning journey. If you have any questions, please feel free to contact us at {{support_email}}.</p>
    
    <p>Best regards,<br>The {{platform_name}} Team</p>
    
    <!-- Footer (same as acceptance template) -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      <p>This email was sent to {{guardian_email}} because {{student_name}} registered for {{platform_name}}.</p>
      <p>© {{current_date}} {{platform_name}}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

## Step 3: Dynamic Template Variables

Use the exact same variables as your acceptance template:

- `{{student_name}}` - Student's full name
- `{{guardian_email}}` - Parent/guardian email
- `{{platform_name}}` - Your platform name (RaiCRUITED)
- `{{current_date}}` - Current date
- `{{login_url}}` - App login URL
- `{{support_email}}` - Support email address

## Step 4: Add Template ID to Environment

Once you create the template, add the ID to your `.env.local`:

```env
SENDGRID_WELCOME_TEMPLATE_ID=d-your-new-welcome-template-id
```

## Step 5: Test the Template

Use the SendGrid template editor's "Send Test" feature to ensure it looks correct before deploying.

---

**Note**: Copy the exact styling, colors, and structure from your existing acceptance template to maintain visual consistency across all your emails.