# 🚀 rAIcruited Email Automation System

Complete email automation system for parent notifications with AI-powered summaries and professional branding.

## 📧 **Two Production Email Types**

### 1. **Acceptance Email**
- **Trigger**: When a student is approved (manual)
- **Recipients**: Both parent AND student
- **Contains**: Onboarding link + rAIcruited branding
- **Usage**: `emailService.sendAcceptanceEmail(studentId)`

### 2. **Weekly Summary Email** 
- **Trigger**: Automated every Sunday at 9:00 AM
- **Recipients**: Parents only
- **Contains**: AI-generated conversation summaries + safety alerts
- **Usage**: Runs automatically via scheduler

## 🎯 **Key Features**

✅ **Professional rAIcruited Branding**
- Custom logo integration
- Consistent styling across all emails
- Professional formatting (no emojis)

✅ **AI-Powered Content**
- OpenAI-generated conversation summaries
- Safety monitoring for inappropriate content
- Parent alerts for concerning behavior

✅ **Smart Automation**
- Only sends weekly emails if student had conversations
- Automatic name capitalization
- Rate limiting and error handling

✅ **Parent Engagement**
- Access reminder: "log in using your child's credentials"
- Weekly activity statistics
- Direct onboarding integration

## 🔧 **Quick Start**

### **Environment Setup**
Copy `.env.local.example` to `.env.local` and configure:
```bash
# SendGrid
SENDGRID_API_KEY=your-key
SENDGRID_FROM_EMAIL=noreply@raicruited.com
SENDGRID_FROM_NAME="rAIcruited"

# Supabase
SUPABASE_SERVICE_ROLE_KEY=your-key
NEXT_PUBLIC_SUPABASE_URL=your-url

# OpenAI
OPENAI_API_KEY=your-key

# rAIcruited
rAIcruited_ONBOARDING_URL=https://onboardingre-production.up.railway.app
rAIcruited_LOGO_URL=your-logo-url
```

### **Install Dependencies**
```bash
npm install
```

### **Start Weekly Automation**
```bash
node start-email-scheduler.js
```

### **Manual Testing**
```bash
# Test weekly summary
node test-manual-weekly.js

# Test acceptance email
node -e "
require('dotenv').config({ path: '.env.local' });
const emailService = require('./services/emailService');
emailService.sendAcceptanceEmail('user-id-here');
"
```

## 📁 **Key Files**

- `services/emailService.js` - Main email service with all templates
- `services/schedulerService.js` - Automated weekly email scheduler  
- `start-email-scheduler.js` - Production scheduler starter
- `production-email-summary.md` - Complete system documentation
- `sendgrid-template-variables.md` - Template variable reference

## 🎨 **Email Templates**

**Acceptance Email**: Uses SendGrid dynamic template
**Weekly Summary**: Generated HTML with AI content

Both include:
- rAIcruited logo header
- Professional styling
- Branded footer
- Mobile-responsive design

## 🔒 **Security & Safety**

- Environment variables for all sensitive data
- AI monitoring for inappropriate student content
- Parent alerts for safety concerns
- Email authentication (SPF/DKIM/DMARC)

## 📊 **Database Integration**

**Tables Used:**
- `profiles` - Student information
- `student_statistics` - Guardian emails
- `chat_histories` - Conversation data for summaries

**Permissions**: Uses Supabase Service Role Key for full access

## 🚀 **Production Ready**

- Complete error handling
- Logging and monitoring
- Rate limiting
- Professional branding
- Automated scheduling
- Safety monitoring

---

**Status**: ✅ Production Ready  
**Last Updated**: January 2025  
**Contact**: sam@kursol.io