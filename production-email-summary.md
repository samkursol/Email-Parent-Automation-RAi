# 🚀 rAIcruited Production Email Automation

## 📧 **Two Automated Emails in Production**

### 1. **Acceptance Email** 
**Trigger**: When a student is approved/accepted
**Recipients**: Both parent AND student
**Content**: 
- Congratulations message
- Onboarding link: https://onboardingre-production.up.railway.app
- rAIcruited branding
- Professional formatting

### 2. **Weekly Summary Email**
**Trigger**: Every Sunday at 9:00 AM (configurable)
**Recipients**: Parents only
**Content**:
- AI-generated summary of student's conversations
- Safety alerts (if inappropriate content detected)
- Weekly activity stats
- rAIcruited branding

---

## ⚙️ **How to Use the System**

### **Send Acceptance Email** (Manual Trigger)
```javascript
const emailService = require('./services/emailService');
emailService.sendAcceptanceEmail('student-id-here');
```

### **Start Automated Weekly Summaries**
```bash
node start-email-scheduler.js
```

### **Test Weekly Summary** (Manual Trigger)
```javascript
const emailService = require('./services/emailService');
emailService.sendWeeklySummaryEmail('student-id-here');
```

---

## 🎨 **Current Branding Configuration**

**Platform Name**: rAIcruited
**From Email**: noreply@raicruited.com
**Logo**: GitHub-hosted rAIcruited logo
**Styling**: Professional, uniform black text (no blue)
**Student Names**: Automatically capitalized

---

## 📊 **Environment Variables**

```bash
# Email Configuration
SENDGRID_FROM_EMAIL=noreply@raicruited.com
SENDGRID_FROM_NAME="rAIcruited"
SENDGRID_API_KEY=...
SENDGRID_ACCEPTANCE_TEMPLATE_ID=d-e6b1afbc618a457fbba38ebd9843af85

# Platform Configuration
PLATFORM_NAME="rAIcruited"
SUPPORT_EMAIL=support@raicruited.com

# URLs
rAIcruited_ONBOARDING_URL=https://onboardingre-production.up.railway.app
rAIcruited_LOGO_URL=https://raw.githubusercontent.com/samkursol/Email-Parent-Automation-RAi/main/public/assets/raicruited-logo-long.png

# Database
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://gsrgorjbifkvwcbpzbgg.supabase.co

# AI
OPENAI_API_KEY=...

# Scheduling (Optional - for weekly emails)
WEEKLY_EMAIL_DAY=0     # 0=Sunday
WEEKLY_EMAIL_HOUR=9    # 9 AM
WEEKLY_EMAIL_MINUTE=0  # :00
```

---

## 🔄 **Automated Weekly Email Flow**

1. **Every Sunday at 9:00 AM**: System triggers automatically
2. **Database Scan**: Finds all students with guardian emails
3. **Conversation Check**: Gets chat history from past 7 days
4. **AI Analysis**: Generates intelligent summaries + safety alerts
5. **Email Delivery**: Sends to parents (only if conversations exist)
6. **Logging**: Reports success/failure for monitoring

**Result**: Parents get weekly updates about their child's learning activities and any safety concerns.

---

## 🎯 **SendGrid Template Variables**

For your acceptance email template, use these variables:

```html
{{student_name}} - "Samuel Slobodien" (capitalized)
{{platform_name}} - "rAIcruited"
{{onboarding_url}} - "https://onboardingre-production.up.railway.app"
{{recipient_type}} - "parent" or "student"
{{support_email}} - "support@raicruited.com"
{{logo_url}} - rAIcruited logo URL
{{current_date}} - Today's date
```

---

## 🚀 **Production Deployment**

### **Option 1: Manual Control**
- Send acceptance emails as needed via API calls
- Start weekly scheduler when ready: `node start-email-scheduler.js`

### **Option 2: Full Automation**
- Use PM2 for production: `pm2 start start-email-scheduler.js --name "raicruited-emails"`
- Weekly emails run automatically every Sunday
- Acceptance emails triggered by your application

---

## ✅ **System Status: Ready for Production**

- ✅ **Acceptance emails**: Configured with onboarding link
- ✅ **Weekly summaries**: AI-powered with safety monitoring
- ✅ **Branding**: Complete rAIcruited styling
- ✅ **Authentication**: SPF/DKIM/DMARC configured
- ✅ **Professional formatting**: No emojis, uniform styling
- ✅ **Database integration**: Full Supabase connectivity
- ✅ **Error handling**: Comprehensive logging and monitoring

**Your email automation system is production-ready for the two core email types!** 🎉