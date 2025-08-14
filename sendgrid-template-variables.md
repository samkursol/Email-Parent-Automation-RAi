# SendGrid Acceptance Email Template Variables

## Available Variables for Your SendGrid Template

When designing your SendGrid acceptance email template, you can use these variables:

### Student Information
- `{{student_name}}` - Properly capitalized student name (e.g., "Samuel Slobodien")
- `{{guardian_email}}` - Parent/guardian email address

### Platform Information  
- `{{platform_name}}` - "rAIcruited"
- `{{current_date}}` - Current date when email is sent
- `{{support_email}}` - support@raicruited.com

### URLs & Links
- `{{onboarding_url}}` - **NEW**: https://onboardingre-production.up.railway.app
- `{{login_url}}` - Main platform URL
- `{{logo_url}}` - rAIcruited logo URL for email headers

### Recipient Context
- `{{recipient_type}}` - Either "parent" or "student" (to customize content)

## Example Template Usage

```html
<h1>Congratulations {{student_name}}!</h1>

<p>Dear {{#if (eq recipient_type "parent")}}Parent/Guardian{{else}}{{student_name}}{{/if}},</p>

<p>We're excited to inform you that {{student_name}}'s application has been accepted!</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{onboarding_url}}" 
     style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
    Start Onboarding Process
  </a>
</div>

<p>Next steps:</p>
<ul>
  <li>Click the button above to complete your onboarding</li>
  <li>Set up your profile and preferences</li>
  <li>Begin your learning journey with {{platform_name}}</li>
</ul>

<p>If you have questions, contact us at {{support_email}}</p>

<p>Best regards,<br>The {{platform_name}} Team</p>
```

## Email Recipients

The acceptance email is automatically sent to **both**:
1. **Parent/Guardian**: {{guardian_email}}
2. **Student**: Student's email from their profile

Both emails include the same onboarding link and information, but you can customize content using the `recipient_type` variable.

## Template Configuration

Make sure your SendGrid template ID is set in your environment:
```bash
SENDGRID_ACCEPTANCE_TEMPLATE_ID=d-e6b1afbc618a457fbba38ebd9843af85
```

The system will automatically populate all these variables when sending acceptance emails!